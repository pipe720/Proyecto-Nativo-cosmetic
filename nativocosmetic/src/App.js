import { BrowserRouter as Router, Link, Route, Routes, Navigate } from "react-router-dom";
import { MiContextoProvider } from "./MiContexto";
import RutaProtegida from "./RutaProtegida";
import Home from "./Home";
import NuevoProducto from "./NuevoProducto";
import Pago from "./Pago";
import Stock from "./Stock";
import TiendaPublica from "./TiendaPublica";
import Iniciosesion from "./Iniciosesion";

function App() {
  return (
    <MiContextoProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<TiendaPublica />} />
          <Route path="/pago" element={<Pago />} />
          <Route path="/iniciosesion" element={<Iniciosesion />} />
          <Route
            path="/admin/*"
            element={
              <RutaProtegida rol="admin">
                <AdminPanel />
              </RutaProtegida>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </MiContextoProvider>
  );
}

function AdminPanel() {
  return (
    <div>
      <nav style={{
        backgroundColor: "#27AE60",
        padding: "15px 25px",
        display: "flex",
        gap: "20px",
        alignItems: "center",
        flexWrap: "wrap",
      }}>
        <Link to="/admin" style={{ color: "white", textDecoration: "none", fontSize: "18px", fontWeight: "bold" }}>
          Nativo Admin
        </Link>
        <Link to="/admin" style={{ color: "white", textDecoration: "none" }}>
          Inicio
        </Link>
        <Link to="/admin/nuevo-producto" style={{ color: "white", textDecoration: "none" }}>
          Crear producto
        </Link>
        <Link to="/admin/stock" style={{ color: "white", textDecoration: "none" }}>
          Stock
        </Link>
        <Link to="/" style={{ color: "#D5F4E6", textDecoration: "none", marginLeft: "auto", fontSize: "14px", fontWeight: "500" }}>
          Ver tienda
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