import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import storeAuth from "../../context/storeAuth";
import "./Ajustes.css";

const Ajustes = () => {
  const [notificaciones, setNotificaciones] = useState(true);
  const [tema, setTema] = useState("light");
  const [idioma, setIdioma] = useState("es");

  const [menuOpen, setMenuOpen] = useState(false);
  const [avatar, setAvatar] = useState(null);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const token = storeAuth.getState().token || localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/usuarios/perfil`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("📌 Perfil recibido en Ajustes:", res.data);

        // Compatibilidad con ambas estructuras del backend
        const user = res.data.usuario || res.data;

        if (user.avatar) {
          setAvatar(user.avatar);
        }

      } catch (error) {
        console.error("❌ Error al obtener el avatar:", error.response?.data || error);

        if (error.response?.status === 401) {
          handleLogout();
        }
      }
    };

    fetchAvatar();
  }, []);

  const handleFileClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAvatar(URL.createObjectURL(file));

    // Si quieres subir avatar permanentemente, lo agrego luego.
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // ======================= UI =================================

  return (
    <section className="ajustes-section">

      <button
        className={`hamburger-btn ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span><span></span><span></span>
      </button>

      <nav className={`side-menu ${menuOpen ? "show" : ""}`}>

        <div className="menu-header">
          <h3 className="menu-title">Menú</h3>

          <div className="avatar-section">
            <div className="avatar-container" onClick={() => navigate("/MUsuario")}>
              {avatar ? (
                <img src={avatar} alt="Avatar" className="avatar-img" />
              ) : (
                <span className="default-avatar">👤</span>
              )}
            </div>
          </div>
        </div>

        <div className="menu-buttons">
          <button onClick={() => navigate("/dashboard")}>Inicio</button>
          <button onClick={() => navigate("/MUsuario")}>Mi cuenta</button>
          <button onClick={() => navigate("/matches")}>Favoritos</button>
          <button onClick={() => navigate("/ajustes")} className="active">Ajustes</button>
          <button onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </nav>

      <div className="ajustes-content">
        <h2 className="ajustes-title">Ajustes</h2>

        <div className="ajustes-card">
          <h3>Cuenta</h3>

          <div className="ajustes-row hover-card" onClick={() => navigate("/ActualizarInfo")}>
            <span>Actualizar información de cuenta</span>
          </div>

          <div className="ajustes-row hover-highlight" onClick={() => navigate("/ActualizarPass")}>
            <span>Cambiar contraseña</span>
          </div>
        </div>

        <div className="ajustes-card">
          <h3>Personalización</h3>

          <div className="ajustes-row">
            <span>Notificaciones</span>
            <label className="switch">
              <input type="checkbox" checked={notificaciones} onChange={() => setNotificaciones(!notificaciones)} />
              <span className="slider"></span>
            </label>
          </div>

          <div className="ajustes-row">
            <span>Tema</span>
            <select className="ajustes-select" value={tema} onChange={(e) => setTema(e.target.value)}>
              <option value="light">Claro</option>
              <option value="dark">Oscuro</option>
            </select>
          </div>

          <div className="ajustes-row">
            <span>Idioma</span>
            <select className="ajustes-select" value={idioma} onChange={(e) => setIdioma(e.target.value)}>
              <option value="es">Español</option>
              <option value="en">Inglés</option>
            </select>
          </div>
        </div>

        <div className="ajustes-card">
          <h3>Sesión</h3>

          <div className="ajustes-row hover-card" onClick={handleLogout}>
            <span>Cerrar sesión</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Ajustes;
