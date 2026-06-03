import { useState, useEffect } from 'react';

function Stock() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [stockEdicion, setStockEdicion] = useState({});
  const [actualizando, setActualizando] = useState({});

  useEffect(() => {
    cargarProductos();
    const intervalo = setInterval(cargarProductos, 5000);
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

  const handleStockChange = (productoId, nuevoStock) => {
    setStockEdicion({
      ...stockEdicion,
      [productoId]: nuevoStock
    });
  };

  const actualizarStock = async (productoId) => {
    const nuevoStock = stockEdicion[productoId];

    if (nuevoStock === undefined || nuevoStock === '') {
      setError('Ingresa una cantidad válida');
      return;
    }

    try {
      setActualizando({
        ...actualizando,
        [productoId]: true
      });

      const response = await fetch(
        `http://localhost:3900/api/productos/${productoId}/stock`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ stock: parseInt(nuevoStock) })
        }
      );

      if (!response.ok) throw new Error('Error al actualizar stock');

      await cargarProductos();
      setStockEdicion({
        ...stockEdicion,
        [productoId]: ''
      });
      setError('');
    } catch (err) {
      setError(`Error al actualizar: ${err.message}`);
    } finally {
      setActualizando({
        ...actualizando,
        [productoId]: false
      });
    }
  };

  const getStockColor = (stock) => {
    if (stock <= 10) return '#dc3545';
    if (stock <= 30) return '#ffc107';
    return '#28a745';
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: '#27AE60' }}>Visualizar stock en tiempo real</h2>

      <div style={{
        padding: '10px',
        marginBottom: '20px',
        backgroundColor: '#D5F4E6',
        borderRadius: '4px',
        color: '#27AE60',
        fontWeight: '500'
      }}>
      </div>

      <button
        onClick={cargarProductos}
        style={{
          padding: '10px 15px',
          marginBottom: '20px',
          backgroundColor: '#27AE60',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: '600'
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1E8449'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#27AE60'}
      >
        Actualizar ahora
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
        <p>Cargando stock...</p>
      ) : productos.length === 0 ? (
        <p>No hay productos para mostrar.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '20px'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#D5F4E6', borderBottom: '3px solid #27AE60' }}>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #27AE60', color: '#27AE60', fontWeight: '700' }}>Código</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #27AE60', color: '#27AE60', fontWeight: '700' }}>Producto</th>
                <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #27AE60', color: '#27AE60', fontWeight: '700' }}>Stock actual</th>
                <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #27AE60', color: '#27AE60', fontWeight: '700' }}>Nuevo stock</th>
                <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #27AE60', color: '#27AE60', fontWeight: '700' }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <tr key={producto._id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '12px' }}><strong>{producto.idproducto}</strong></td>
                  <td style={{ padding: '12px' }}>{producto.nombreproducto}</td>
                  <td style={{
                    padding: '12px',
                    textAlign: 'center',
                    color: 'white',
                    backgroundColor: getStockColor(producto.stock),
                    fontWeight: 'bold',
                    borderRadius: '4px'
                  }}>
                    {producto.stock}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <input
                      type="number"
                      value={stockEdicion[producto._id] || ''}
                      onChange={(e) => handleStockChange(producto._id, e.target.value)}
                      placeholder="Nuevo stock"
                      style={{
                        padding: '6px',
                        width: '100px',
                        borderRadius: '4px',
                        border: '1px solid #ddd'
                      }}
                    />
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <button
                      onClick={() => actualizarStock(producto._id)}
                      disabled={actualizando[producto._id]}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: actualizando[producto._id] ? '#ccc' : '#27AE60',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: actualizando[producto._id] ? 'not-allowed' : 'pointer',
                        fontWeight: '600'
                      }}
                      onMouseOver={(e) => !actualizando[producto._id] && (e.currentTarget.style.backgroundColor = '#1E8449')}
                      onMouseOut={(e) => !actualizando[producto._id] && (e.currentTarget.style.backgroundColor = '#27AE60')}
                    >
                      {actualizando[producto._id] ? 'Guardando...' : 'Actualizar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#D5F4E6',
            borderRadius: '8px',
            border: '2px solid #27AE60'
          }}>
            <h4 style={{ color: '#27AE60', marginTop: '0' }}>Leyenda de stock</h4>
            <p>
              <span style={{
                display: 'inline-block',
                width: '12px',
                height: '12px',
                backgroundColor: '#dc3545',
                marginRight: '8px',
                borderRadius: '2px'
              }}></span>
              Stock bajo (≤ 10 unidades)
            </p>
            <p>
              <span style={{
                display: 'inline-block',
                width: '12px',
                height: '12px',
                backgroundColor: '#ffc107',
                marginRight: '8px',
                borderRadius: '2px'
              }}></span>
              Stock medio (11-30 unidades)
            </p>
            <p>
              <span style={{
                display: 'inline-block',
                width: '12px',
                height: '12px',
                backgroundColor: '#28a745',
                marginRight: '8px',
                borderRadius: '2px'
              }}></span>
              Stock adecuado (> 30 unidades) - Verde nativo
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Stock;
