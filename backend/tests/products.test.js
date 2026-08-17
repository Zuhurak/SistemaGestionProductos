const request = require("supertest");
const { expect } = require("chai");

const app = require("../app");

describe("API de productos", function () {

    let productoId;

    // Prueba 1
    it("Debe obtener todos los productos", async function () {

        const response = await request(app)
            .get("/api/products");

        expect(response.status).to.equal(200);
        expect(response.body).to.be.an("array");
    });


    // Prueba 2
    it("Debe crear un producto correctamente", async function () {

        const producto = {
            nombre: "Producto de prueba",
            descripcion: "Producto creado durante las pruebas",
            precio: 500,
            categoria: "Pruebas",
            stock: 10
        };

        const response = await request(app)
            .post("/api/products")
            .send(producto);

        expect(response.status).to.equal(201);

        expect(response.body)
            .to.have.property("producto");

        expect(response.body.producto)
            .to.have.property("id");

        productoId =
            response.body.producto.id;
    });


    // Prueba 3
    it("Debe obtener un producto por ID", async function () {

        const response = await request(app)
            .get(`/api/products/${productoId}`);

        expect(response.status).to.equal(200);

        expect(response.body.id)
            .to.equal(productoId);
    });


    // Prueba 4
    it("Debe buscar productos por nombre", async function () {

        const response = await request(app)
            .get("/api/products/search/Producto");

        expect(response.status).to.equal(200);

        expect(response.body)
            .to.be.an("array");
    });


    // Prueba 5
    it("Debe actualizar un producto", async function () {

        const productoActualizado = {
            nombre: "Producto actualizado",
            descripcion: "Descripcion actualizada",
            precio: 750,
            categoria: "Pruebas",
            stock: 20
        };

        const response = await request(app)
            .put(`/api/products/${productoId}`)
            .send(productoActualizado);

        expect(response.status).to.equal(200);

        expect(response.body.producto.nombre)
            .to.equal("Producto actualizado");

        expect(response.body.producto.precio)
            .to.equal(750);
    });


    // Prueba 6
    it("Debe rechazar un producto con precio negativo", async function () {

        const producto = {
            nombre: "Producto invalido",
            descripcion: "Prueba de validacion",
            precio: -100,
            categoria: "Pruebas",
            stock: 10
        };

        const response = await request(app)
            .post("/api/products")
            .send(producto);

        expect(response.status).to.equal(400);

        expect(response.body.error)
            .to.equal("El precio no puede ser negativo");
    });


    // Prueba 7
    it("Debe rechazar un producto con stock negativo", async function () {

        const producto = {
            nombre: "Producto invalido",
            descripcion: "Prueba de stock",
            precio: 100,
            categoria: "Pruebas",
            stock: -5
        };

        const response = await request(app)
            .post("/api/products")
            .send(producto);

        expect(response.status).to.equal(400);

        expect(response.body.error)
            .to.equal(
                "El stock debe ser un numero entero mayor o igual a 0"
            );
    });


    // Prueba 8
    it("Debe rechazar un producto sin nombre", async function () {

        const producto = {
            nombre: "",
            descripcion: "Producto sin nombre",
            precio: 100,
            categoria: "Pruebas",
            stock: 10
        };

        const response = await request(app)
            .post("/api/products")
            .send(producto);

        expect(response.status).to.equal(400);

        expect(response.body.error)
            .to.equal("El nombre es obligatorio");
    });


    // Prueba 9
    it("Debe rechazar un ID invalido", async function () {

        const response = await request(app)
            .get("/api/products/abc");

        expect(response.status).to.equal(400);

        expect(response.body.error)
            .to.equal(
                "El ID debe ser un numero entero positivo"
            );
    });


    // Prueba 10
    it("Debe eliminar un producto", async function () {

        const response = await request(app)
            .delete(`/api/products/${productoId}`);

        expect(response.status).to.equal(200);

        expect(response.body.mensaje)
            .to.equal(
                "Producto eliminado correctamente"
            );
    });


    // Prueba 11
    it("Debe devolver 404 si el producto no existe", async function () {

        const response = await request(app)
            .get(`/api/products/${productoId}`);

        expect(response.status).to.equal(404);

        expect(response.body.error)
            .to.equal("Producto no encontrado");
    });

});