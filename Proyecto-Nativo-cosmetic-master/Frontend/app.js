// URL externa utilizada para reservar servicios desde la tienda.
const AGENDAPRO_URL = "https://www.agendapro.com/";

// Catálogo temporal del frontend. Más adelante puede obtenerse desde la API del backend.
const products = [
  {
    id: "acond-cola",
    name: "Acondicionador Cola de Caballo",
    description: "Hidrata, repara y ayuda a sellar la fibra capilar.",
    need: "hidratacion",
    tag: "Hidrata y repara",
    price: 10900,
    image: "https://nativocosmetic.com/cdn/shop/files/rn-image_picker_lib_temp_567e1f42-b270-4261-89df-b623f570aea6.jpg?v=1778790897&width=533",
  },
  {
    id: "acond-ortiga",
    name: "Acondicionador Ortiga y Aloe Vera",
    description: "Aporta suavidad y fortaleza para uso frecuente.",
    need: "hidratacion",
    tag: "Fortalece",
    price: 10900,
    image: "https://nativocosmetic.com/cdn/shop/files/rn-image_picker_lib_temp_2e761406-2a72-4c73-8f61-6b9ca077cc1f.jpg?v=1778790897&width=533",
  },
  {
    id: "shampoo-cola",
    name: "Shampoo Cola de Caballo",
    description: "Formula para fuerza, brillo y crecimiento saludable.",
    need: "caida",
    tag: "Fuerza y brillo",
    price: 9900,
    image: "https://nativocosmetic.com/cdn/shop/files/rn-image_picker_lib_temp_8f574f34-3c6b-4339-b89b-e5310e44203d.jpg?v=1778790885&width=533",
  },
  {
    id: "shampoo-ortiga",
    name: "Shampoo Ortiga Romero",
    description: "Pensado para caida, fuerza y cuero cabelludo activo.",
    need: "caida",
    tag: "Control caida",
    price: 9900,
    image: "https://nativocosmetic.com/cdn/shop/files/rn-image_picker_lib_temp_7ab5e8b6-247e-4746-8945-2d90f1e5093f.jpg?v=1778777487&width=533",
  },
  {
    id: "shampoo-detox",
    name: "Shampoo Detox Carbón Vegetal",
    description: "Limpieza purificante para retirar residuos y equilibrar.",
    need: "detox",
    tag: "Purificante",
    price: 9900,
    image: "https://nativocosmetic.com/cdn/shop/files/img35.jpg?v=1739990322&width=1500",
  },
  {
    id: "tintura-organica",
    name: "Tintura orgánica profesional",
    description: "Coloración consciente para reservar servicio en salón.",
    need: "color",
    tag: "Reserva salón",
    price: 0,
    image: "https://nativocosmetic.com/cdn/shop/files/NZ6_8081_c11486f5-312e-4cfa-b845-9f3f8a681b34.jpg?v=1739990329&width=1500",
    booking: true,
  },
];

// Estado local del carrito y utilidad para mostrar precios en pesos chilenos.
const cart = new Map();
const formatPrice = (value) => value ? `$${value.toLocaleString("es-CL")} CLP` : "Servicio";

// Referencias a los elementos principales de la interfaz.
const productGrid = document.querySelector("[data-product-grid]");
const cartPanel = document.querySelector(".cart-panel");
const overlay = document.querySelector("[data-overlay]");
const cartItems = document.querySelector("[data-cart-items]");
const cartEmpty = document.querySelector("[data-cart-empty]");
const cartTotal = document.querySelector("[data-cart-total]");
const cartCount = document.querySelector("[data-cart-count]");
const nav = document.querySelector(".main-nav");
const navToggle = document.querySelector(".nav-toggle");

document.querySelectorAll('a[href="https://www.agendapro.com/"]').forEach((link) => {
  link.href = AGENDAPRO_URL;
});

