function Hero({ agendaproUrl, icons }) {
  const { CalendarCheck, ShoppingBag } = icons;

  return (
    <section className="hero">
      <picture className="hero-media">
        <img
          src="https://nativocosmetic.com/cdn/shop/files/NZ6_8050_0249fee2-a649-4ac4-bbe6-d73c460f0bed.jpg?v=1739990326&width=3200"
          alt="Productos Nativo en un entorno natural"
        />
      </picture>
      <div className="hero-content">
        <p className="eyebrow">Cosmética capilar natural y consciente</p>
        <h1>Cuida tu cabello con fórmulas inspiradas en el sur de Chile.</h1>
        <p>
          Compra productos libres de sulfatos, parabenos y siliconas, o agenda una atención en la primera peluquería orgánica de Chile.
        </p>
        <div className="hero-actions">
          <a className="button primary" href="#productos">
            <ShoppingBag aria-hidden="true" />
            Comprar productos
          </a>
          <a className="button secondary" href={agendaproUrl} target="_blank" rel="noreferrer">
            <CalendarCheck aria-hidden="true" />
            Reservar en Agendapro
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;
