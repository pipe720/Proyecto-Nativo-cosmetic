import { useState, useEffect } from 'react';

function Stock() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [stockEdicion, setStockEdicion] = useState({});
  const [actualizando, setActualizando] = useState({});
  const [editando, setEditando] = useState(null);
  const [formEdicion, setFormEdicion] = useState({});

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
    setStockEdicion({ ...stockEdicion, [productoId]: nuevoStock });
  };

  const actualizarStock = async (productoId) => {
    const nuevoStock = stockEdicion[productoId];
    if (nuevoStock === undefined || nuevoStock === '') {
      setError('Ingresa una cantidad válida');
      return;
    }
    try {
      setActualizando({ ...actualizando, [productoId]: true });
      const response = await fetch(
        `http://localhost:3900/api/productos/${productoId}/stock`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stock: parseInt(nuevoStock) })
        }
      );
      if (!response.ok) throw new Error('Error al actualizar stock');
      await cargarProductos();
      setStockEdicion({ ...stockEdicion, [productoId]: '' });
      setError('');
    } catch (err) {
      setError(`Error al actualizar: ${err.message}`);
    } finally {
      setActualizando({ ...actualizando, [productoId]: false });
    }
  };

  // Eliminar producto
  const eliminarProducto = async (productoId) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;
    try {
      const response = await fetch(`http://localhost:3900/api/productos/${productoId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Error al eliminar producto');
      await cargarProductos();
    } catch (err) {
      setError(`Error al eliminar: ${err.message}`);
    }
  };

  // Editar producto
  const iniciarEdicion = (producto) => {
    setEditando(producto._id);
    setFormEdicion(producto);
  };

  const handleEdicionChange = (e) => {
    const { name, value } = e.target;
    setFormEdicion({ ...formEdicion, [name]: value });
  };

  const guardarEdicion = async () => {
    try {
      const response = await fetch(`http://localhost:3900/api/productos/${editando}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formEdicion)
      });
      if (!response.ok) throw new Error('Error al modificar producto');
      await cargarProductos();
      setEditando(null);
      setFormEdicion({});
    } catch (err) {
      setError(`Error al modificar: ${err.message}`);
    }
  };

  const getStockColor = (stock) => {
    if (stock <= 10) return '#dc3545';
    if (stock <= 30) return '#ffc107';
    return '#28a745';
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: '#27AE60' }}>Gestión de productos y stock</h2>

      <button onClick={cargarProductos}>Actualizar ahora</button>

      {error && <div style={{ color: 'red' }}>{error}</div>}

      {cargando ? (
        <p>Cargando...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Producto</th>
              <th>Stock actual</th>
              <th>Nuevo stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto._id}>
                <td>{producto.idproducto}</td>
                <td>
                  {editando === producto._id ? (
                    <input
                      type="text"
                      name="nombreproducto"
                      value={formEdicion.nombreproducto || ''}
                      onChange={handleEdicionChange}
                    />
                  ) : (
                    producto.nombreproducto
                  )}
                </td>
                <td style={{ backgroundColor: getStockColor(producto.stock), color: 'white' }}>
                  {producto.stock}
                </td>
                <td>
                  <input
                    type="number"
                    value={stockEdicion[producto._id] || ''}
                    onChange={(e) => handleStockChange(producto._id, e.target.value)}
                  />
                </td>
                <td>
                  <button onClick={() => actualizarStock(producto._id)}>Actualizar stock</button>
                  {editando === producto._id ? (
                    <button onClick={guardarEdicion}>Guardar</button>
                  ) : (
                    <button onClick={() => iniciarEdicion(producto)}>Editar</button>
                  )}
                  <button onClick={() => eliminarProducto(producto._id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Stock;