// Muestra los productos y aplica el filtro seleccionado por necesidad capilar.
function renderProducts(filter = "todos") {
  const visibleProducts = filter === "todos" ? products : products.filter((product) => product.need === filter);

  productGrid.innerHTML = visibleProducts.map((product) => `
    <article class="product-card">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="product-content">
        <span class="tag">${product.tag}</span>
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="product-bottom">
          <span class="price">${formatPrice(product.price)}</span>
          ${
            product.booking
              ? `<button class="add-button" type="button" data-book="${product.id}" style="background-color: black; color: white; border-radius: 5px; padding: 5px 10px; cursor: pointer;">📅 Reservar</button>`
              : `<button class="add-button" type="button" data-add="${product.id}" aria-label="Agregar ${product.name}"><i data-lucide="plus"></i></button>`
          }
        </div>
      </div>
    </article>
  `).join("");

  refreshIcons();
}

// Actualiza productos, cantidades y total visibles dentro del carrito.
function renderCart() {
  const items = [...cart.values()];
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  cartCount.textContent = totalQuantity;
  cartTotal.textContent = formatPrice(totalPrice).replace("Servicio", "$0 CLP");
  cartEmpty.classList.toggle("hidden", items.length > 0);

  cartItems.innerHTML = items.map((item) => `
    <article class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div>
        <strong>${item.name}</strong>
        <span>${formatPrice(item.price)}</span>
      </div>
      <div class="quantity" aria-label="Cantidad ${item.name}">
        <button type="button" data-decrease="${item.id}" aria-label="Disminuir">-</button>
        <b>${item.quantity}</b>
        <button type="button" data-increase="${item.id}" aria-label="Aumentar">+</button>
        <button type="button" data-remove="${item.id}" style="color: red; margin-left: 10px; border: none; background: transparent; cursor: pointer;" aria-label="Eliminar">🗑️</button>
      </div>
    </article>
  `).join("");
}

// Agrega un producto al carrito o aumenta su cantidad actual.
function addToCart(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;

  const current = cart.get(productId);
  cart.set(productId, { ...product, quantity: current ? current.quantity + 1 : 1 });
  renderCart();
  openCart();
}

// Modifica la cantidad y elimina el producto cuando llega a cero.
function updateQuantity(productId, direction) {
  const current = cart.get(productId);
  if (!current) return;

  const nextQuantity = current.quantity + direction;
  if (nextQuantity <= 0) {
    cart.delete(productId);
  } else {
    cart.set(productId, { ...current, quantity: nextQuantity });
  }
  renderCart();
}

// Elimina completamente un producto seleccionado del carrito.
function removeFromCart(productId) {
  cart.delete(productId);
  renderCart();
}

// Controla la apertura y cierre visual del carrito lateral.
function openCart() {
  cartPanel.classList.add("open");
  overlay.classList.add("open");
  cartPanel.setAttribute("aria-hidden", "false");
}

function closeCart() {
  cartPanel.classList.remove("open");
  overlay.classList.remove("open");
  cartPanel.setAttribute("aria-hidden", "true");
}

function refreshIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// Delegación de eventos para productos, filtros, carrito y reservas.
document.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add]");
  const increaseButton = event.target.closest("[data-increase]");
  const decreaseButton = event.target.closest("[data-decrease]");
  const removeButton = event.target.closest("[data-remove]");
  const bookButton = event.target.closest("[data-book]");
  const filterButton = event.target.closest("[data-filter]");

  if (addButton) addToCart(addButton.dataset.add);
  if (increaseButton) updateQuantity(increaseButton.dataset.increase, 1);
  if (decreaseButton) updateQuantity(decreaseButton.dataset.decrease, -1);
  if (removeButton) removeFromCart(removeButton.dataset.remove);

  // Lógica de RF-07: Eliminar del carrito
