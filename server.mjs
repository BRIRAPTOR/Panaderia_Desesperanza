import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'n0m3l0',
    database: 'panaderia_desesperanza'
});

db.connect(err => {
    if (err) {
        console.error('Error en la conexión con la base de datos: ', err);
        return;
    }
    console.log('Conexión a la base de datos establecida.');
});

// CRUD - Productos

// Crear Producto
app.post('/productos', (req, res) => {
    const { nombre, descripcion, precio, stock, imagen } = req.body;
    const query = 'INSERT INTO productos (nombre, descripcion, precio, stock, imagen) VALUES (?, ?, ?, ?, ?)';

    db.query(query, [nombre, descripcion, precio, stock, imagen], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error en el servidor' });
        res.status(201).json({ id: results.insertId });
    });
});

// Leer Productos
app.get('/productos', (req, res) => {
    db.query('SELECT * FROM productos', (err, results) => {
        if (err) return res.status(500).json({ error: 'Error en el servidor' });
        res.json(results);
    });
});

// Actualizar Producto
app.put('/productos/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precio, stock, imagen } = req.body;
    const query = 'UPDATE productos SET nombre=?, descripcion=?, precio=?, stock=?, imagen=? WHERE id=?';

    db.query(query, [nombre, descripcion, precio, stock, imagen, id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error en el servidor' });
        if (results.affectedRows === 0) return res.status(404).json({ error: 'Producto no encontrado' });
        res.send('Producto actualizado');
    });
});

// Eliminar Producto
app.delete('/productos/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM productos WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error en el servidor' });
        if (results.affectedRows === 0) return res.status(404).json({ error: 'Producto no encontrado' });
        res.send('Producto eliminado');
    });
});


// Registro de usuario
app.post('/registro', async (req, res) => {
    const { nombre_usuario, correo, contrasena } = req.body;

    if (!nombre_usuario || !correo || !contrasena) {
        return res.status(400).send('Todos los campos son obligatorios.');
    }

    const hash = await bcrypt.hash(contrasena, 10);

    try {
        await db.query('INSERT INTO usuarios (nombre_usuario, correo, contrasena) VALUES (?, ?, ?)', 
        [nombre_usuario, correo, hash]);
        res.status(201).send('Usuario registrado correctamente.');
    } catch (error) {
        res.status(400).send('Error al registrar usuario.');
    }
});

// Inicio de sesión
app.post('/login', async (req, res) => {
    const { nombre_usuario, contrasena } = req.body;

    const [user] = await db.query('SELECT * FROM usuarios WHERE nombre_usuario = ?', [nombre_usuario]);

    if (!user || !(await bcrypt.compare(contrasena, user.contrasena))) {
        return res.status(401).send('Usuario o contraseña incorrectos.');
    }

    const token = jwt.sign({ id: user.id, rol: user.rol }, 'secreto', { expiresIn: '1h' });
    res.json({ token });
});

// CRUD del carrito

// Agregar producto al carrito
app.post('/carrito', async (req, res) => {
    const { usuario_id, producto_id, cantidad } = req.body;

    const [producto] = await db.query('SELECT * FROM productos WHERE id = ?', [producto_id]);

    if (!producto || producto.stock < cantidad) {
        return res.status(400).send('Stock insuficiente o producto no encontrado.');
    }

    await db.query('INSERT INTO carrito (usuario_id, producto_id, cantidad) VALUES (?, ?, ?)', 
    [usuario_id, producto_id, cantidad]);
    res.status(200).send('Producto añadido al carrito.');
});

// Procesar compra
app.post('/comprar', async (req, res) => {
    const { usuario_id } = req.body;

    const [fondosUsuario] = await db.query('SELECT fondos FROM usuarios WHERE id = ?', [usuario_id]);

    const carrito = await db.query(`
        SELECT c.*, p.precio 
        FROM carrito c 
        JOIN productos p ON c.producto_id = p.id 
        WHERE c.usuario_id = ?`, [usuario_id]);

    const total = carrito.reduce((sum, item) => sum + item.cantidad * item.precio, 0);

    if (fondosUsuario.fondos < total) {
        return res.status(400).send('Fondos insuficientes.');
    }

    await db.query('UPDATE usuarios SET fondos = fondos - ? WHERE id = ?', [total, usuario_id]);

    const [compra] = await db.query('INSERT INTO historial_compras (usuario_id, total) VALUES (?, ?)', 
    [usuario_id, total]);

    carrito.forEach(async (item) => {
        await db.query('INSERT INTO detalle_compras (historial_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)', 
        [compra.insertId, item.producto_id, item.cantidad, item.precio]);

        await db.query('UPDATE productos SET stock = stock - ? WHERE id = ?', [item.cantidad, item.producto_id]);
    });

    await db.query('DELETE FROM carrito WHERE usuario_id = ?', [usuario_id]);
    res.status(200).send('Compra realizada con éxito.');
});


// Manejar rutas no encontradas
app.use((req, res) => {
    res.status(404).send('ERROR 404 NOT FOUND');
});

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});