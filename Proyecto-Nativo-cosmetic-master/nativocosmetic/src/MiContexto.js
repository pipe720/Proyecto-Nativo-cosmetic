// MiContexto.js
import { createContext, useState } from "react";

export const MiContexto = createContext(null);

export function MiContextoProvider({ children }) {
  const [usuarioLogeado, setUsuarioLogeado] = useState(null);

  return (
    <MiContexto.Provider value={{ usuarioLogeado, setUsuarioLogeado }}>
      {children}
    </MiContexto.Provider>
  );
}