// Lógica de RF-15: Sistema de reservas y Formulario
  if (bookButton) {
    const productId = bookButton.dataset.book;
    const producto = products.find(p => p.id === productId);
    
    const hoy = new Date();
    const hoyStr = hoy.toISOString().split('T')[0];

    const modalHTML = `
      <div id="reserva-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); display: flex; justify-content: center; align-items: center; z-index: 9999;">
        <div style="background: white; padding: 25px; border-radius: 10px; width: 320px; color: black; font-family: sans-serif;">
          <h3 style="margin-top: 0;">Reservar Hora</h3>
          <p style="font-size: 14px; color: #555;">Servicio: <strong>${producto.name}</strong></p>
          <form id="form-reserva" style="display: flex; flex-direction: column; gap: 10px;">
            <div>
              <label style="font-size: 13px; font-weight: bold;">Tu Nombre:</label><br>
              <input type="text" id="reserva-cliente" required placeholder="Ej: Isidora Arellano" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
            </div>
            <div>
              <label style="font-size: 13px; font-weight: bold;">Día:</label><br>
              <input type="date" id="reserva-dia" min="${hoyStr}" required style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
            </div>
            <div>
              <label style="font-size: 13px; font-weight: bold;">Hora:</label><br>
              <input type="time" id="reserva-hora" required style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
            </div>
            <div>
              <label style="font-size: 13px; font-weight: bold;">Profesional a cargo:</label><br>
              <select id="reserva-profesional" required style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                <option value="">Selecciona un profesional...</option>
                <option value="Felipe Valenzuela">Felipe Valenzuela</option>
                <option value="Elías Sánchez">Elías Sánchez</option>
                <option value="Renato Arcos">Renato Arcos</option>
              </select>
            </div>
            <div>
              <label style="font-size: 13px; font-weight: bold;">Tipo de corte:</label><br>
              <select id="reserva-tipo" required style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                <option value="">Selecciona un estilo...</option>
                <option value="Corte Mujer">Corte Mujer</option>
                <option value="Corte Hombre">Corte Hombre</option>
                <option value="Tintura / Coloración">Tintura / Coloración</option>
              </select>
            </div>
            <button type="submit" style="background: black; color: white; padding: 12px; border: none; border-radius: 4px; cursor: pointer; margin-top: 10px; font-weight: bold;">Confirmar Reserva</button>
            <button type="button" id="cerrar-modal" style="background: #e0e0e0; color: black; padding: 12px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">Cancelar</button>
          </form>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    document.getElementById("cerrar-modal").addEventListener("click", () => {
      document.getElementById("reserva-modal").remove();
    });

    document.getElementById("form-reserva").addEventListener("submit", async (e) => {
      e.preventDefault();
      const diaElegido = document.getElementById("reserva-dia").value;
      const horaElegida = document.getElementById("reserva-hora").value;
      
      if (diaElegido === hoyStr) {
        const horaActual = hoy.getHours() + ":" + hoy.getMinutes().toString().padStart(2, '0');
        if (horaElegida < horaActual) {
          alert("No puedes reservar en una hora que ya pasó.");
          return;
        }
      }

      // AQUÍ AGREGAMOS EL CLIENTE PARA QUE MONGODB LO ACEPTE
      const datosReserva = {
        cliente: document.getElementById("reserva-cliente").value,
        dia: diaElegido,
        hora: horaElegida,
        profesional: document.getElementById("reserva-profesional").value,
        tipoCorte: document.getElementById("reserva-tipo").value
      };

      try {
        const response = await fetch("http://localhost:3900/api/reservas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datosReserva)
        });

        if (response.ok) {
          alert("Reserva de hora aceptada.\n\nTe hemos enviado una copia de la reserva a tu correo electrónico.");
          document.getElementById("reserva-modal").remove();
        } else {
          alert("La reserva no se pudo guardar. Verifica tu Backend.");
        }
      } catch (error) {
        console.error("Error conectando al backend:", error);
        alert("Error de conexión con la base de datos.");
      }
    });
  }

  if (filterButton) {
    document.querySelectorAll("[data-filter]").forEach((button) => button.classList.remove("active"));
    filterButton.classList.add("active");
    renderProducts(filterButton.dataset.filter);
    document.querySelector("#productos").scrollIntoView({ behavior: "smooth", block: "start" });
  }
});

document.querySelector(".cart-open").addEventListener("click", openCart);
document.querySelector(".cart-close").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

// Abre o cierra el menú de navegación en pantallas pequeñas.
navToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

// Prepara el pedido, lo guarda temporalmente y redirige a la pestaña de pago.
document.querySelector("[data-checkout]").addEventListener("click", () => {
  const items = [...cart.values()];

  if (!items.length) {
    alert("Agrega al menos un producto antes de continuar al pago.");
    return;
  }

  const pedido = {
    id: `PED-${Date.now()}`,
    items,
    total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    estado: "pendiente_pago",
    fecha: new Date().toISOString(),
  };

  localStorage.setItem("nativoCheckout", JSON.stringify(pedido));
  window.location.href = "pago.html";
});

// Render inicial de la tienda.
document.getElementById("cancelar-reserva-btn")
?.addEventListener("click", () => {

  const modalHTML = `
    <div id="cancelar-modal" style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.6);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    ">

      <div style="
        background: white;
        width: 380px;
        padding: 25px;
        border-radius: 10px;
        color: black;
        font-family: sans-serif;
      ">

        <h3>Cancelar Reserva</h3>

        <label>
          Nombre utilizado en la reserva:
        </label>

        <input
          type="text"
          id="buscar-cliente"
          style="
            width:100%;
            padding:8px;
            margin-top:8px;
            margin-bottom:12px;
            border:1px solid #ccc;
            border-radius:4px;
          "
        >

        <button
          id="buscar-reserva"
          style="
            width:100%;
            padding:10px;
            background:black;
            color:white;
            border:none;
            border-radius:4px;
            cursor:pointer;
          "
        >
          Buscar Reserva
        </button>

        <div id="resultado-reserva" style="margin-top:15px;"></div>

        <button
          id="cerrar-cancelacion"
          style="
            width:100%;
            padding:10px;
            margin-top:15px;
            background:#e0e0e0;
            border:none;
            border-radius:4px;
            cursor:pointer;
          "
        >
          Cerrar
        </button>

      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);

  document
    .getElementById("cerrar-cancelacion")
    .addEventListener("click", () => {
      document.getElementById("cancelar-modal").remove();
    });

  document
    .getElementById("buscar-reserva")
    .addEventListener("click", async () => {

      const nombreCliente =
        document.getElementById("buscar-cliente").value.trim();

      if (!nombreCliente) {
        alert("Ingrese un nombre.");
        return;
      }

      try {

        const response = await fetch(
          "http://localhost:3900/api/reservas"
        );

        const data = await response.json();

        const reservas = data.reservas || [];

        const reservaEncontrada = reservas.find(
          reserva =>
            reserva.cliente.toLowerCase() ===
            nombreCliente.toLowerCase()
        );

        const resultado =
          document.getElementById("resultado-reserva");

        if (!reservaEncontrada) {

          resultado.innerHTML = `
            <p style="color:red;">
              No se encontró una reserva.
            </p>
          `;

          return;
        }

        resultado.innerHTML = `
          <div style="
            border:1px solid #ddd;
            padding:10px;
            border-radius:6px;
            margin-top:10px;
          ">

            <p><strong>Cliente:</strong>
            ${reservaEncontrada.cliente}</p>

            <p><strong>Fecha:</strong>
            ${new Date(
              reservaEncontrada.dia
            ).toLocaleDateString()}</p>

            <p><strong>Hora:</strong>
            ${reservaEncontrada.hora}</p>

            <p><strong>Profesional:</strong>
            ${reservaEncontrada.profesional}</p>

            <button
              id="eliminar-reserva"
              style="
                width:100%;
                padding:10px;
                background:#c62828;
                color:white;
                border:none;
                border-radius:4px;
                cursor:pointer;
              "
            >
              Eliminar Reserva
            </button>

          </div>
        `;

        document
          .getElementById("eliminar-reserva")
          .addEventListener("click", async () => {

            const eliminar = await fetch(
              `http://localhost:3900/api/reservas/${reservaEncontrada._id}`,
              {
                method: "DELETE"
              }
            );

            if (!eliminar.ok) {

              alert(
                "No fue posible eliminar la reserva."
              );

              return;
            }

            document.getElementById("resultado-reserva").innerHTML = `
  <div style="
    text-align:center;
    padding:20px;
  ">

    <h3 style="
      color:green;
      margin-bottom:10px;
    ">
      ✓ Reserva eliminada
    </h3>

    <p>
      La reserva fue eliminada correctamente.
    </p>

    <p style="
      color:#666;
      font-size:14px;
    ">
      Se ha enviado una confirmación al correo registrado.
    </p>

    <button
      id="cerrar-exito"
      style="
        margin-top:15px;
        padding:10px 20px;
        background:black;
        color:white;
        border:none;
        border-radius:4px;
        cursor:pointer;
      "
    >
      Aceptar
    </button>

  </div>
`;

document
  .getElementById("cerrar-exito")
  .addEventListener("click", () => {
    document
      .getElementById("cancelar-modal")
      .remove();
  });

          });

      } catch (error) {

        console.error(error);

        alert(
          "Error de conexión con el servidor."
        );

      }

    });

});


