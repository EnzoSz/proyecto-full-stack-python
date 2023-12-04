//productos
import { importarProductos } from "./productos.js";

document.addEventListener("DOMContentLoaded", () => {
  //capturo el contenedor del boton del carrito
  const verCarrito = document.querySelector("#carrito");
  //capturo el contenedor de carrito
  const contenedorModal = document.querySelector("#modal-container");
  //variable para guardar los productos en el carrito
  let carrito = [];

  //logica para mostrar los productos en el html
  importarProductos().then((data) => {
    let contenedorPastas = document.querySelector("#listaPastas");

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
          // agrego el producto al carrito
          carrito.push({
            id: producto.id,
            img: producto.foto,
            nombre: producto.nombre,
            precio: producto.precio,
          });
          // llamo a la funcion para mostrar el carrito
          console.log(carrito);
        });
      });
    } else {
      console.error("El contenedor de pastas no se encuentra en esta pagina.");
    }
  });

  if (verCarrito) {
    // logica para mostrar el carrito en el html

    //escuchador del evento para mostrar el carrito

    verCarrito.addEventListener("click", async () => {
      console.log("funciona");
      const modalHeader = document.createElement("div");
      modalHeader.className = "modal-header";
      modalHeader.innerHTML = `
  <h5 class="modal-title" id="exampleModalLabel">Mi Orden</h5> 
  `;
      contenedorModal.appendChild(modalHeader);

      const modalButton = document.createElement("button");
      modalButton.className = "btn-close";
      modalButton.innerText = "X";
      modalButton.addEventListener("click", () => {
        contenedorModal.style.display = "none"; //oculto el modal
      });
      modalHeader.appendChild(modalButton);

      carrito.forEach((producto, index) => {
        const modalBody = document.createElement("div");
        modalBody.className = "modal-body";
        modalBody.innerHTML = `
    <img src="${producto.img}" class="card-img-top">
    <div class="card-body">
        <h3 class="card-title">${producto.nombre}</h3>
        <p class="card-precio">Precio $ ${producto.precio}</p>
    </div>
    <button class="btn-close" data-index="${index}">X</button>
  `;
        contenedorModal.appendChild(modalBody);

        // Obtener el botón de cierre específico para esta orden
        const closeButton = modalBody.querySelector(".btn-close");

        // Escuchador de eventos para el botón de cierre
        closeButton.addEventListener("click", (event) => {
          // Obtener el índice desde el atributo data-index del botón clickeado
          const dataIndex = closeButton.getAttribute("data-index");

          // Verificar que el índice sea válido antes de eliminar
          if (dataIndex !== null) {
            const indexToDelete = parseInt(dataIndex, 10);
            carrito.splice(indexToDelete, 1); // Eliminar la orden del array
            modalBody.remove(); // Eliminar el elemento del DOM
            actualizarTotal(); // Actualizar el total después de eliminar
          }
        });
      });

      const total = carrito.reduce((acc, el) => acc + el.precio, 0);
      const modalFooter = document.createElement("div");
      modalFooter.className = "modal-footer";
      modalFooter.innerHTML = `
  <h5 class="modal-title">Total: $ ${total}</h5>`;
      contenedorModal.appendChild(modalFooter);
    });
  }

  // Función para actualizar el total después de eliminar una orden
  function actualizarTotal() {
    const total = carrito.reduce((acc, el) => acc + el.precio, 0);
    const modalFooter = contenedorModal.querySelector(".modal-footer");
    modalFooter.innerHTML = `
    <h5 class="modal-title">Total: $ ${total}</h5>`;
  }
});
