const API_URL = "http://localhost:3000/api/products";

const formulario = document.getElementById("productForm");
const productoId = document.getElementById("productoId");

const nombre = document.getElementById("nombre");
const descripcion = document.getElementById("descripcion");
const precio = document.getElementById("precio");
const categoria = document.getElementById("categoria");
const stock = document.getElementById("stock");

const tabla = document.getElementById("tablaProductos");
const buscar = document.getElementById("buscar");

const mensaje = document.getElementById("mensaje");

const tituloFormulario =
    document.getElementById("tituloFormulario");

const btnGuardar =
    document.getElementById("btnGuardar");

const btnCancelar =
    document.getElementById("btnCancelar");

const btnBuscar =
    document.getElementById("btnBuscar");

const btnMostrarTodos =
    document.getElementById("btnMostrarTodos");


// Cargar productos al iniciar
document.addEventListener("DOMContentLoaded", () => {
    cargarProductos();
});


// Obtener todos los productos
async function cargarProductos() {

    try {

        const respuesta = await fetch(API_URL);

        if (!respuesta.ok) {
            throw new Error("No se pudieron obtener los productos");
        }

        const productos = await respuesta.json();

        mostrarProductos(productos);

    } catch (error) {

        console.error(error);

        mostrarMensaje(
            "Error al cargar los productos",
            true
        );
    }
}


// Mostrar productos en la tabla
function mostrarProductos(productos) {

    tabla.innerHTML = "";

    if (productos.length === 0) {

        tabla.innerHTML = `
            <tr>
                <td colspan="8">
                    No hay productos registrados
                </td>
            </tr>
        `;

        return;
    }

    productos.forEach(producto => {

        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${producto.id}</td>

            <td>${producto.nombre}</td>

            <td>${producto.descripcion || "Sin descripcion"}</td>

            <td>$${Number(producto.precio).toFixed(2)}</td>

            <td>${producto.categoria}</td>

            <td>${producto.stock}</td>

            <td>
                <span class="${
                    producto.disponible
                        ? "disponible"
                        : "no-disponible"
                }">
                    ${
                        producto.disponible
                            ? "Disponible"
                            : "No disponible"
                    }
                </span>
            </td>

            <td>

                <button
                    class="btn-editar"
                    onclick="editarProducto(${producto.id})"
                >
                    Editar
                </button>

                <button
                    class="btn-eliminar"
                    onclick="eliminarProducto(${producto.id})"
                >
                    Eliminar
                </button>

            </td>
        `;

        tabla.appendChild(fila);
    });
}


// Crear o actualizar producto
formulario.addEventListener("submit", async (event) => {

    event.preventDefault();

    const datos = {

        nombre: nombre.value.trim(),

        descripcion:
            descripcion.value.trim(),

        precio:
            Number(precio.value),

        categoria:
            categoria.value.trim(),

        stock:
            Number(stock.value)
    };


    try {

        let respuesta;

        // Actualizar
        if (productoId.value) {

            respuesta = await fetch(
                `${API_URL}/${productoId.value}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(datos)
                }
            );

        }

        // Crear
        else {

            respuesta = await fetch(
                API_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(datos)
                }
            );
        }


        const resultado =
            await respuesta.json();


        if (!respuesta.ok) {

            throw new Error(
                resultado.error ||
                "Error al procesar la solicitud"
            );
        }


        mostrarMensaje(
            resultado.mensaje
        );


        limpiarFormulario();

        cargarProductos();

    } catch (error) {

        console.error(error);

        mostrarMensaje(
            error.message,
            true
        );
    }
});


// Editar producto
async function editarProducto(id) {

    try {

        const respuesta =
            await fetch(`${API_URL}/${id}`);

        if (!respuesta.ok) {

            throw new Error(
                "No se pudo obtener el producto"
            );
        }

        const producto =
            await respuesta.json();


        productoId.value =
            producto.id;

        nombre.value =
            producto.nombre;

        descripcion.value =
            producto.descripcion || "";

        precio.value =
            producto.precio;

        categoria.value =
            producto.categoria;

        stock.value =
            producto.stock;


        tituloFormulario.textContent =
            "Editar producto";

        btnGuardar.textContent =
            "Actualizar producto";

        btnCancelar.style.display =
            "inline-block";


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    } catch (error) {

        console.error(error);

        mostrarMensaje(
            error.message,
            true
        );
    }
}


// Eliminar producto
async function eliminarProducto(id) {

    const confirmar =
        confirm(
            "Desea eliminar este producto?"
        );

    if (!confirmar) {
        return;
    }


    try {

        const respuesta =
            await fetch(
                `${API_URL}/${id}`,
                {
                    method: "DELETE"
                }
            );


        const resultado =
            await respuesta.json();


        if (!respuesta.ok) {

            throw new Error(
                resultado.error ||
                "No se pudo eliminar el producto"
            );
        }


        mostrarMensaje(
            resultado.mensaje
        );

        cargarProductos();

    } catch (error) {

        console.error(error);

        mostrarMensaje(
            error.message,
            true
        );
    }
}


// Buscar productos
async function buscarProductos() {

    const termino =
        buscar.value.trim();


    if (!termino) {

        cargarProductos();

        return;
    }


    try {

        const respuesta =
            await fetch(
                `${API_URL}/search/${encodeURIComponent(termino)}`
            );


        if (!respuesta.ok) {

            throw new Error(
                "Error al buscar productos"
            );
        }


        const productos =
            await respuesta.json();


        mostrarProductos(productos);

    } catch (error) {

        console.error(error);

        mostrarMensaje(
            error.message,
            true
        );
    }
}


// Boton buscar
btnBuscar.addEventListener(
    "click",
    buscarProductos
);


// Buscar al presionar Enter
buscar.addEventListener(
    "keypress",
    (event) => {

        if (event.key === "Enter") {

            buscarProductos();
        }
    }
);


// Mostrar todos
btnMostrarTodos.addEventListener(
    "click",
    () => {

        buscar.value = "";

        cargarProductos();
    }
);


// Cancelar edicion
btnCancelar.addEventListener(
    "click",
    () => {

        limpiarFormulario();
    }
);


// Limpiar formulario
function limpiarFormulario() {

    formulario.reset();

    productoId.value = "";

    tituloFormulario.textContent =
        "Registrar producto";

    btnGuardar.textContent =
        "Guardar producto";

    btnCancelar.style.display =
        "none";
}


// Mostrar mensajes
function mostrarMensaje(texto, error = false) {

    mensaje.textContent = texto;

    mensaje.style.display = "block";

    if (error) {

        mensaje.style.backgroundColor =
            "#f8d7da";

        mensaje.style.color =
            "#721c24";

    } else {

        mensaje.style.backgroundColor =
            "#d4edda";

        mensaje.style.color =
            "#155724";
    }


    setTimeout(() => {

        mensaje.style.display =
            "none";

    }, 3000);
}