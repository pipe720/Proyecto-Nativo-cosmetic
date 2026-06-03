import { useState, useEffect } from 'react';

function Catalogo() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setCargando(true);
      const response = await fetch('http://localhost:3900/api/productos');
      if (!response.ok) throw new Error('Error al cargar productos');
      const data = await response.json();
      setProductos(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Catálogo de productos</h2>

      <button
        onClick={cargarProductos}
        style={{
          padding: '10px 15px',
          marginBottom: '20px',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Actualizar catálogo
      </button>

      {error && (
        <div style={{
          padding: '10px',
          marginBottom: '15px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          borderRadius: '4px'
        }}>
          {error}
        </div>
      )}

      {cargando ? (
        <p>Cargando productos...</p>
      ) : productos.length === 0 ? (
        <p>No hay productos registrados aún.</p>
      ) : (
        <div>
          <p><strong>Total de productos: {productos.length}</strong></p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
            {productos.map((producto) => (
              <div
                key={producto._id}
                onClick={() => setProductoSeleccionado(producto)}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '15px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s',
                  backgroundColor: productoSeleccionado?._id === producto._id ? '#e7f3ff' : 'white'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                {producto.imagenUrl && (
                  <img
                    src={`http://localhost:3900${producto.imagenUrl}`}
                    alt={producto.nombreproducto}
                    style={{ width: '100%', maxHeight: '180px', objectFit: 'cover', borderRadius: '6px', marginBottom: '10px' }}
                  />
                )}
                <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>
                  {producto.nombreproducto}
                </h4>
                <p style={{ margin: '5px 0', color: '#666' }}>
                  <strong>Código:</strong> {producto.idproducto}
                </p>
                <p style={{ margin: '5px 0', color: '#666' }}>
                  <strong>Categoría:</strong> {producto.categoriaproducto}
                </p>
                <p style={{ margin: '5px 0', color: '#28a745', fontWeight: 'bold' }}>
                  ${producto.precioproducto.toLocaleString('es-CL')}
                </p>
              </div>
            ))}
          </div>

          {productoSeleccionado && (
            <div style={{
              marginTop: '30px',
              padding: '20px',
              backgroundColor: '#f9f9f9',
              borderRadius: '8px',
              border: '2px solid #007bff'
            }}>
              <h3>Detalles del producto</h3>
              {productoSeleccionado.imagenUrl && (
                <img
                  src={`http://localhost:3900${productoSeleccionado.imagenUrl}`}
                  alt={productoSeleccionado.nombreproducto}
                  style={{ width: '100%', maxHeight: '260px', objectFit: 'cover', borderRadius: '6px', marginBottom: '15px' }}
                />
              )}
              <p><strong>Código:</strong> {productoSeleccionado.idproducto}</p>
              <p><strong>Nombre:</strong> {productoSeleccionado.nombreproducto}</p>
              <p><strong>Descripción:</strong> {productoSeleccionado.descripcionproducto}</p>
              <p><strong>Precio:</strong> ${productoSeleccionado.precioproducto.toLocaleString('es-CL')}</p>
              <p><strong>Categoría:</strong> {productoSeleccionado.categoriaproducto}</p>
              <p><strong>Stock:</strong> {productoSeleccionado.stock} unidades</p>
              <p><strong>Vencimiento:</strong> {productoSeleccionado.fechavencimiento ? new Date(productoSeleccionado.fechavencimiento).toLocaleDateString('es-CL') : 'Sin fecha'}</p>
              <button
                onClick={() => setProductoSeleccionado(null)}
                style={{
                  padding: '8px 15px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginTop: '10px'
                }}
              >
                Cerrar
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Catalogo;
