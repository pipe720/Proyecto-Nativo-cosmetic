import { createContext, useContext, useState, useEffect } from "react";

export const MiContexto = createContext(null);

export function MiContextoProvider({ children }) {
  const [usuarioLogeado, setUsuarioLogeado] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Recupera sesión guardada al cargar la app
  useEffect(() => {
    const token = localStorage.getItem("token");
    const usuarioGuardado = localStorage.getItem("usuario");
    if (token && usuarioGuardado) {
      setUsuarioLogeado(JSON.parse(usuarioGuardado));
    }
    setCargando(false);
  }, []);

  const login = (datos) => {
    localStorage.setItem("token", datos.token);
    localStorage.setItem("usuario", JSON.stringify(datos.usuario));
    setUsuarioLogeado(datos.usuario);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setUsuarioLogeado(null);
  };

  return (
    <MiContexto.Provider value={{
      usuarioLogeado,
      setUsuarioLogeado,
      usuario: usuarioLogeado,   // alias para RutaProtegida e Iniciosesion
      login,
      logout,
      cargando,
      esAdmin: usuarioLogeado?.rol === "admin",
    }}>
      {children}
    </MiContexto.Provider>
  );
}

export function useAuth() {
  return useContext(MiContexto);
}

export default MiContexto;