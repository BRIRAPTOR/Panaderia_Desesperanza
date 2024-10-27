const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json()); // Usando la opción nativa de express para JSON
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
    const { nombre, descripcion, precio, stock, imagen } = req.body; // Eliminamos 'categoria'
    const query = 'INSERT INTO productos (nombre, descripcion, precio, stock, imagen) VALUES (?, ?, ?, ?, ?)'; // Eliminamos 'categoria'

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
    const { nombre, descripcion, precio, stock, imagen } = req.body; // Eliminamos 'categoria'
    const query = 'UPDATE productos SET nombre=?, descripcion=?, precio=?, stock=?, imagen=? WHERE id=?'; // Eliminamos 'categoria'

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

// Manejar rutas no encontradas
app.use((req, res) => {
    res.status(404).send('ERROR 404 NOT FOUND');
});

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});

