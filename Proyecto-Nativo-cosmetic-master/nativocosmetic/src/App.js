import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { MiContextoProvider } from './MiContexto';
import TiendaPublica from './TiendaPublica';
import Home from './Home';
import NuevoProducto from './NuevoProducto';
import Stock from './Stock';

function App() {
  return (
    <MiContextoProvider>
      <Router>
        <Routes>
          {/* Tienda pública */}
          <Route path="/" element={<TiendaPublica />} />

          {/* Panel administrativo */}
          <Route path="/admin/*" element={<AdminPanel />} />
        </Routes>
      </Router>
    </MiContextoProvider>
  );
}

function AdminPanel() {
  return (
    <div>
      <nav style={{
        backgroundColor: '#27AE60',
        padding: '15px 25px',
        display: 'flex',
        gap: '20px',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <Link to="/admin" style={{ color: 'white', textDecoration: 'none', fontSize: '18px', fontWeight: 'bold' }}>
          Nativo Admin
        </Link>
        <Link to="/admin" style={{ color: 'white', textDecoration: 'none' }}>
          Inicio
        </Link>
        <Link to="/admin/nuevo-producto" style={{ color: 'white', textDecoration: 'none' }}>
          Crear producto
        </Link>
        <Link to="/admin/stock" style={{ color: 'white', textDecoration: 'none' }}>
          Stock
        </Link>
        <Link to="/" style={{ color: '#D5F4E6', textDecoration: 'none', marginLeft: 'auto', fontSize: '14px', fontWeight: '500' }}>
          ← Ver tienda
        </Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/nuevo-producto" element={<NuevoProducto />} />
        <Route path="/stock" element={<Stock />} />
      </Routes>
    </div>
  );
}

export default App;

