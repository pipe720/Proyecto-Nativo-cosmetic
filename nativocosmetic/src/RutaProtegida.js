import { Navigate } from 'react-router-dom';
import { useAuth } from './MiContexto';

function RutaProtegida({ children, rol }) {
  const { usuario, cargando } = useAuth();
  if (cargando) return <div>Cargando...</div>;
  if (!usuario) return <Navigate to="/iniciosesion" replace />;
  if (rol && usuario.rol !== rol) return <Navigate to="/" replace />;
  return children;
}

export default RutaProtegida;