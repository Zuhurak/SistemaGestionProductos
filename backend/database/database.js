const Database = require("better-sqlite3");
const path = require("path");

// Ruta donde se almacenara la base de datos
const dbPath = path.join(__dirname, "productos.db");

// Crear o abrir la base de datos
const db = new Database(dbPath);

// Crear tabla de productos si no existe
db.exec(`
    CREATE TABLE IF NOT EXISTS productos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        descripcion TEXT,
        precio REAL NOT NULL,
        categoria TEXT NOT NULL,
        stock INTEGER NOT NULL DEFAULT 0,
        disponible INTEGER NOT NULL DEFAULT 1
    )
`);

console.log("Base de datos SQLite conectada correctamente");

module.exports = db;