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

  const getAvatarUrl = (url) => url ? `${url}?t=${new Date().getTime()}` : null;

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/perfil`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data?.nombre) setUserName(res.data.nombre);
        if (res.data?.estado) setUserStatus(res.data.estado);
        if (res.data?.avatar) setAvatar(res.data.avatar);
        setUserPhone(res.data?.telefono || "");
        setUserAddress(res.data?.direccion || "");
        setUserCedula(res.data?.cedula || "");
        setUserDescription(res.data?.descripcion || "");
        setUserUniversity(res.data?.universidad || "");
        setUserCareer(res.data?.carrera || "");
      } catch (err) {
        console.error("Error al obtener usuario:", err);
      }
    };

    fetchUserInfo();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleMenuToggle = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    const handleClickOutside = (e) => {
      const menu = document.querySelector(".side-menu");
      const hamburger = document.querySelector(".hamburger-btn");
      if (menuOpen && menu && !menu.contains(e.target) && hamburger && !hamburger.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    const handleEscape = (e) => { if (e.key === "Escape" && menuOpen) setMenuOpen(false); };
    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  const renderRightContent = () => {
    switch (activeTab) {
      case "cuenta":
        return (
          <div className="user-profile-section">
            <h3 style={{ textAlign: "center", marginBottom: "15px", color: "#000" }}>{userName}</h3>

            <div className="profile-header" style={{ justifyContent: "center" }}>
              <div className="avatar-circle-large">
                {avatar ? (
                  <img src={getAvatarUrl(avatar)} alt="Avatar" className="avatar-img-large" />
                ) : (
                  <span className="default-avatar-large">👤</span>
                )}
              </div>
            </div>

            <div className="profile-info">
              <div className="info-row"><strong>Descripción:</strong> <span>{userDescription || "No disponible"}</span></div>
              <div className="info-row"><strong>Teléfono:</strong> <span>{userPhone || "No disponible"}</span></div>
              <div className="info-row"><strong>Dirección:</strong> <span>{userAddress || "No disponible"}</span></div>
              <div className="info-row"><strong>Cédula:</strong> <span>{userCedula || "No disponible"}</span></div>
              <div className="info-row"><strong>Universidad:</strong> <span>{userUniversity || "No disponible"}</span></div>
              <div className="info-row"><strong>Carrera:</strong> <span>{userCareer || "No disponible"}</span></div>
            </div>
          </div>
        );
      case "favoritos": return <div><h3>Favoritos</h3><p>Información de tu cuenta...</p></div>;
      case "chats": return <div><h3>Chats</h3><p>Tus conversaciones...</p></div>;
      case "notificaciones": return <div><h3>Notificaciones</h3><p>Tus notificaciones...</p></div>;
      default: return null;
    }
  };

  return (
    <div className="musuario-container">
      <ToastContainer />
      <button className={`hamburger-btn ${menuOpen ? "open" : ""}`} onClick={handleMenuToggle}>
        <span></span><span></span><span></span>
      </button>

      <nav className={`side-menu ${menuOpen ? "show" : ""}`}>
        <div className="menu-header">
          <h3 className="menu-title">Menú</h3>
          <div className="avatar-section">
            <div className="avatar-container">
              {avatar ? (
                <img src={getAvatarUrl(avatar)} alt="Avatar" className="avatar-img" />
              ) : (
                <span className="default-avatar">👤</span>
              )}
            </div>
          </div>
        </div>
        <div className="menu-buttons">
          <button onClick={() => navigate("/Dashboard")}>Inicio</button>
          <button onClick={() => navigate("/MUsuario")}>Mi cuenta</button>
          <button onClick={() => {}}>Favoritos</button>
          <button onClick={() => navigate("/Ajustes")}>Ajustes</button>
          <button onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </nav>

      <div className="main-nav-panel">
        <div className="left-panel-content">
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <div className="avatar-container">
              {avatar ? <img src={getAvatarUrl(avatar)} alt="Avatar" className="avatar-img" /> : <span className="default-avatar">👤</span>}
            </div>
            <h3 style={{ color: "white", marginTop: "10px" }}>{userName}</h3>
            <p style={{ color: "#8bc34a", marginTop: "-5px" }}>{userStatus}</p>
          </div>
          <div className="menu-buttons">
            <button className={activeTab === "cuenta" ? "active" : ""} onClick={() => setActiveTab("cuenta")}>Cuenta</button>
            <button className={activeTab === "favoritos" ? "active" : ""} onClick={() => setActiveTab("favoritos")}>Favoritos</button>
            <button className={activeTab === "chats" ? "active" : ""} onClick={() => setActiveTab("chats")}>Chats</button>
            <button className={activeTab === "notificaciones" ? "active" : ""} onClick={() => setActiveTab("notificaciones")}>Notificaciones</button>
          </div>
        </div>
      </div>

      <div className="right-panel">{renderRightContent()}</div>
    </div>
  );
};

export default MUsuario;
