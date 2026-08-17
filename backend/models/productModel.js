const db = require("../database/database");

// Obtener todos los productos
function getAllProducts() {
    return db.prepare(`
        SELECT * FROM productos
        ORDER BY id DESC
    `).all();
}

// Obtener un producto por ID
function getProductById(id) {
    return db.prepare(`
        SELECT * FROM productos
        WHERE id = ?
    `).get(id);
}

// Buscar productos por nombre
function searchProducts(nombre) {
    return db.prepare(`
        SELECT * FROM productos
        WHERE nombre LIKE ?
        ORDER BY id DESC
    `).all(`%${nombre}%`);
}

// Crear un producto
function createProduct(producto) {
    const { nombre, descripcion, precio, categoria, stock, disponible } = producto;

    const statement = db.prepare(`
        INSERT INTO productos
        (nombre, descripcion, precio, categoria, stock, disponible)
        VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = statement.run(
        nombre,
        descripcion,
        precio,
        categoria,
        stock,
        disponible
    );

    return getProductById(result.lastInsertRowid);
}

// Actualizar un producto
function updateProduct(id, producto) {
    const { nombre, descripcion, precio, categoria, stock, disponible } = producto;

    const statement = db.prepare(`
        UPDATE productos
        SET
            nombre = ?,
            descripcion = ?,
            precio = ?,
            categoria = ?,
            stock = ?,
            disponible = ?
        WHERE id = ?
    `);

    const result = statement.run(
        nombre,
        descripcion,
        precio,
        categoria,
        stock,
        disponible,
        id
    );

    if (result.changes === 0) {
        return null;
    }

    return getProductById(id);
}

// Eliminar un producto
function deleteProduct(id) {
    const statement = db.prepare(`
        DELETE FROM productos
        WHERE id = ?
    `);

    const result = statement.run(id);

    return result.changes > 0;
}

module.exports = {
    getAllProducts,
    getProductById,
    searchProducts,
    createProduct,
    updateProduct,
    deleteProduct
};