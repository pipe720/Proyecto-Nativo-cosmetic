export const AGENDAPRO_URL = "https://www.agendapro.com/";

export const filters = [
  { id: "all", label: "Todo" },
  { id: "hidratacion", label: "Hidratación" },
  { id: "caida", label: "Caída y fuerza" },
  { id: "detox", label: "Detox" },
  { id: "color", label: "Color orgánico" },
];

export const products = [
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
    description: "Fórmula para fuerza, brillo y crecimiento saludable.",
    need: "caida",
    tag: "Fuerza y brillo",
    price: 9900,
    image: "https://nativocosmetic.com/cdn/shop/files/rn-image_picker_lib_temp_8f574f34-3c6b-4339-b89b-e5310e44203d.jpg?v=1778790885&width=533",
  },
  {
    id: "shampoo-ortiga",
    name: "Shampoo Ortiga Romero",
    description: "Pensado para caída, fuerza y cuero cabelludo activo.",
    need: "caida",
    tag: "Control caída",
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
