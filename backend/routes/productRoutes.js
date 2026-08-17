const express = require("express");

const router = express.Router();

const productController = require("../controllers/productController");

// Obtener todos los productos
router.get("/", productController.getProducts);

// Buscar productos por nombre
router.get("/search/:nombre", productController.searchProducts);

// Obtener un producto por ID
router.get("/:id", productController.getProduct);

// Crear un producto
router.post("/", productController.createProduct);

// Actualizar un producto
router.put("/:id", productController.updateProduct);

// Eliminar un producto
router.delete("/:id", productController.deleteProduct);

module.exports = router;