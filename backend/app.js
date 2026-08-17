const express = require("express");

const app = express();
const PORT = 3000;

// Conectar la base de datos
require("./database/database");

// Importar rutas
const productRoutes = require("./routes/productRoutes");

// Middleware
app.use(express.json());

// Servir frontend
app.use(express.static("../frontend"));

// Ruta principal de la API
app.get("/api", (req, res) => {
    res.json({
        mensaje: "API de Gestion de Productos funcionando"
    });
});

// Rutas de productos
app.use("/api/products", productRoutes);

// Manejo de rutas inexistentes
app.use((req, res) => {
    res.status(404).json({
        error: "Ruta no encontrada"
    });
});

// Iniciar servidor solamente cuando se ejecuta directamente
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(
            `Servidor ejecutandose en http://localhost:${PORT}`
        );
    });
}

module.exports = app;