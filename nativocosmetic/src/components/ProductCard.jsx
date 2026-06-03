function ProductCard({ agendaproUrl, formatPrice, icons, product, onAdd }) {
  const { CalendarPlus, Plus } = icons;

  return (
    <article className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="product-content">
        <span className="tag">{product.tag}</span>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <div className="product-bottom">
          <span className="price">{formatPrice(product.price)}</span>
          {product.booking ? (
            <a className="add-button" href={agendaproUrl} target="_blank" rel="noreferrer" aria-label={`Reservar ${product.name}`}>
              <CalendarPlus aria-hidden="true" />
            </a>
          ) : (
            <button className="add-button" type="button" aria-label={`Agregar ${product.name}`} onClick={() => onAdd(product)}>
              <Plus aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
