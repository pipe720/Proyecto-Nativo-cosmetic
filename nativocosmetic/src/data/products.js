export const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3900";

export const AGENDAPRO_URL = "https://www.agendapro.com/";

export const needFilters = [
  { id: "todos", label: "Todo", icon: "sparkles" },
  { id: "hidratacion", label: "Hidratacion", icon: "droplets" },
  { id: "caida", label: "Caida y fuerza", icon: "sprout" },
  { id: "detox", label: "Detox", icon: "waves" },
  { id: "color", label: "Color organico", icon: "palette" },
];

export function formatPrice(value) {
  return Number(value || 0) > 0 ? `$${Number(value).toLocaleString("es-CL")} CLP` : "Servicio";
}

function withoutAccents(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function inferNeed(category) {
  const text = withoutAccents(category);

  if (text.includes("hidra") || text.includes("acondicionador")) return "hidratacion";
  if (text.includes("caida") || text.includes("fuerza") || text.includes("ortiga")) return "caida";
  if (text.includes("detox") || text.includes("carbon") || text.includes("purif")) return "detox";
  if (text.includes("color") || text.includes("tint")) return "color";

  return "todos";
}

function resolveImageUrl(imageUrl) {
  if (!imageUrl) {
    return "https://nativocosmetic.com/cdn/shop/files/logo_nativo.png?v=1739992459&width=533";
  }

  if (/^https?:\/\//i.test(imageUrl)) {
    return imageUrl;
  }

  return `${API_BASE_URL}${imageUrl}`;
}

function isBookingProduct(product) {
  const price = Number(product.precioproducto || 0);
  const category = withoutAccents(product.categoriaproducto);
  const name = withoutAccents(product.nombreproducto);

  return price <= 0 || category.includes("color") || name.includes("tintura");
}

export function mapBackendProduct(product) {
  return {
    id: product._id || product.idproducto,
    name: product.nombreproducto,
    description: product.descripcionproducto || "Producto Nativo Cosmetic.",
    need: inferNeed(product.categoriaproducto),
    tag: product.categoriaproducto || "Producto",
    price: Number(product.precioproducto || 0),
    image: resolveImageUrl(product.imagenUrl),
    stock: product.stock,
    booking: isBookingProduct(product),
    source: "api",
  };
}

export function normalizeApiProducts(items) {
  return Array.isArray(items) ? items.map(mapBackendProduct) : [];
}
