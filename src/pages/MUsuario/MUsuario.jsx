import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './MUsuario.css';

const MUsuario = () => {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("Usuario");
  const [userStatus, setUserStatus] = useState("Disponible");
  const [avatar, setAvatar] = useState(null);
  const [activeTab, setActiveTab] = useState("cuenta");
  const [menuOpen, setMenuOpen] = useState(false);

  const [userPhone, setUserPhone] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [userCedula, setUserCedula] = useState("");
  const [userDescription, setUserDescription] = useState("");
  const [userUniversity, setUserUniversity] = useState("");
  const [userCareer, setUserCareer] = useState("");

  const getAvatarUrl = (url) => {
    if (!url) return null;
    return `${url}?t=${Date.now()}`;
  };

  // =============================
  // OBTENER USUARIO
  // =============================
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/usuarios/perfil`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = res.data;

        setUserName(data.nombre || "Usuario");
        setUserStatus(data.estado || "Disponible");
        setAvatar(data.avatar || null);
        setUserPhone(data.telefono || "");
        setUserAddress(data.direccion || "");
        setUserCedula(data.cedula || "");
        setUserDescription(data.descripcion || "");
        setUserUniversity(data.universidad || "");
        setUserCareer(data.carrera || "");

      } catch (error) {
        console.error("Error al obtener usuario:", error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="musuario-container">
      <ToastContainer />

      {/* BOTÓN MENÚ */}
      <button
        className={`hamburger-btn ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* MENÚ DESLIZABLE */}
      <nav className={`side-menu ${menuOpen ? "show" : ""}`}>
        <div className="menu-header">
          <h3 className="menu-title">Menú</h3>

          {/* ✅ AVATAR SOLO VISUAL */}
          <div className="avatar-section">
            <div className="avatar-container no-click">
              {avatar ? (
                <img
                  src={getAvatarUrl(avatar)}
                  alt="Avatar"
                  className="avatar-img"
                />
              ) : (
                <span className="default-avatar">👤</span>
              )}
            </div>
          </div>
        </div>

        <div className="menu-buttons">
          <button onClick={() => navigate("/Dashboard")}>Inicio</button>
          <button onClick={() => navigate("/MUsuario")}>Mi cuenta</button>
          <button>Favoritos</button>
          <button onClick={() => navigate("/Ajustes")}>Ajustes</button>
          <button onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </nav>

      {/* PANEL IZQUIERDO */}
      <div className="main-nav-panel">
        <div style={{ textAlign: "center" }}>
          <div className="avatar-circle-large no-click">
            {avatar ? (
              <img src={getAvatarUrl(avatar)} alt="Avatar" />
            ) : (
              <span className="default-avatar-large">👤</span>
            )}
          </div>

          <h3 style={{ color: "white" }}>{userName}</h3>
          <p style={{ color: "#8bc34a" }}>{userStatus}</p>
        </div>
      </div>

      {/* PANEL DERECHO */}
      <div className="right-panel">
        <h3>{userName}</h3>
      </div>
    </div>
  );
};

export default MUsuario;
