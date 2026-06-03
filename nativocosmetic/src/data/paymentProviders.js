export const paymentProviders = [
  {
    id: "webpay",
    name: "Webpay",
    configured: true,
    sandboxUrl: "https://sandbox.webpay.cl",
    productionUrl: "https://webpay.cl",
  },
  {
    id: "mercadopago",
    name: "Mercado Pago",
    configured: true,
    sandboxUrl: "https://sandbox.mercadopago.com",
    productionUrl: "https://www.mercadopago.cl",
  },
];

export const testCards = [
  "Aprobado: cualquier tarjeta válida, por ejemplo 4242 4242 4242 4242.",
  "Rechazado: usa una tarjeta terminada en 0000.",
  "Error de conexión: usa una tarjeta terminada en 9999.",
];
