const AGENDAPRO_URL = "https://www.agendapro.com/";

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

const cart = new Map();
const formatPrice = (value) => value ? `$${value.toLocaleString("es-CL")} CLP` : "Servicio";

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
              ? `<a class="add-button" href="${AGENDAPRO_URL}" target="_blank" rel="noreferrer" aria-label="Reservar ${product.name}"><i data-lucide="calendar-plus"></i></a>`
              : `<button class="add-button" type="button" data-add="${product.id}" aria-label="Agregar ${product.name}"><i data-lucide="plus"></i></button>`
          }
        </div>
      </div>
    </article>
  `).join("");

  refreshIcons();
}

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
      </div>
    </article>
  `).join("");
}

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;

  const current = cart.get(productId);
  cart.set(productId, { ...product, quantity: current ? current.quantity + 1 : 1 });
  renderCart();
  openCart();
}

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

document.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add]");
  const increaseButton = event.target.closest("[data-increase]");
  const decreaseButton = event.target.closest("[data-decrease]");
  const filterButton = event.target.closest("[data-filter]");

  if (addButton) addToCart(addButton.dataset.add);
  if (increaseButton) updateQuantity(increaseButton.dataset.increase, 1);
  if (decreaseButton) updateQuantity(decreaseButton.dataset.decrease, -1);

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

navToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

document.querySelector("[data-checkout]").addEventListener("click", () => {
  const message = [...cart.values()]
    .map((item) => `${item.quantity} x ${item.name}`)
    .join(", ");
  const subject = encodeURIComponent("Pedido Nativo Cosmetic");
  const body = encodeURIComponent(`Hola, quiero confirmar este pedido: ${message || "sin productos aun"}.`);
  window.location.href = `mailto:contacto@nativocosmetic.com?subject=${subject}&body=${body}`;
});

renderProducts();
renderCart();
refreshIcons();