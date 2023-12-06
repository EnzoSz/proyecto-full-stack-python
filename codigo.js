//productos
import { importarProductos } from "./productos.js";

let contadorCarrito = 0;
let contadorCarritoSpan;

function actualizarContadorCarrito() {
  contadorCarritoSpan.textContent = contadorCarrito.toString();
}

document.addEventListener("DOMContentLoaded", () => {
  let carrito = [];
  let ordenDeCompra = null;
  let observer = null;
  let totalDiv;

  //capturo el contenedor del boton del carrito
  const verCarrito = document.querySelector("#carrito");
  //capturo el contenedor de carrito
  const contenedorModal = document.querySelector("#modal-container");
  //variable para guardar los productos en el carrito
  contadorCarritoSpan = document.querySelector("#carrito");

  // Función para iniciar el observer
  function iniciarObserver() {
    // Selecciona el nodo objetivo
    const targetNode = ordenDeCompra;

    // Opciones para el observer (configuración)
    const config = { childList: true, subtree: true };

    // Función de retorno de llamada para manejar los cambios observados
    const callback = function (mutationsList, observer) {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList") {
          // Si hay un cambio en el contenido de la orden, actualiza el total
          actualizarTotal();
        }
      }
    };

    // Crea un nuevo observer con la función de retorno de llamada y las opciones
    observer = new MutationObserver(callback);

    // Inicia la observación del nodo objetivo
    observer.observe(targetNode, config);
  }

  // Función para detener el observer
  function detenerObserver() {
    if (observer) {
      observer.disconnect();
    }
  }

  // Función para actualizar el total
  function actualizarTotal() {
    if (!totalDiv) {
      return;
    }
    const total = carrito.reduce((acc, el) => acc + el.precio * el.cantidad, 0);
    // const totalDiv = document.querySelector(".modal-footer .modal-title");
    totalDiv.innerText = `Total: $ ${total}`;
  }

  let contenedorPastas;

  //logica para mostrar los productos en el html
  importarProductos().then((data) => {
    const currentPage = window.location.pathname.split("/").pop();

    if (currentPage !== "index.html" && currentPage !== "pagina3.html") {
      contenedorPastas = document.querySelector("#listaPastas");
    }

    // Actualiza el número en el ícono del carrito
    function actualizarContadorCarrito() {
      contadorCarritoSpan.textContent = contadorCarrito.toString();
    }

    if (contenedorPastas) {
      data.forEach((producto) => {
        // Crea un nuevo elemento div con la clase card
        const cardDiv = document.createElement("div");
        cardDiv.className = "card";

        // Crea el contenido interno de la tarjeta
        cardDiv.innerHTML = `
        <img src="${producto.foto}" class="card-img-top">
        <div class="card-body">
          <h3 class="card-title">${producto.nombre}</h3>
          <p class="card-descrip">${producto.descripcion}</p>
          <p class="card-precio">Precio $ ${producto.precio}</p>
        </div>
      `;

        // Agrega la tarjeta al contenedor
        contenedorPastas.appendChild(cardDiv);

        let comprar = document.createElement("button");
        comprar.className = "botonAgregar";
        comprar.innerText = "Agregar";
        cardDiv.appendChild(comprar);

        // escuchador de eventos para el boton comprar
        comprar.addEventListener("click", () => {
          const productoEnCarrito = carrito.find((p) => p.id === producto.id);

          if (productoEnCarrito) {
            productoEnCarrito.cantidad += 1;
          } else {
            carrito.push({
              id: producto.id,
              img: producto.foto,
              nombre: producto.nombre,
              precio: producto.precio,
              cantidad: 1,
            });
          }
          contadorCarrito++;
          actualizarContadorCarrito();
          Swal.fire({
            title: "Fantástico!",
            text: `Agregaste ${producto.nombre} al carrito`,
            imageUrl: producto.foto,
            imageWidth: 130,
            imageHeight: 130,
            imageAlt: producto.nombre,
            confirmButtonColor: "#382e2c",
          });
          actualizarOrdenCompleta();
        });
      });
    }

    if (verCarrito) {
      verCarrito.addEventListener("click", () => {
        if (ordenDeCompra === null) {
          ordenDeCompra = document.createElement("div");
          ordenDeCompra.className = "modal-body";
          contenedorModal.appendChild(ordenDeCompra);
        }
        iniciarObserver();
        actualizarOrden();

        contenedorModal.style.display = "block";

        ordenDeCompra.scrollIntoView({ behavior: "smooth" });
      });
    }
  });

  function actualizarOrden() {
    if (!ordenDeCompra) {
      return;
    }
    ordenDeCompra.innerHTML = "";

    const tituloOrden = document.createElement("h1");
    tituloOrden.innerText = "Mi Orden de Compra";
    ordenDeCompra.appendChild(tituloOrden);

    carrito.forEach((producto, index) => {
      const productoDiv = document.createElement("div");
      productoDiv.innerHTML = `
        <img src="${producto.img}" class="card-img-top">
        <div class="card-body">
          <h3 class="card-title">${producto.nombre}</h3>
          <p class="card-precio">Precio $ ${producto.precio}</p>
          <div class="cantidad-container">
            <button class="btn-restar" data-index="${index}">Restar</button>
            <p class="cantidad"> ${producto.cantidad}</p>
            <button class="btn-sumar" data-index="${index}">Sumar</button>
          </div>
        </div>
        <button class="btn-close" data-index="${index}">X</button>
      `;
      ordenDeCompra.appendChild(productoDiv);

      const sumarButton = productoDiv.querySelector(".btn-sumar");
      sumarButton.addEventListener("click", () => {
        carrito[index].cantidad += 1;
        actualizarOrden();
      });

      const restarButton = productoDiv.querySelector(".btn-restar");
      restarButton.addEventListener("click", () => {
        if (carrito[index].cantidad > 1) {
          carrito[index].cantidad -= 1;
        } else {
          carrito.splice(index, 1);
        }
        actualizarOrden();
      });

      const closeButton = productoDiv.querySelector(".btn-close");
      closeButton.addEventListener("click", () => {
        const indexToDelete = parseInt(
          closeButton.getAttribute("data-index"),
          10
        );
        carrito.splice(indexToDelete, 1);
        actualizarOrden();

        contadorCarrito--;
        // actualizarContadorCarrito();
      });
    });

    const total = carrito.reduce((acc, el) => acc + el.precio * el.cantidad, 0);
    const totalDiv = document.createElement("div");
    totalDiv.className = "modal-footer";
    totalDiv.innerHTML = `<h5 class="modal-title">Total: $ ${total}</h5>`;
    ordenDeCompra.appendChild(totalDiv);

    const finalizarBtn = document.createElement("button");
    finalizarBtn.id = "finalizar";
    finalizarBtn.innerText = "Finalizar Compra";
    ordenDeCompra.appendChild(finalizarBtn);

    finalizarBtn.onclick = () => {
      Toastify({
        text: "Gracias por tu compra! Ya empezamos a preparar tu pedido",
        duration: 3000,
        gravity: "top",
        position: "right",
        close: true,
        style: {
          background: "#737375",
        },
        offset: {
          x: 150,
          y: 110,
        },
      }).showToast();

      ordenDeCompra.innerHTML = "";
      ordenDeCompra = null;

      contadorCarrito = 0;
      actualizarContadorCarrito();

      carrito = [];
      detenerObserver();
    };
  }

  // Función para actualizar la orden completa
  function actualizarOrdenCompleta() {
    actualizarOrden();
    actualizarTotal();
  }
});
