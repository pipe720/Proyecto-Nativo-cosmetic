import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  CalendarCheck,
  CalendarDays,
  Check,
  CreditCard,
  Droplets,
  Leaf,
  Menu,
  Minus,
  Palette,
  Plus,
  Scissors,
  ShoppingBag,
  Sparkles,
  Sprout,
  Trash2,
  Truck,
  Waves,
  X,
} from "lucide-react";
import {
  AGENDAPRO_URL,
  API_BASE_URL,
  formatPrice,
  needFilters,
  normalizeApiProducts,
} from "./data/products";

const iconByName = {
  sparkles: Sparkles,
  droplets: Droplets,
  sprout: Sprout,
  waves: Waves,
  palette: Palette,
};

const professionals = ["Felipe Valenzuela", "Elias Sanchez", "Renato Arcos"];
const serviceTypes = ["Corte Mujer", "Corte Hombre", "Tintura / Coloracion"];

function getTodayInputValue() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 10);
}

function TiendaPublica() {
  const navigate = useNavigate();
  const [apiProducts, setApiProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productError, setProductError] = useState("");
  const [activeFilter, setActiveFilter] = useState("todos");
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [reservationState, setReservationState] = useState({ mode: null, product: null });

  useEffect(() => {
    let mounted = true;

    async function loadProducts() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/productos`);
        if (!response.ok) throw new Error("No fue posible cargar productos desde la API.");
        const data = await response.json();
        if (!mounted) return;
        setApiProducts(normalizeApiProducts(data));
        setProductError("");
      } catch (error) {
        if (!mounted) return;
        setApiProducts([]);
        setProductError("No se pudieron cargar productos desde la base de datos.");
      } finally {
        if (mounted) setLoadingProducts(false);
      }
    }

    loadProducts();
    const interval = window.setInterval(loadProducts, 15000);
    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, []);

  const visibleProducts = useMemo(() => {
    if (activeFilter === "todos") return apiProducts;
    return apiProducts.filter((product) => product.need === activeFilter);
  }, [activeFilter, apiProducts]);

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  function openReservation(mode, product = null) {
    setReservationState({ mode, product });
  }

  function closeReservation() {
    setReservationState({ mode: null, product: null });
  }

  function addToCart(product) {
    setCartItems((currentItems) => {
      const existing = currentItems.find((item) => item.id === product.id);
      if (!existing) return [...currentItems, { ...product, quantity: 1 }];

      return currentItems.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    });
    setCartOpen(true);
  }

  function updateQuantity(productId, direction) {
    setCartItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity + direction } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeFromCart(productId) {
    setCartItems((currentItems) => currentItems.filter((item) => item.id !== productId));
  }

  function checkout() {
    if (!cartItems.length) {
      window.alert("Agrega al menos un producto antes de continuar al pago.");
      return;
    }

    const order = {
      id: `PED-${Date.now()}`,
      items: cartItems,
      total: cartTotal,
      estado: "pendiente_pago",
      fecha: new Date().toISOString(),
    };

    localStorage.setItem("nativoCheckout", JSON.stringify(order));
    setCartOpen(false);
    navigate("/pago");
  }

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Inicio Nativo Cosmetic">
          <img
            src="https://nativocosmetic.com/cdn/shop/files/logo_nativo.png?v=1739992459&width=140"
            alt="Nativo Cosmetic"
          />
        </a>

        <button
          className="icon-button nav-toggle"
          type="button"
          aria-label="Abrir menu"
          aria-expanded={navOpen}
          onClick={() => setNavOpen((open) => !open)}
        >
          <Menu />
        </button>

        <nav className={`main-nav ${navOpen ? "open" : ""}`} aria-label="Navegacion principal">
          <a href="#productos" onClick={() => setNavOpen(false)}>
            Productos
          </a>
          <a href="#diagnostico" onClick={() => setNavOpen(false)}>
            Diagnostico
          </a>
          <a href="#salon" onClick={() => setNavOpen(false)}>
            Salon
          </a>
          <a href="#historia" onClick={() => setNavOpen(false)}>
            Marca
          </a>
        </nav>

        <div className="header-actions">
          <a className="ghost-action" href={AGENDAPRO_URL} target="_blank" rel="noreferrer">
            <CalendarDays />
            Reservar
          </a>
          <button
            className="icon-button cart-open"
            type="button"
            aria-label="Abrir carrito"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingBag />
            <span className="cart-count">{cartCount}</span>
          </button>
        </div>
      </header>

      <main id="inicio">
        <section className="hero">
          <picture className="hero-media">
            <img
              src="https://nativocosmetic.com/cdn/shop/files/NZ6_8050_0249fee2-a649-4ac4-bbe6-d73c460f0bed.jpg?v=1739990326&width=3200"
              alt="Productos Nativo en un entorno natural"
            />
          </picture>
          <div className="hero-content">
            <p className="eyebrow">Cosmetica capilar natural y consciente</p>
            <h1>Cuida tu cabello con formulas inspiradas en el sur de Chile.</h1>
            <p>
              Compra productos libres de sulfatos, parabenos y siliconas, o agenda una atencion
              en la primera peluqueria organica de Chile.
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#productos">
                <ShoppingBag />
                Comprar productos
              </a>
              <a className="button secondary" href={AGENDAPRO_URL} target="_blank" rel="noreferrer">
                <CalendarCheck />
                Reservar en Agendapro
              </a>
            </div>
          </div>
        </section>

        <section className="trust-strip" aria-label="Beneficios de compra">
          <article>
            <Leaf />
            <strong>Ingredientes naturales</strong>
            <span>Extractos y aceites de origen botanico.</span>
          </article>
          <article>
            <Truck />
            <strong>Envios a todo Chile</strong>
            <span>Retiro disponible en Providencia.</span>
          </article>
          <article>
            <Scissors />
            <strong>Salon organico</strong>
            <span>Servicios capilares con enfoque consciente.</span>
          </article>
        </section>

        <section className="section diagnostic" id="diagnostico">
          <div className="section-heading">
            <p className="eyebrow">Elige por necesidad</p>
            <h2>Encuentra rapido lo que tu cabello necesita.</h2>
          </div>
          <div className="need-grid" role="list">
            {needFilters.map((filter) => {
              const Icon = iconByName[filter.icon] || Sparkles;
              return (
                <button
                  className={`need-card ${activeFilter === filter.id ? "active" : ""}`}
                  type="button"
                  key={filter.id}
                  onClick={() => {
                    setActiveFilter(filter.id);
                    document.querySelector("#productos")?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }}
                >
                  <Icon />
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
            <a
              className="text-link"
              href="https://nativocosmetic.com/collections/cabello"
              target="_blank"
              rel="noreferrer"
            >
              Ver catalogo actual
              <ArrowUpRight />
            </a>
          </div>

          {productError && <p className="status-note">{productError}</p>}
          {loadingProducts && <p className="status-note">Cargando productos...</p>}
          {!loadingProducts && !productError && !apiProducts.length && (
            <p className="status-note">
              No hay productos cargados en la base de datos. Ejecuta el seed del backend o crea
              productos desde el panel admin.
            </p>
          )}
          {!loadingProducts && apiProducts.length > 0 && !visibleProducts.length && (
            <p className="status-note">No hay productos para este filtro.</p>
          )}

          <div className="product-grid">
            {visibleProducts.map((product) => (
              <article className="product-card" key={product.id}>
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                </div>
                <div className="product-content">
                  <span className="tag">{product.tag}</span>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  {product.stock !== undefined && (
                    <span className="stock-note">Stock: {product.stock} unidades</span>
                  )}
                  <div className="product-bottom">
                    <span className="price">{formatPrice(product.price)}</span>
                    {product.booking ? (
                      <button
                        className="button compact dark"
                        type="button"
                        onClick={() => openReservation("create", product)}
                      >
                        <CalendarDays />
                        Reservar
                      </button>
                    ) : (
                      <button
                        className="add-button"
                        type="button"
                        aria-label={`Agregar ${product.name}`}
                        onClick={() => addToCart(product)}
                      >
                        <Plus />
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="booking-band" id="salon">
          <div>
            <p className="eyebrow">Salon en Providencia</p>
            <h2>Reserva tintura organica, diagnostico o tratamiento capilar.</h2>
            <p>
              Agenda tu hora en pocos pasos y vive la experiencia Nativo en Holanda 099, Studio
              603.
            </p>
          </div>
          <div className="booking-actions">
            <a className="button primary dark" href={AGENDAPRO_URL} target="_blank" rel="noreferrer">
              <CalendarDays />
              Tomar hora en Agendapro
            </a>
            <button className="button secondary" type="button" onClick={() => openReservation("cancel")}>
              Cancelar reserva
            </button>
            <button className="button secondary" type="button" onClick={() => openReservation("edit")}>
              Editar reserva
            </button>
          </div>
        </section>

        <section className="section story" id="historia">
          <img
            src="https://nativocosmetic.com/cdn/shop/files/img47c.jpg?v=1740169688&width=1500"
            alt="Salon Nativo Cosmetic"
          />
          <div>
            <p className="eyebrow">Marca con origen</p>
            <h2>Formulas creadas desde una peluqueria organica.</h2>
            <p>
              Nativo combina experiencia profesional, materias primas naturales y una mirada
              sustentable del cuidado capilar. La web convierte esa historia en confianza, compra y
              reserva.
            </p>
            <ul className="story-list">
              <li>
                <Check /> Productos organizados por problema capilar.
              </li>
              <li>
                <Check /> Compra simple con carrito visible.
              </li>
              <li>
                <Check /> Reserva conectada con el backend.
              </li>
            </ul>
          </div>
        </section>
      </main>

      <aside className={`cart-panel ${cartOpen ? "open" : ""}`} aria-hidden={!cartOpen}>
        <div className="cart-header">
          <div>
            <p className="eyebrow">Pedido</p>
            <h2>Carrito de compra</h2>
          </div>
          <button
            className="icon-button cart-close"
            type="button"
            aria-label="Cerrar carrito"
            onClick={() => setCartOpen(false)}
          >
            <X />
          </button>
        </div>
        <div className="cart-items">
          {cartItems.map((item) => (
            <article className="cart-item" key={item.id}>
              <img src={item.image} alt={item.name} />
              <div>
                <strong>{item.name}</strong>
                <span>{formatPrice(item.price)}</span>
              </div>
              <div className="quantity" aria-label={`Cantidad ${item.name}`}>
                <button type="button" aria-label="Disminuir" onClick={() => updateQuantity(item.id, -1)}>
                  <Minus />
                </button>
                <b>{item.quantity}</b>
                <button type="button" aria-label="Aumentar" onClick={() => updateQuantity(item.id, 1)}>
                  <Plus />
                </button>
                <button
                  className="danger-icon"
                  type="button"
                  aria-label="Eliminar"
                  onClick={() => removeFromCart(item.id)}
                >
                  <Trash2 />
                </button>
              </div>
            </article>
          ))}
        </div>
        <div className={`cart-empty ${cartItems.length ? "hidden" : ""}`}>
          <ShoppingBag />
          <p>Agrega productos para iniciar tu pedido.</p>
        </div>
        <div className="cart-footer">
          <div className="total-row">
            <span>Total</span>
            <strong>{formatPrice(cartTotal).replace("Servicio", "$0 CLP")}</strong>
          </div>
          <button className="button primary full" type="button" onClick={checkout}>
            <CreditCard />
            Continuar pago
          </button>
          <a className="button secondary full" href={AGENDAPRO_URL} target="_blank" rel="noreferrer">
            <CalendarCheck />
            Reservar servicio
          </a>
        </div>
      </aside>
      <button
        className={`overlay ${cartOpen ? "open" : ""}`}
        type="button"
        aria-label="Cerrar carrito"
        onClick={() => setCartOpen(false)}
      />

      {reservationState.mode === "create" && (
        <CreateReservationModal product={reservationState.product} onClose={closeReservation} />
      )}
      {reservationState.mode === "cancel" && <CancelReservationModal onClose={closeReservation} />}
      {reservationState.mode === "edit" && <EditReservationModal onClose={closeReservation} />}

      <footer className="site-footer">
        <strong>Nativo Cosmetic</strong>
        <span>Cosmetica capilar natural, tienda online y salon organico.</span>
      </footer>
    </>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <section className="modal-card">
        <div className="modal-heading">
          <h2 id="modal-title">{title}</h2>
          <button className="icon-button" type="button" aria-label="Cerrar" onClick={onClose}>
            <X />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}

function CreateReservationModal({ product, onClose }) {
  const [form, setForm] = useState({
    cliente: "",
    dia: "",
    hora: "",
    profesional: "",
    tipoCorte: "",
  });
  const [status, setStatus] = useState(null);
  const today = getTodayInputValue();

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submitReservation(event) {
    event.preventDefault();
    setStatus(null);

    if (form.dia === today) {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      if (form.hora < currentTime) {
        setStatus({ type: "error", message: "No puedes reservar una hora que ya paso." });
        return;
      }
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/reservas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("La reserva no se pudo guardar.");
      setStatus({ type: "success", message: "Reserva aceptada y guardada correctamente." });
      setForm({ cliente: "", dia: "", hora: "", profesional: "", tipoCorte: "" });
    } catch (error) {
      setStatus({ type: "error", message: "Error de conexion con la base de datos." });
    }
  }

  return (
    <Modal title="Reservar hora" onClose={onClose}>
      <p className="modal-copy">
        Servicio: <strong>{product?.name || "Servicio Nativo"}</strong>
      </p>
      <form className="reservation-form" onSubmit={submitReservation}>
        <label>
          Tu nombre
          <input name="cliente" value={form.cliente} onChange={updateField} required placeholder="Nombre Apellido" />
        </label>
        <label>
          Dia
          <input name="dia" type="date" min={today} value={form.dia} onChange={updateField} required />
        </label>
        <label>
          Hora
          <input name="hora" type="time" value={form.hora} onChange={updateField} required />
        </label>
        <label>
          Profesional a cargo
          <select name="profesional" value={form.profesional} onChange={updateField} required>
            <option value="">Selecciona un profesional...</option>
            {professionals.map((professional) => (
              <option value={professional} key={professional}>
                {professional}
              </option>
            ))}
          </select>
        </label>
        <label>
          Tipo de corte
          <select name="tipoCorte" value={form.tipoCorte} onChange={updateField} required>
            <option value="">Selecciona un estilo...</option>
            {serviceTypes.map((type) => (
              <option value={type} key={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
        {status && <p className={`form-status ${status.type}`}>{status.message}</p>}
        <button className="button primary full" type="submit">
          Confirmar reserva
        </button>
        <button className="button secondary full" type="button" onClick={onClose}>
          Cancelar
        </button>
      </form>
    </Modal>
  );
}

function CancelReservationModal({ onClose }) {
  const [searchName, setSearchName] = useState("");
  const [reservation, setReservation] = useState(null);
  const [status, setStatus] = useState(null);

  async function searchReservation() {
    setStatus(null);
    setReservation(null);

    if (!searchName.trim()) {
      setStatus({ type: "error", message: "Ingresa el nombre usado en la reserva." });
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/reservas`);
      const data = await response.json();
      const found = (data.reservas || []).find(
        (item) => item.cliente?.toLowerCase() === searchName.trim().toLowerCase()
      );

      if (!found) {
        setStatus({ type: "error", message: "No se encontro una reserva." });
        return;
      }

      setReservation(found);
    } catch (error) {
      setStatus({ type: "error", message: "Error de conexion con el servidor." });
    }
  }

  async function deleteReservation() {
    if (!reservation?._id) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/reservas/${reservation._id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("No fue posible eliminar la reserva.");
      setReservation(null);
      setStatus({ type: "success", message: "Reserva eliminada correctamente." });
    } catch (error) {
      setStatus({ type: "error", message: "No fue posible eliminar la reserva." });
    }
  }

  return (
    <Modal title="Cancelar reserva" onClose={onClose}>
      <div className="reservation-form">
        <label>
          Nombre utilizado en la reserva
          <input value={searchName} onChange={(event) => setSearchName(event.target.value)} />
        </label>
        <button className="button primary full" type="button" onClick={searchReservation}>
          Buscar reserva
        </button>

        {reservation && (
          <div className="reservation-result">
            <p>
              <strong>Cliente:</strong> {reservation.cliente}
            </p>
            <p>
              <strong>Fecha:</strong> {String(reservation.dia).slice(0, 10)}
            </p>
            <p>
              <strong>Hora:</strong> {reservation.hora}
            </p>
            <p>
              <strong>Profesional:</strong> {reservation.profesional}
            </p>
            <button className="button danger full" type="button" onClick={deleteReservation}>
              Eliminar reserva
            </button>
          </div>
        )}

        {status && <p className={`form-status ${status.type}`}>{status.message}</p>}
        <button className="button secondary full" type="button" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </Modal>
  );
}

