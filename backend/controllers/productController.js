const productModel = require("../models/productModel");

// Obtener todos los productos
function getProducts(req, res) {
    try {
        const productos = productModel.getAllProducts();

        res.status(200).json(productos);
    } catch (error) {
        console.error("Error al obtener productos:", error);

        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
}

// Obtener un producto por ID
function getProduct(req, res) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                error: "El ID debe ser un numero entero positivo"
            });
        }

        const producto = productModel.getProductById(id);

        if (!producto) {
            return res.status(404).json({
                error: "Producto no encontrado"
            });
        }

        res.status(200).json(producto);
    } catch (error) {
        console.error("Error al obtener el producto:", error);

        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
}

// Buscar productos
function searchProducts(req, res) {
    try {
        const nombre = req.params.nombre.trim();

        if (!nombre) {
            return res.status(400).json({
                error: "Debe proporcionar un nombre para buscar"
            });
        }

        const productos = productModel.searchProducts(nombre);

        res.status(200).json(productos);
    } catch (error) {
        console.error("Error al buscar productos:", error);

        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
}

// Crear un producto
function createProduct(req, res) {
    try {
        const {
            nombre,
            descripcion,
            precio,
            categoria,
            stock,
            disponible
        } = req.body;

        // Validar nombre
        if (!nombre || nombre.trim() === "") {
            return res.status(400).json({
                error: "El nombre es obligatorio"
            });
        }

        // Validar categoria
        if (!categoria || categoria.trim() === "") {
            return res.status(400).json({
                error: "La categoria es obligatoria"
            });
        }

        // Validar precio
        if (precio === undefined || precio === null || precio === "") {
            return res.status(400).json({
                error: "El precio es obligatorio"
            });
        }

        if (Number(precio) < 0) {
            return res.status(400).json({
                error: "El precio no puede ser negativo"
            });
        }

        // Validar stock
        if (stock === undefined || stock === null || stock === "") {
            return res.status(400).json({
                error: "El stock es obligatorio"
            });
        }

        if (!Number.isInteger(Number(stock)) || Number(stock) < 0) {
            return res.status(400).json({
                error: "El stock debe ser un numero entero mayor o igual a 0"
            });
        }

        // Convertir valores numericos
        const nuevoProducto = {
            nombre: nombre.trim(),
            descripcion: descripcion ? descripcion.trim() : "",
            precio: Number(precio),
            categoria: categoria.trim(),
            stock: Number(stock),
            disponible: disponible === undefined
                ? Number(stock) > 0 ? 1 : 0
                : disponible ? 1 : 0
        };

        const producto = productModel.createProduct(nuevoProducto);

        res.status(201).json({
            mensaje: "Producto creado correctamente",
            producto
        });
    } catch (error) {
        console.error("Error al crear producto:", error);

        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
}

// Actualizar un producto
function updateProduct(req, res) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                error: "El ID debe ser un numero entero positivo"
            });
        }

        const productoExistente = productModel.getProductById(id);

        if (!productoExistente) {
            return res.status(404).json({
                error: "Producto no encontrado"
            });
        }

        const {
            nombre,
            descripcion,
            precio,
            categoria,
            stock,
            disponible
        } = req.body;

        // Validar nombre
        if (!nombre || nombre.trim() === "") {
            return res.status(400).json({
                error: "El nombre es obligatorio"
            });
        }

        // Validar categoria
        if (!categoria || categoria.trim() === "") {
            return res.status(400).json({
                error: "La categoria es obligatoria"
            });
        }

        // Validar precio
        if (precio === undefined || precio === null || precio === "") {
            return res.status(400).json({
                error: "El precio es obligatorio"
            });
        }

        if (Number(precio) < 0) {
            return res.status(400).json({
                error: "El precio no puede ser negativo"
            });
        }

        // Validar stock
        if (stock === undefined || stock === null || stock === "") {
            return res.status(400).json({
                error: "El stock es obligatorio"
            });
        }

        if (!Number.isInteger(Number(stock)) || Number(stock) < 0) {
            return res.status(400).json({
                error: "El stock debe ser un numero entero mayor o igual a 0"
            });
        }

        const productoActualizado = {
            nombre: nombre.trim(),
            descripcion: descripcion ? descripcion.trim() : "",
            precio: Number(precio),
            categoria: categoria.trim(),
            stock: Number(stock),
            disponible: disponible === undefined
                ? Number(stock) > 0 ? 1 : 0
                : disponible ? 1 : 0
        };

        const producto = productModel.updateProduct(
            id,
            productoActualizado
        );

        res.status(200).json({
            mensaje: "Producto actualizado correctamente",
            producto
        });
    } catch (error) {
        console.error("Error al actualizar producto:", error);

        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
}

// Eliminar un producto
function deleteProduct(req, res) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                error: "El ID debe ser un numero entero positivo"
            });
        }

        const producto = productModel.getProductById(id);

        if (!producto) {
            return res.status(404).json({
                error: "Producto no encontrado"
            });
        }

        productModel.deleteProduct(id);

        res.status(200).json({
            mensaje: "Producto eliminado correctamente"
        });
    } catch (error) {
        console.error("Error al eliminar producto:", error);

        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
}

module.exports = {
    getProducts,
    getProduct,
    searchProducts,
    createProduct,
    updateProduct,
    deleteProduct
};