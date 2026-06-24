import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './MiContexto';
import { API_BASE_URL } from "./data/products";

function Iniciosesion() {
  const [formData, setFormData] = useState({ correo: '', contrasena: '' });
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');

    // 1. Validación de campos vacíos
    if (!formData.correo || !formData.contrasena) {
      setMensaje('Por favor completa todos los campos.');
      return;
    }

    // 2. Validación de formato de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.correo)) {
      setMensaje('Por favor ingresa un correo electrónico válido (ejemplo: usuario@correo.com).');
      return;
    }

    setCargando(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/clientes/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (!response.ok) {
        setMensaje(data.mensaje || 'Error al iniciar sesión.');
        return;
      }
      login(data);
      if (data.usuario.rol === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch {
      setMensaje('No se pudo conectar con el servidor.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f5f2ec',
      fontFamily: "'Inter', sans-serif"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600&family=Inter:wght@400;500&display=swap');
        .nv-input { width: 100%; box-sizing: border-box; border: 0.5px solid #c8c3b8; border-radius: 8px; padding: 10px 14px; font-size: 14px; font-family: 'Inter', sans-serif; color: #1a2e1a; background: #faf9f7; outline: none; transition: border-color 0.15s; }
        .nv-input:focus { border-color: #27AE60; background: #fff; }
        .nv-input::placeholder { color: #b0aba1; }
        
        /* Botón Principal (Iniciar Sesión) */
        .nv-btn { width: 100%; margin-top: 20px; background: #1a2e1a; color: #fff; border: none; border-radius: 8px; padding: 12px; font-size: 14px; font-weight: 500; font-family: 'Inter', sans-serif; cursor: pointer; transition: background 0.15s; }
        .nv-btn:hover:not(:disabled) { background: #27AE60; }
        .nv-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        /* Botón Secundario (Registrarse) */
        .nv-btn-secondary { width: 100%; margin-top: 15px; background: transparent; color: #1a2e1a; border: 1px solid #1a2e1a; border-radius: 8px; padding: 11px; font-size: 14px; font-weight: 500; font-family: 'Inter', sans-serif; cursor: pointer; transition: all 0.15s; box-sizing: border-box; text-align: center; }
        .nv-btn-secondary:hover { background: #1a2e1a; color: #fff; }
      `}</style>

      <div style={{
        background: '#fff',
        borderRadius: 16,
        border: '0.5px solid #d4cfc6',
        padding: '2.5rem 2rem',
        width: '100%',
        maxWidth: 400
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '2rem' }}>
          <img
            src="https://nativocosmetic.com/cdn/shop/files/logo_nativo.png?v=1739992459&width=140"
            alt="Nativo Cosmetic"
            style={{ height: 32 }}
          />
          <div style={{ width: 8, height: 8, background: '#27AE60', borderRadius: '50%' }} />
        </div>

        {/* Encabezado */}
        <p style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#27AE60', fontWeight: 500, marginBottom: 6 }}>
          Acceso seguro
        </p>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 600, color: '#1a2e1a', marginBottom: '1.75rem', lineHeight: 1.2 }}>
          Bienvenida de vuelta.
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Correo */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#555', marginBottom: 5, letterSpacing: '0.03em' }}>
              Correo electrónico
            </label>
            <input
              className="nv-input"
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              placeholder="tucorreo@ejemplo.com"
            />
          </div>

          {/* Contraseña */}
          <div style={{ marginBottom: '0.5rem' }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#555', marginBottom: 5, letterSpacing: '0.03em' }}>
              Contraseña
            </label>
            <input
              className="nv-input"
              type="password"
              name="contrasena"
              value={formData.contrasena}
              onChange={handleChange}
              placeholder="••••••••"
            />
          </div>

          {/* Mensaje de error */}
          {mensaje && (
            <p style={{ fontSize: 13, color: '#c0392b', marginTop: 8, textAlign: 'center' }}>
              {mensaje}
            </p>
          )}

          <button className="nv-btn" type="submit" disabled={cargando}>
            {cargando ? 'Iniciando sesión...' : 'Iniciar sesión →'}
          </button>
        </form>

        {/* Divisor */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '1.25rem 0' }}>
          <hr style={{ flex: 1, border: 'none', borderTop: '0.5px solid #ddd8d0' }} />
          <span style={{ fontSize: 11, color: '#b0aba1' }}>o</span>
          <hr style={{ flex: 1, border: 'none', borderTop: '0.5px solid #ddd8d0' }} />
        </div>

        <a href="#" style={{ display: 'block', textAlign: 'center', fontSize: 13, color: '#27AE60', textDecoration: 'none', marginBottom: '5px' }}>
          ¿Olvidaste tu contraseña?
        </a>

        {/* Botón de Registrarse */}
        <button 
          className="nv-btn-secondary" 
          type="button" 
          onClick={() => navigate('/registro')}
        >
          ¿No tienes cuenta? Regístrate aquí
        </button>

        {/* Footer */}
        <p style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '0.5px solid #eee8df', textAlign: 'center', fontSize: 11, color: '#b0aba1', letterSpacing: '0.04em' }}>
          NATIVO COSMETIC · PROVIDENCIA
        </p>
      </div>
    </div>
  );
}

export default Iniciosesion;