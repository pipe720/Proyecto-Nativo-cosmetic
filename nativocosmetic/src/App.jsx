import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  CalendarCheck,
  CalendarDays,
  CalendarPlus,
  Check,
  CreditCard,
  Droplets,
  Leaf,
  Menu,
  Palette,
  Plus,
  Scissors,
  ShoppingBag,
  Sparkles,
  Sprout,
  Truck,
  Waves,
  X,
} from "lucide-react";
import { AGENDAPRO_URL, filters, products } from "./data/products.js";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import CartDrawer from "./components/CartDrawer.jsx";
import ProductCard from "./components/ProductCard.jsx";
import "./styles.css";

const icons = {
  all: Sparkles,
  hidratacion: Droplets,
  caida: Sprout,
  detox: Waves,
  color: Palette,
};

const formatPrice = (value) => (value ? `$${value.toLocaleString("es-CL")} CLP` : "Servicio");

function App() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [cart, setCart] = useState({});
  const [isCartOpen, setIsCartOpen] = useState(false);

  const visibleProducts = useMemo(() => {
    if (activeFilter === "all") return products;
    return products.filter((product) => product.need === activeFilter);
  }, [activeFilter]);

  const cartItems = useMemo(
    () =>
      Object.entries(cart).map(([id, quantity]) => ({
        ...products.find((product) => product.id === id),
        quantity,
      })),
    [cart]
  );

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const addToCart = (product) => {
    setCart((currentCart) => ({
      ...currentCart,
      [product.id]: (currentCart[product.id] || 0) + 1,
    }));
    setIsCartOpen(true);
  };

  const updateQuantity = (productId, direction) => {
    setCart((currentCart) => {
      const nextQuantity = (currentCart[productId] || 0) + direction;
      const nextCart = { ...currentCart };

      if (nextQuantity <= 0) {
        delete nextCart[productId];
      } else {
        nextCart[productId] = nextQuantity;
      }

      return nextCart;
    });
  };

  const checkoutByEmail = () => {
    const detail = cartItems.map((item) => `${item.quantity} x ${item.name}`).join(", ");
    const subject = encodeURIComponent("Pedido Nativo Cosmetic");
    const body = encodeURIComponent(`Hola, quiero confirmar este pedido: ${detail || "sin productos aún"}.`);
    window.location.href = `mailto:contacto@nativocosmetic.com?subject=${subject}&body=${body}`;
  };

  return (
    <>
      <Header
        agendaproUrl={AGENDAPRO_URL}
        cartCount={cartCount}
        icons={{ CalendarDays, Menu, ShoppingBag }}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main id="inicio">
        <Hero agendaproUrl={AGENDAPRO_URL} icons={{ CalendarCheck, ShoppingBag }} />

        <section className="trust-strip" aria-label="Beneficios de compra">
          <article>
            <Leaf aria-hidden="true" />
            <strong>Ingredientes naturales</strong>
            <span>Extractos y aceites de origen botánico.</span>
          </article>
          <article>
            <Truck aria-hidden="true" />
            <strong>Envíos a todo Chile</strong>
            <span>Retiro disponible en Providencia.</span>
          </article>
          <article>
            <Scissors aria-hidden="true" />
            <strong>Salón orgánico</strong>
            <span>Servicios capilares con enfoque consciente.</span>
          </article>
        </section>

        <section className="section diagnostic" id="diagnostico">
          <div className="section-heading">
            <p className="eyebrow">Elige por necesidad</p>
            <h2>Encuentra rápido lo que tu cabello necesita.</h2>
          </div>
          <div className="need-grid" role="list">
            {filters.map((filter) => {
              const Icon = icons[filter.id];
              return (
                <button
                  className={`need-card ${activeFilter === filter.id ? "active" : ""}`}
                  key={filter.id}
                  type="button"
                  onClick={() => setActiveFilter(filter.id)}
                >
                  <Icon aria-hidden="true" />
                  <span>{filter.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="section products-section" id="productos">
          <div className="section-heading split">
            <div>
              <p className="eyebrow">Tienda</p>
              <h2>Productos destacados</h2>
            </div>
            <a className="text-link" href="https://nativocosmetic.com/collections/cabello" target="_blank" rel="noreferrer">
              Ver catálogo actual
              <ArrowUpRight aria-hidden="true" />
            </a>
          </div>
          <div className="product-grid">
            {visibleProducts.map((product) => (
              <ProductCard
                agendaproUrl={AGENDAPRO_URL}
                formatPrice={formatPrice}
                icons={{ CalendarPlus, Plus }}
                key={product.id}
                product={product}
                onAdd={addToCart}
              />
            ))}
          </div>
        </section>

        <section className="booking-band" id="salon">
          <div>
            <p className="eyebrow">Salón en Providencia</p>
            <h2>Reserva tintura orgánica, diagnóstico o tratamiento capilar.</h2>
            <p>Agenda tu hora en pocos pasos y vive la experiencia Nativo en Holanda 099, Studio 603.</p>
          </div>
          <a className="button primary dark" href={AGENDAPRO_URL} target="_blank" rel="noreferrer">
            <CalendarDays aria-hidden="true" />
            Tomar hora en Agendapro
          </a>
        </section>

        <section className="section story" id="historia">
          <img
            src="https://nativocosmetic.com/cdn/shop/files/img47c.jpg?v=1740169688&width=1500"
            alt="Salón Nativo Cosmetic"
          />
          <div>
            <p className="eyebrow">Marca con origen</p>
            <h2>Fórmulas creadas desde una peluquería orgánica.</h2>
            <p>
              Nativo combina experiencia profesional, materias primas naturales y una mirada sustentable del cuidado capilar.
              La nueva web debe convertir esa historia en confianza, compra y reserva.
            </p>
            <ul className="story-list">
              <li>
                <Check aria-hidden="true" /> Productos organizados por problema capilar.
              </li>
              <li>
                <Check aria-hidden="true" /> Compra simple con carrito visible.
              </li>
              <li>
                <Check aria-hidden="true" /> Reserva directa a Agendapro.
              </li>
            </ul>
          </div>
        </section>
      </main>

      <CartDrawer
        agendaproUrl={AGENDAPRO_URL}
        cartItems={cartItems}
        formatPrice={formatPrice}
        icons={{ CalendarCheck, CreditCard, ShoppingBag, X }}
        isOpen={isCartOpen}
        total={cartTotal}
        onCheckout={checkoutByEmail}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={updateQuantity}
      />

      <footer className="site-footer">
        <strong>Nativo Cosmetic</strong>
        <span>Cosmética capilar natural, tienda online y salón orgánico.</span>
      </footer>
    </>
  );
}

export default App;
