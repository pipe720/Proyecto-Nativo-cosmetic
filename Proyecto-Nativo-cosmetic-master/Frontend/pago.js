// Proveedores de pago configurados para ambientes de prueba y producción.
const providers = {
  webpay: {
    name: "Webpay",
    sandbox: "https://sandbox.webpay.cl",
    production: "https://webpay.cl",
  },
  mercadopago: {
    name: "Mercado Pago",
    sandbox: "https://sandbox.mercadopago.com",
    production: "https://www.mercadopago.cl",
  },
};

// Referencias a los elementos utilizados por la pestaña de pago.
const form = document.querySelector("[data-payment-form]");
const providerSelect = document.querySelector("[data-provider]");
const environmentSelect = document.querySelector("[data-environment]");
const providerNote = document.querySelector("[data-provider-note]");
const statusBox = document.querySelector("[data-payment-status]");
const transactionBox = document.querySelector("[data-transaction]");
const submitButton = document.querySelector("[data-payment-submit]");
const summaryItems = document.querySelector("[data-summary-items]");
const summaryTotal = document.querySelector("[data-summary-total]");
const paymentTypeButtons = document.querySelectorAll("[data-payment-type]");

let paymentType = "debito";
let order = null;

// Utilidades de formato y limpieza de datos.
const formatPrice = (value) => `$${Number(value || 0).toLocaleString("es-CL")} CLP`;
const onlyDigits = (value) => value.replace(/\D/g, "");

// Recupera el pedido preparado previamente desde el carrito.
function readOrder() {
  try {
    return JSON.parse(localStorage.getItem("nativoCheckout"));
  } catch {
    return null;
  }
}

// Muestra el resumen del pedido o bloquea el pago cuando el carrito está vacío.
function renderOrder() {
  order = readOrder();

  if (!order?.items?.length) {
    summaryItems.innerHTML = "<p>No hay un pedido activo. Vuelve a la tienda y agrega productos al carrito.</p>";
    summaryTotal.textContent = "$0 CLP";
    submitButton.disabled = true;
    return;
  }

  summaryItems.innerHTML = order.items.map((item) => `
    <article>
      <span>${item.quantity} x ${item.name}</span>
      <strong>${formatPrice(item.price * item.quantity)}</strong>
    </article>
  `).join("");
  summaryTotal.textContent = formatPrice(order.total);
}

// Informa la URL segura correspondiente al PSP y ambiente seleccionado.
function updateProviderNote() {
  const provider = providers[providerSelect.value];
  const environment = environmentSelect.value;
  providerNote.textContent = `Conexión segura: ${provider[environment]}`;
}

// Valida el número de tarjeta mediante el algoritmo de Luhn.
function isValidCardNumber(value) {
  const digits = onlyDigits(value);
  if (digits.length < 13 || digits.length > 19) return false;

  let sum = 0;
  let shouldDouble = false;

  for (let index = digits.length - 1; index >= 0; index -= 1) {
    let digit = Number(digits[index]);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

// Verifica formato y vigencia de la fecha de expiración.
function isValidExpiry(value) {
  const match = value.match(/^(\d{2})\/(\d{2})$/);
  if (!match) return false;

  const month = Number(match[1]);
  const year = Number(`20${match[2]}`);
  if (month < 1 || month > 12) return false;

  return new Date(year, month) > new Date();
}

// Valida todos los campos antes de enviar la solicitud de pago.
function validateForm() {
  const values = Object.fromEntries(new FormData(form));
  const errors = {
    cardName: values.cardName.trim().length >= 3 ? "" : "Ingresa el nombre como aparece en la tarjeta.",
    cardNumber: isValidCardNumber(values.cardNumber) ? "" : "Ingresa un número de tarjeta válido.",
    expiry: isValidExpiry(values.expiry) ? "" : "Usa el formato MM/AA y una fecha vigente.",
    cvv: /^\d{3,4}$/.test(values.cvv) ? "" : "El CVV debe tener 3 o 4 dígitos.",
  };

  Object.entries(errors).forEach(([field, message]) => {
    document.querySelector(`[data-error="${field}"]`).textContent = message;
  });

  return {
    isValid: !Object.values(errors).some(Boolean),
    values,
  };
}

// Actualiza el mensaje visual según el resultado entregado por el PSP.
function setStatus(status, message) {
  statusBox.className = `payment-status ${status}`;
  statusBox.innerHTML = `
    ${status === "approved" ? '<i data-lucide="check-circle"></i>' : ""}
    ${status === "rejected" ? '<i data-lucide="x-circle"></i>' : ""}
    ${status === "connection-error" ? '<i data-lucide="alert-triangle"></i>' : ""}
    ${status === "processing" ? '<i data-lucide="refresh-cw"></i>' : ""}
    <span>${message}</span>
  `;
  window.lucide?.createIcons();
}

// Registra localmente una transacción aprobada.
// En producción, este registro debe realizarse desde el backend y MongoDB.
function registerApprovedTransaction() {
  const provider = providers[providerSelect.value];
  const transaction = {
    id: `TRX-${Date.now()}`,
    codigoAutorizacion: Math.random().toString(36).slice(2, 8).toUpperCase(),
    proveedor: provider.name,
    ambiente: environmentSelect.value,
    tipoPago: paymentType,
    pedido: order.id,
    total: order.total,
    estado: "aprobado",
    fecha: new Date().toISOString(),
  };

  order.estado = "pagado";
  localStorage.setItem("nativoCheckout", JSON.stringify(order));
  localStorage.setItem("nativoLastTransaction", JSON.stringify(transaction));

  transactionBox.hidden = false;
  transactionBox.innerHTML = `
    <strong>Transacción aprobada</strong>
    <span>ID: ${transaction.id}</span>
    <span>Autorización: ${transaction.codigoAutorizacion}</span>
    <span>PSP: ${transaction.proveedor}</span>
  `;
}

// Permite seleccionar débito o crédito.
paymentTypeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    paymentType = button.dataset.paymentType;
    paymentTypeButtons.forEach((item) => item.classList.toggle("active", item === button));
  });
});

providerSelect.addEventListener("change", updateProviderNote);
environmentSelect.addEventListener("change", updateProviderNote);

// Simula la comunicación con el PSP y procesa respuestas aprobadas o rechazadas.
// En producción, este bloque debe llamar a una ruta segura del backend.
form.addEventListener("submit", (event) => {
  event.preventDefault();
  transactionBox.hidden = true;

  const validation = validateForm();
  if (!validation.isValid || !order?.items?.length) {
    setStatus("rejected", "Revisa los datos antes de enviar el pago.");
    return;
  }

  submitButton.disabled = true;
  setStatus("processing", `Conectando de forma segura con ${providers[providerSelect.value].name}...`);

  window.setTimeout(() => {
    const cardNumber = onlyDigits(validation.values.cardNumber);

    if (cardNumber === "4000000000009995") {
      submitButton.disabled = false;
      setStatus("connection-error", "No fue posible conectar con el PSP. Puedes reintentar.");
      return;
    }

    if (cardNumber === "4000000000000002") {
      submitButton.disabled = false;
      setStatus("rejected", "Pago rechazado por el PSP. Intenta con otra tarjeta o método.");
      return;
    }

    registerApprovedTransaction();
    setStatus("approved", "Pago aprobado. La transacción fue registrada correctamente.");
    submitButton.textContent = "Pago completado";
  }, 1600);
});

// Inicializa el resumen, proveedor e iconos al cargar pago.html.
renderOrder();
updateProviderNote();
window.lucide?.createIcons();
