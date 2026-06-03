function CartDrawer({ agendaproUrl, cartItems, formatPrice, icons, isOpen, onCheckout, onClose, onUpdateQuantity, total }) {
  const { CalendarCheck, CreditCard, ShoppingBag, X } = icons;

  return (
    <>
      <aside className={`cart-panel ${isOpen ? "open" : ""}`} aria-hidden={!isOpen}>
        <div className="cart-header">
          <div>
            <p className="eyebrow">Pedido</p>
            <h2>Carrito de compra</h2>
          </div>
          <button className="icon-button" type="button" aria-label="Cerrar carrito" onClick={onClose}>
            <X aria-hidden="true" />
          </button>
        </div>

        {cartItems.length > 0 ? (
          <div className="cart-items">
            {cartItems.map((item) => (
              <article className="cart-item" key={item.id}>
                <img src={item.image} alt={item.name} />
                <div>
                  <strong>{item.name}</strong>
                  <span>{formatPrice(item.price)}</span>
                </div>
                <div className="quantity" aria-label={`Cantidad ${item.name}`}>
                  <button type="button" aria-label="Disminuir" onClick={() => onUpdateQuantity(item.id, -1)}>
                    -
                  </button>
                  <b>{item.quantity}</b>
                  <button type="button" aria-label="Aumentar" onClick={() => onUpdateQuantity(item.id, 1)}>
                    +
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="cart-empty">
            <ShoppingBag aria-hidden="true" />
            <p>Agrega productos para iniciar tu pedido.</p>
          </div>
        )}

        <div className="cart-footer">
          <div className="total-row">
            <span>Total</span>
            <strong>{formatPrice(total).replace("Servicio", "$0 CLP")}</strong>
          </div>
          <button className="button primary full" type="button" onClick={onCheckout}>
            <CreditCard aria-hidden="true" />
            Continuar pago
          </button>
          <a className="button secondary full" href={agendaproUrl} target="_blank" rel="noreferrer">
            <CalendarCheck aria-hidden="true" />
            Reservar servicio
          </a>
        </div>
      </aside>
      <button className={`overlay ${isOpen ? "open" : ""}`} type="button" aria-label="Cerrar carrito" onClick={onClose} />
    </>
  );
}

export default CartDrawer;
