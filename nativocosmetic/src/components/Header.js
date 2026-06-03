import { useState } from "react";

function Header({ agendaproUrl, cartCount, icons, onOpenCart }) {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { CalendarDays, Menu, ShoppingBag } = icons;

  return (
    <header className="site-header">
      <a className="brand" href="#inicio" aria-label="Inicio Nativo Cosmetic">
        <img src="https://nativocosmetic.com/cdn/shop/files/logo_nativo.png?v=1739992459&width=140" alt="Nativo Cosmetic" />
      </a>

      <button
        className="icon-button nav-toggle"
        type="button"
        aria-label="Abrir menú"
        aria-expanded={isNavOpen}
        onClick={() => setIsNavOpen((current) => !current)}
      >
        <Menu aria-hidden="true" />
      </button>

      <nav className={`main-nav ${isNavOpen ? "open" : ""}`} aria-label="Navegación principal">
        <a href="#productos">Productos</a>
        <a href="#diagnostico">Diagnóstico</a>
        <a href="#salon">Salón</a>
        <a href="#historia">Marca</a>
      </nav>

      <div className="header-actions">
        <a className="ghost-action" href={agendaproUrl} target="_blank" rel="noreferrer">
          <CalendarDays aria-hidden="true" />
          Reservar
        </a>
        <button className="icon-button" type="button" aria-label="Abrir carrito" onClick={onOpenCart}>
          <ShoppingBag aria-hidden="true" />
          <span className="cart-count">{cartCount}</span>
        </button>
      </div>
    </header>
  );
}

export default Header;
