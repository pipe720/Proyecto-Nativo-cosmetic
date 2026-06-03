import { useState } from 'react';

function NuevoProducto() {
  const [formData, setFormData] = useState({
    idproducto: '',
    nombreproducto: '',
    precioproducto: '',
    descripcionproducto: '',
    categoriaproducto: '',
    stock: '',
    fechavencimiento: ''
  });
  const [imagen, setImagen] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    if (type === 'file') {
      setImagen(files[0] || null);
      return;
    }

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje('');

    try {
      const data = new FormData();
      data.append('idproducto', formData.idproducto);
      data.append('nombreproducto', formData.nombreproducto);
      data.append('precioproducto', formData.precioproducto);
      data.append('descripcionproducto', formData.descripcionproducto);
      data.append('categoriaproducto', formData.categoriaproducto);
      data.append('stock', formData.stock);
      data.append('fechavencimiento', formData.fechavencimiento);

      if (imagen) {
        data.append('imagen', imagen);
      }

      const response = await fetch('http://localhost:3900/api/productos', {
        method: 'POST',
        body: data
      });

      if (!response.ok) {
        throw new Error('Error al crear el producto');
      }

      const resultado = await response.json();
      setMensaje(`Producto "${resultado.nombreproducto}" creado correctamente.`);

      setFormData({
        idproducto: '',
        nombreproducto: '',
        precioproducto: '',
        descripcionproducto: '',
        categoriaproducto: '',
        stock: '',
        fechavencimiento: ''
      });
      setImagen(null);
    } catch (error) {
      setMensaje(`Error: ${error.message}`);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ color: '#27AE60' }}>Registrar nuevo producto</h2>

      {mensaje && (
        <div style={{
          padding: '10px',
          marginBottom: '15px',
          backgroundColor: mensaje.startsWith('Error') ? '#f8d7da' : '#D5F4E6',
          color: mensaje.startsWith('Error') ? '#721c24' : '#27AE60',
          borderRadius: '4px',
          fontWeight: '600'
        }}>
          {mensaje}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Código del producto</label>
          <input
            type="text"
            name="idproducto"
            value={formData.idproducto}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Nombre del producto</label>
          <input
            type="text"
            name="nombreproducto"
            value={formData.nombreproducto}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Descripción</label>
          <textarea
            name="descripcionproducto"
            value={formData.descripcionproducto}
            onChange={handleChange}
            required
            rows="3"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Precio</label>
          <input
            type="number"
            name="precioproducto"
            value={formData.precioproducto}
            onChange={handleChange}
            required
            step="0.01"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Categoría</label>
          <input
            type="text"
            name="categoriaproducto"
            value={formData.categoriaproducto}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Cantidad en stock</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Fecha de vencimiento</label>
          <input
            type="date"
            name="fechavencimiento"
            value={formData.fechavencimiento}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label>Imagen del producto</label>
          <input
            type="file"
            name="imagen"
            accept="image/*"
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
          {imagen && (
            <p style={{ color: '#555', marginTop: '8px' }}>
              Archivo seleccionado: {imagen.name}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={cargando}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: cargando ? '#ccc' : '#27AE60',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: cargando ? 'not-allowed' : 'pointer',
            fontWeight: '600',
            fontSize: '16px'
          }}
          onMouseOver={(e) => !cargando && (e.currentTarget.style.backgroundColor = '#1E8449')}
          onMouseOut={(e) => !cargando && (e.currentTarget.style.backgroundColor = '#27AE60')}
        >
          {cargando ? 'Guardando...' : 'Guardar producto'}
        </button>
      </form>
    </div>
  );
}

export default NuevoProducto;
