const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Conectar a la base de datos SQLite
const db = new sqlite3.Database('./tareas.db', (err) => {
    if (err) {
        console.error('Error al abrir la base de datos:', err.message);
    } else {
        console.log('Conexión exitosa a la base de datos SQLite.');
    }
});

// Crear tabla si no existe
db.run(`CREATE TABLE IF NOT EXISTS tareas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    completada INTEGER DEFAULT 0,
    nombre TEXT NOT NULL,
    fecha TEXT NOT NULL,
    prjct_nombre TEXT NOT NULL
)`);

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// Agregar tarea
app.post('/tareas', (req, res) => {
    const { nombre, fecha, prjct_nombre } = req.body;
    const query = `INSERT INTO tareas (nombre, fecha, prjct_nombre) VALUES (?, ?, ?)`;
    db.run(query, [nombre, fecha, prjct_nombre], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID, nombre, fecha, prjct_nombre, completada: 0 });
    });
});

// Obtener todas las tareas
app.get('/tareas', (req, res) => {
    const query = `SELECT * FROM tareas ORDER BY completada, id`;
    db.all(query, [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ tareas: rows });
    });
});

// Eliminar tarea
app.delete('/tareas/:id', (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM tareas WHERE id = ?`;
    db.run(query, id, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ message: 'Tarea eliminada correctamente' });
    });
});

// Actualizar tarea
app.put('/tareas/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const { completada } = req.body;

    const query = `UPDATE tareas SET completada = ? WHERE id = ?`;
    db.run(query, [completada, taskId], function(err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ message: 'Tarea actualizada', changes: this.changes });
    });
});