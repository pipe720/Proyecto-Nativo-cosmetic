import { Link } from 'react-router-dom';

function Home() {
  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#27AE60' }}>Panel Administrativo</h1>
      <p style={{ fontSize: '18px', color: '#555' }}>
        Bienvenido al sistema de gestión de productos para <span style={{ color: '#27AE60', fontWeight: 'bold' }}>Nativo Cosmetic</span>.
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginTop: '40px'
      }}>
        <Link to="/admin/nuevo-producto" style={{ textDecoration: 'none' }}>
          <div style={{
            border: '2px solid #007bff',
            borderRadius: '8px',
            padding: '20px',
            backgroundColor: '#f8f9fa',
            cursor: 'pointer',
            transition: 'transform 0.2s, boxShadow 0.2s',
            minHeight: '200px',
            display: 'flex',
            flexDirection: 'column'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}>
            <h2>Crear nuevo producto</h2>
            <p style={{ color: '#666' }}>
              Registra un producto con todos sus detalles.
            </p>
            <ul style={{ color: '#666' }}>
              <li>Codigo del producto</li>
              <li>Nombre y descripcion</li>
              <li>Precio</li>
              <li>Stock inicial</li>
              <li>Categoria e imagen</li>
            </ul>
            <button style={{
              marginTop: 'auto',
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
              Crear producto
            </button>
          </div>
        </Link>

        <Link to="/admin/stock" style={{ textDecoration: 'none' }}>
          <div style={{
            border: '2px solid #dc3545',
            borderRadius: '8px',
            padding: '20px',
            backgroundColor: '#f8f9fa',
            cursor: 'pointer',
            transition: 'transform 0.2s, boxShadow 0.2s',
            minHeight: '300px',
            display: 'flex',
            flexDirection: 'column'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}>
            <h2>Gestionar stock</h2>
            <p style={{ color: '#666' }}>
              Actualiza el stock de productos en tiempo real.
            </p>
            <ul style={{ color: '#666' }}>
              <li>Ver stock disponible</li>
              <li>Actualización en vivo</li>
              <li>Indicadores de estado</li>
            </ul>
            <button style={{
              marginTop: 'auto',
              padding: '10px 20px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
              Gestionar stock
            </button>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Home;
