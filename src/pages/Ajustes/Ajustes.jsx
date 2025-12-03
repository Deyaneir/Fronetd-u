import { useEffect } from "react";
import React, { useState, useRef } from "react";
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
  
  // Función para obtener el avatar con la ruta corregida
  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        // Obtener el token de forma segura (asumiendo que storeAuth es correcto)
        const token = storeAuth.getState().token || localStorage.getItem("token");
        
        if (!token || !import.meta.env.VITE_BACKEND_URL) return;

        // ✅ CORRECCIÓN CLAVE: La ruta debe ser /api/usuarios/perfil
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/usuarios/perfil`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data?.avatar) {
          setAvatar(res.data.avatar);
        }
      } catch (error) {
        console.error("Error al obtener el avatar en Ajustes:", error.response?.data || error);
        // Opcional: Si el token es inválido (401), forzar cierre de sesión
        if (error.response?.status === 401) {
          handleLogout();
        }
      }
    };

    fetchAvatar();
  }, []); 

  // Lógica para cerrar el menú lateral al hacer clic fuera o presionar ESC
  useEffect(() => {
    const handleClickOutside = (event) => {
      const menu = document.querySelector(".side-menu");
      const hamburger = document.querySelector(".hamburger-btn");

      if (menuOpen && menu && !menu.contains(event.target) && hamburger && !hamburger.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape" && menuOpen) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);
  

  const handleFileClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(URL.createObjectURL(file));
      // NOTA: Aquí solo se establece la vista previa. Si deseas subirlo
      // permanentemente, la lógica de subida a Cloudinary/Backend debe ir aquí.
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    // storeAuth.getState().clearToken(); // Descomentar si la función existe
    navigate("/login");
  };

  return (
    <section className="ajustes-section">

      {/* ---------------- BOTÓN HAMBURGUESA ---------------- */}
      <button
        className={`hamburger-btn ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* ---------------- MENÚ LATERAL ---------------- */}
      <nav className={`side-menu ${menuOpen ? "show" : ""}`}>

        {/* Encabezado */}
        <div className="menu-header">
          <h3 className="menu-title">Menú</h3>

          {/* AVATAR */}
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

        {/* Botones del menú */}
        <div className="menu-buttons">
          <button onClick={() => navigate("/dashboard")}>Inicio</button>
          <button onClick={() => navigate("/MUsuario")}>Mi cuenta</button>
          <button onClick={() => navigate("/matches")}>Favoritos</button>
          <button onClick={() => navigate("/ajustes")} className="active">Ajustes</button>
          <button onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </nav>

      {/* ---------------- CONTENIDO PRINCIPAL ---------------- */}
      <div className="ajustes-content">
        <h2 className="ajustes-title">Ajustes</h2>

        {/* ---------------- CUENTA ---------------- */}
        <div className="ajustes-card">
          <h3>Cuenta</h3>

          {/* --- ACTUALIZAR INFO DE CUENTA --- */}
          <div
            className="ajustes-row hover-card"
            onClick={() => navigate("/ActualizarInfo")}
            style={{ cursor: "pointer" }}
          >
            <span>Actualizar información de cuenta</span>
          </div>

          {/* --- CAMBIAR CONTRASEÑA --- */}
          <div
            className="ajustes-row hover-highlight"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/ActualizarPass")}
          >
            <span>Cambiar contraseña</span>
          </div>
        </div>

        {/* ---------------- PERSONALIZACIÓN ---------------- */}
        <div className="ajustes-card">
          <h3>Personalización</h3>

          <div className="ajustes-row">
            <span>Notificaciones</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={notificaciones}
                onChange={() => setNotificaciones(!notificaciones)}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="ajustes-row">
            <span>Tema</span>
            <select
              className="ajustes-select"
              value={tema}
              onChange={(e) => setTema(e.target.value)}
            >
              <option value="light">Claro</option>
              <option value="dark">Oscuro</option>
            </select>
          </div>

          <div className="ajustes-row">
            <span>Idioma</span>
            <select
              className="ajustes-select"
              value={idioma}
              onChange={(e) => setIdioma(e.target.value)}
            >
              <option value="es">Español</option>
              <option value="en">Inglés</option>
            </select>
          </div>
        </div>

        {/* ---------------- SESIÓN ---------------- */}
        <div className="ajustes-card">
          <h3>Sesión</h3>

          <div
            className="ajustes-row hover-card"
            onClick={handleLogout} // Llama a la función de logout
            style={{ cursor: "pointer" }}
          >
            <span>Cerrar sesión</span>
          </div>
        </div>
      </div>

    </section>
  );
};

export default Ajustes;