function EditReservationModal({ onClose }) {
  const [searchName, setSearchName] = useState("");
  const [reservation, setReservation] = useState(null);
  const [form, setForm] = useState({
    cliente: "",
    dia: "",
    hora: "",
    profesional: "",
    tipoCorte: "",
  });
  const [status, setStatus] = useState(null);
  const today = getTodayInputValue();

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function searchReservation() {
    setStatus(null);
    setReservation(null);

    if (!searchName.trim()) {
      setStatus({ type: "error", message: "Ingresa el nombre usado en la reserva." });
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/reservas`);
      const data = await response.json();
      const found = (data.reservas || []).find(
        (item) => item.cliente?.toLowerCase() === searchName.trim().toLowerCase()
      );

      if (!found) {
        setStatus({ type: "error", message: "No se encontro una reserva a editar." });
        return;
      }

      setReservation(found);
      setForm({
        cliente: found.cliente || "",
        dia: String(found.dia || "").slice(0, 10),
        hora: found.hora || "",
        profesional: found.profesional || "",
        tipoCorte: found.tipoCorte || "",
      });
    } catch (error) {
      setStatus({ type: "error", message: "Error de conexion con el servidor." });
    }
  }

  async function saveReservation(event) {
    event.preventDefault();
    if (!reservation?._id) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/reservas/${reservation._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("No fue posible editar la reserva.");
      setStatus({ type: "success", message: "Reserva actualizada correctamente." });
    } catch (error) {
      setStatus({ type: "error", message: "No fue posible editar la reserva." });
    }
  }

  return (
    <Modal title="Editar reserva" onClose={onClose}>
      <div className="reservation-form">
        <label>
          Nombre utilizado en la reserva
          <input value={searchName} onChange={(event) => setSearchName(event.target.value)} />
        </label>
        <button className="button primary full" type="button" onClick={searchReservation}>
          Buscar reserva
        </button>

        {reservation && (
          <form className="reservation-form nested" onSubmit={saveReservation}>
            <label>
              Cliente
              <input name="cliente" value={form.cliente} onChange={updateField} required />
            </label>
            <label>
              Fecha
              <input name="dia" type="date" min={today} value={form.dia} onChange={updateField} required />
            </label>
            <label>
              Hora
              <input name="hora" type="time" value={form.hora} onChange={updateField} required />
            </label>
            <label>
              Profesional
              <select name="profesional" value={form.profesional} onChange={updateField} required>
                <option value="">Selecciona un profesional...</option>
                {professionals.map((professional) => (
                  <option value={professional} key={professional}>
                    {professional}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Tipo de corte
              <select name="tipoCorte" value={form.tipoCorte} onChange={updateField} required>
                <option value="">Selecciona un estilo...</option>
                {serviceTypes.map((type) => (
                  <option value={type} key={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>
            <button className="button primary full" type="submit">
              Guardar cambios
            </button>
          </form>
        )}

        {status && <p className={`form-status ${status.type}`}>{status.message}</p>}
        <button className="button secondary full" type="button" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </Modal>
  );
}

export default TiendaPublica;