// Para editar
document.getElementById("editar-reserva-btn")
?.addEventListener("click", () => {

  const modalHTML = `
    <div id="editar-modal" style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.6);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    ">
      <div style="
        background: white;
        width: 380px;
        padding: 25px;
        border-radius: 10px;
        color: black;
        font-family: sans-serif;
      ">
        <h3>Editar Reserva</h3>

        <label>Nombre utilizado en la reserva:</label>
        <input type="text" id="buscar-cliente" style="width:100%; padding:8px; margin:8px 0; border:1px solid #ccc; border-radius:4px;">

        <button id="buscar-reserva" style="width:100%; padding:10px; background:black; color:white; border:none; border-radius:4px; cursor:pointer;">
          Buscar Reserva
        </button>

        <div id="resultado-reserva" style="margin-top:15px;"></div>

        <button id="cerrar-editar-modal" style="width:100%; padding:10px; margin-top:15px; background:#e0e0e0; border:none; border-radius:4px; cursor:pointer;">
          Cerrar
        </button>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);

  document.getElementById("cerrar-editar-modal").addEventListener("click", () => {
    document.getElementById("editar-modal").remove();
  });

  document.getElementById("buscar-reserva").addEventListener("click", async () => {
    const nombreCliente = document.getElementById("buscar-cliente").value.trim();
    if (!nombreCliente) {
      alert("Ingrese un nombre.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3900/api/reservas");
      const data = await response.json();
      const reservas = data.reservas || [];

      const reservaEncontrada = reservas.find(
        r => r.cliente.toLowerCase() === nombreCliente.toLowerCase()
      );

      const resultado = document.getElementById("resultado-reserva");

      if (!reservaEncontrada) {
        resultado.innerHTML = `<p style="color:red;">No se encontró una reserva a editar.</p>`;
        return;
      }

      // Mostrar formulario de edición con datos precargados
      resultado.innerHTML = `
        <form id="form-editar" style="display:flex; flex-direction:column; gap:10px;">
          <label>Cliente:</label>
          <input type="text" id="editar-cliente" value="${reservaEncontrada.cliente}" required>

          <label>Fecha:</label>
          <input type="date" id="editar-dia" value="${reservaEncontrada.dia.split('T')[0]}" required>

          <label>Hora:</label>
          <input type="time" id="editar-hora" value="${reservaEncontrada.hora}" required>

          <label>Profesional:</label>
<select id="editar-profesional" required style="padding:8px; border:1px solid #ccc; border-radius:4px;">
  <option value="">Selecciona un profesional...</option>
  <option value="Felipe Valenzuela" ${reservaEncontrada.profesional === "Felipe Valenzuela" ? "selected" : ""}>Felipe Valenzuela</option>
  <option value="Elías Sánchez" ${reservaEncontrada.profesional === "Elías Sánchez" ? "selected" : ""}>Elías Sánchez</option>
  <option value="Renato Arcos" ${reservaEncontrada.profesional === "Renato Arcos" ? "selected" : ""}>Renato Arcos</option>
</select>



          <button type="submit" style="background:#0277bd; color:white; padding:10px; border:none; border-radius:4px; cursor:pointer;">
            Guardar Cambios
          </button>
        </form>
      `;

      // Listener para guardar cambios
      document.getElementById("form-editar").addEventListener("submit", async (e) => {
        e.preventDefault();

        const nuevosDatos = {
          cliente: document.getElementById("editar-cliente").value,
          dia: document.getElementById("editar-dia").value,
          hora: document.getElementById("editar-hora").value,
          profesional: document.getElementById("editar-profesional").value
        };

        try {
          const editar = await fetch(`http://localhost:3900/api/reservas/${reservaEncontrada._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevosDatos)
          });

          if (!editar.ok) {
            alert("No fue posible editar la reserva.");
            return;
          }

          alert("✓ Reserva actualizada correctamente.");
          document.getElementById("editar-modal").remove();
        } catch (error) {
          console.error(error);
          alert("Error de conexión con el servidor.");
        }
      });

    } catch (error) {
      console.error(error);
      alert("Error de conexión con el servidor.");
    }
  });

});

renderProducts();
renderCart();
refreshIcons();
