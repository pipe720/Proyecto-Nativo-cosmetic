import { useState, useEffect } from 'react';

function TiendaPublica() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    cargarProductos();
    const intervalo = setInterval(cargarProductos, 10000);
    return () => clearInterval(intervalo);
  }, []);

  const cargarProductos = async () => {
    try {
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

  const productosFiltrados = filtro
    ? productos.filter(p => p.categoriaproducto.toLowerCase().includes(filtro.toLowerCase()))
    : productos;

  const categorias = [...new Set(productos.map(p => p.categoriaproducto))];

  return (
    <div style={{ backgroundColor: '#fafafa', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#27AE60',
        borderBottom: '3px solid #1E8449',
        padding: '30px 0',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <h1 style={{ margin: '0 0 10px 0', color: 'white', fontSize: '32px', fontWeight: '700' }}>
            Nativo Cosmetic
          </h1>
          <p style={{ margin: '0', color: '#D5F4E6', fontSize: '15px' }}>
            Productos de cosmética natural de calidad premium
          </p>
        </div>
      </div>

      {/* Contenedor principal */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }}>
        
        {error && (
          <div style={{
            padding: '15px',
            marginBottom: '20px',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            borderRadius: '4px'
          }}>
            {error}
          </div>
        )}

        {cargando ? (
          <p style={{ textAlign: 'center', color: '#666' }}>Cargando productos...</p>
        ) : productosFiltrados.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666' }}>No hay productos disponibles.</p>
        ) : (
          <>
            {/* Filtro de categorías */}
            <div style={{ marginBottom: '30px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setFiltro('')}
                style={{
                  padding: '8px 15px',
                  backgroundColor: filtro === '' ? '#27AE60' : '#e8f5e9',
                  color: filtro === '' ? 'white' : '#27AE60',
                  border: `2px solid ${filtro === '' ? '#27AE60' : '#c8e6c9'}`,
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Todos
              </button>
              {categorias.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFiltro(cat)}
                  style={{
                    padding: '8px 15px',
                    backgroundColor: filtro === cat ? '#27AE60' : '#e8f5e9',
                    color: filtro === cat ? 'white' : '#27AE60',
                    border: `2px solid ${filtro === cat ? '#27AE60' : '#c8e6c9'}`,
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Grid de productos */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '20px',
              marginBottom: '30px'
            }}>
              {productosFiltrados.map((producto) => (
                <div
                  key={producto._id}
                  onClick={() => setProductoSeleccionado(producto)}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'transform 0.3s, boxShadow 0.3s',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    border: '1px solid #f0f0f0'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                  }}
                >
                  {/* Imagen */}
                  <div style={{
                    width: '100%',
                    height: '200px',
                    backgroundColor: '#f5f5f5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                  }}>
                    {producto.imagenUrl ? (
                      <img
                        src={`http://localhost:3900${producto.imagenUrl}`}
                        alt={producto.nombreproducto}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ color: '#ccc', fontSize: '12px' }}>Sin imagen</div>
                    )}
                  </div>

                  {/* Contenido */}
                  <div style={{ padding: '15px' }}>
                    <p style={{
                      margin: '0 0 8px 0',
                      fontSize: '12px',
                      color: '#999',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      {producto.categoriaproducto}
                    </p>
                    <h3 style={{
                      margin: '0 0 8px 0',
                      fontSize: '16px',
                      color: '#1f1f1f',
                      fontWeight: '600'
                    }}>
                      {producto.nombreproducto}
                    </h3>
                    <p style={{
                      margin: '0 0 12px 0',
                      fontSize: '13px',
                      color: '#666',
                      lineHeight: '1.4'
                    }}>
                      {producto.descripcionproducto.substring(0, 60)}...
                    </p>
                    <p style={{
                      margin: '0',
                      fontSize: '18px',
                      color: '#1f1f1f',
                      fontWeight: '700'
                    }}>
                      ${producto.precioproducto.toLocaleString('es-CL')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Modal de producto */}
        {productoSeleccionado && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 200
          }}
          onClick={() => setProductoSeleccionado(null)}
          >
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '85vh',
              overflow: 'auto',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
            >
              {/* Modal content */}
              <div>
                {productoSeleccionado.imagenUrl && (
                  <img
                    src={`http://localhost:3900${productoSeleccionado.imagenUrl}`}
                    alt={productoSeleccionado.nombreproducto}
                    style={{
                      width: '100%',
                      height: '300px',
                      objectFit: 'cover'
                    }}
                  />
                )}

                <div style={{ padding: '30px' }}>
                  <p style={{
                    margin: '0 0 10px 0',
                    fontSize: '12px',
                    color: '#999',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {productoSeleccionado.categoriaproducto}
                  </p>

                  <h2 style={{
                    margin: '0 0 15px 0',
                    fontSize: '28px',
                    color: '#1f1f1f'
                  }}>
                    {productoSeleccionado.nombreproducto}
                  </h2>

                  <p style={{
                    margin: '0 0 20px 0',
                    fontSize: '16px',
                    color: '#666',
                    lineHeight: '1.6'
                  }}>
                    {productoSeleccionado.descripcionproducto}
                  </p>

                  <div style={{
                    backgroundColor: '#f5f5f5',
                    padding: '20px',
                    borderRadius: '8px',
                    marginBottom: '20px'
                  }}>
                    <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>
                      Precio
                    </p>
                    <p style={{
                      margin: '0',
                      fontSize: '32px',
                      color: '#1f1f1f',
                      fontWeight: '700'
                    }}>
                      ${productoSeleccionado.precioproducto.toLocaleString('es-CL')}
                    </p>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '15px',
                    marginBottom: '20px'
                  }}>
                    <div>
                      <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '14px' }}>
                        Stock disponible
                      </p>
                      <p style={{
                        margin: '0',
                        fontSize: '20px',
                        color: productoSeleccionado.stock > 10 ? '#28a745' : '#dc3545',
                        fontWeight: '600'
                      }}>
                        {productoSeleccionado.stock} unidades
                      </p>
                    </div>
                    <div>
                      <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '14px' }}>
                        Vencimiento
                      </p>
                      <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
                        {productoSeleccionado.fechavencimiento
                          ? new Date(productoSeleccionado.fechavencimiento).toLocaleDateString('es-CL')
                          : 'Sin fecha'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setProductoSeleccionado(null)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#27AE60',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1E8449'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#27AE60'}
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        backgroundColor: '#27AE60',
        color: 'white',
        padding: '30px 20px',
        textAlign: 'center',
        marginTop: '40px'
      }}>
        <p style={{ margin: '0', fontSize: '14px', fontWeight: '500' }}>
          Nativo Cosmetic © 2026 - Productos de cosmética natural
        </p>
      </div>
    </div>
  );
}

export default TiendaPublica;
