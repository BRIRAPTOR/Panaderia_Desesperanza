import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Configuración de la conexión a la base de datos
const db = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'n0m3l0',
    database: 'panaderia_desesperanza',
}).promise();  // Usamos promesas para la conexión

// Función para manejar errores en rutas asíncronas
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// CRUD - Productos
// Crear Producto
app.post('/productos', asyncHandler(async (req, res) => {
    const { nombre, descripcion, precio, stock, imagen } = req.body;

    const query = 'INSERT INTO productos (nombre, descripcion, precio, stock, imagen) VALUES (?, ?, ?, ?, ?)';
    const [result] = await db.query(query, [nombre, descripcion, precio, stock, imagen]);

    res.status(201).json({ id: result.insertId });
}));

// Leer Productos
app.get('/productos', asyncHandler(async (req, res) => {
    const [productos] = await db.query('SELECT * FROM productos');
    res.json(productos);
}));

// Actualizar Producto
app.put('/productos/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precio, stock, imagen } = req.body;

    const query = 'UPDATE productos SET nombre=?, descripcion=?, precio=?, stock=?, imagen=? WHERE id=?';
    const [result] = await db.query(query, [nombre, descripcion, precio, stock, imagen, id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: 'Producto no encontrado' });
    res.send('Producto actualizado');
}));

// Eliminar Producto
app.delete('/productos/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;

    const [result] = await db.query('DELETE FROM productos WHERE id = ?', [id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: 'Producto no encontrado' });
    res.send('Producto eliminado');
}));

// Registro de usuario
app.post('/registro', async (req, res) => {
    try {
        const { nombre_usuario, correo, contrasena } = req.body;

        // Validar que todos los campos estén presentes
        if (!nombre_usuario || !correo || !contrasena) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
        }

        // Validar formato del correo
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(correo)) {
            return res.status(400).json({ error: 'El formato del correo no es válido.' });
        }

        // Validar longitud de la contraseña
        if (contrasena.length < 6) {
            return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres.' });
        }

        // Hashear la contraseña
        const hash = await bcrypt.hash(contrasena, 10);

        // Insertar el nuevo usuario en la base de datos
        const [result] = await db.query(
            'INSERT INTO usuarios (nombre_usuario, correo, contrasena) VALUES (?, ?, ?)',
            [nombre_usuario, correo, hash]
        );

        // Respuesta exitosa
        res.status(201).json({ message: 'Usuario registrado correctamente.', id: result.insertId });
    } catch (error) {
        console.error('Error al registrar usuario:', error);

        // Si el correo o usuario ya existe
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'El nombre de usuario o correo ya está registrado.' });
        }

        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// Inicio de sesión
app.post('/login', asyncHandler(async (req, res) => {
    const { nombre_usuario, contrasena } = req.body;

    const [usuarios] = await db.query('SELECT * FROM usuarios WHERE nombre_usuario = ?', [nombre_usuario]);
    const usuario = usuarios[0];

    if (!usuario || !(await bcrypt.compare(contrasena, usuario.contrasena))) {
        return res.status(401).send('Usuario o contraseña incorrectos.');
    }

    const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, process.env.JWT_SECRET || 'secreto', { expiresIn: '1h' });
    res.json({ token });
}));

// Agregar producto al carrito
app.post('/carrito', asyncHandler(async (req, res) => {
    const { usuario_id, producto_id, cantidad } = req.body;

    const [productos] = await db.query('SELECT * FROM productos WHERE id = ?', [producto_id]);
    const producto = productos[0];

    if (!producto || producto.stock < cantidad) {
        return res.status(400).send('Stock insuficiente o producto no encontrado.');
    }

    await db.query('INSERT INTO carrito (usuario_id, producto_id, cantidad) VALUES (?, ?, ?)',
        [usuario_id, producto_id, cantidad]);

    res.status(200).send('Producto añadido al carrito.');
}));

// Procesar compra
app.post('/comprar', asyncHandler(async (req, res) => {
    const { usuario_id } = req.body;

    const [usuarios] = await db.query('SELECT fondos FROM usuarios WHERE id = ?', [usuario_id]);
    const fondosUsuario = usuarios[0];

    const [carrito] = await db.query(`SELECT c.*, p.precio FROM carrito c JOIN productos p ON c.producto_id = p.id WHERE c.usuario_id = ?`, [usuario_id]);

    if (!carrito.length) return res.status(400).send('El carrito está vacío.');

    const total = carrito.reduce((sum, item) => sum + item.cantidad * item.precio, 0);

    if (fondosUsuario.fondos < total) {
        return res.status(400).send('Fondos insuficientes.');
    }

    await db.query('UPDATE usuarios SET fondos = fondos - ? WHERE id = ?', [total, usuario_id]);

    const [compra] = await db.query('INSERT INTO historial_compras (usuario_id, total) VALUES (?, ?)', [usuario_id, total]);

    for (const item of carrito) {
        await db.query(
            'INSERT INTO detalle_compras (historial_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
            [compra.insertId, item.producto_id, item.cantidad, item.precio]
        );

        await db.query('UPDATE productos SET stock = stock - ? WHERE id = ?', [item.cantidad, item.producto_id]);
    }

    await db.query('DELETE FROM carrito WHERE usuario_id = ?', [usuario_id]);
    res.status(200).send('Compra realizada con éxito.');
}));

// Manejar rutas no encontradas
app.use((req, res) => {
    res.status(404).send('ERROR 404 NOT FOUND');
});

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
