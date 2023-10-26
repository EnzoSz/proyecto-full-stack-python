let contenedorPastas = document.getElementById("listaPastas");

for (const producto of pastas) {
  // Crea un nuevo elemento div con las clases "card" y "col"
  const cardDiv = document.createElement("div");
  cardDiv.classList.add("card", "col-md-6", "col-lg-4", "cards");

  // Crea el contenido interno de la tarjeta
  cardDiv.innerHTML = `
    <img src="${producto.foto}" class="card-img-top">
    <div class="card-body">
        <h3 class="card-title">${producto.nombre}</h3>
        <p class="card-text">Precio $ ${producto.precio}</p>
        <button id="${producto.id}" class="botoncompra">Comprar</button>
    </div>
  `;

  // Agrega la tarjeta al contenedor
  contenedorPastas.appendChild(cardDiv);
}
