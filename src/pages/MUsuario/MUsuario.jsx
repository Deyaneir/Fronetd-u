import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './MUsuario.css';

const MUsuario = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Usuario");
  const [userStatus, setUserStatus] = useState("Disponible");
  const [userRole, setUserRole] = useState(""); // Rol del usuario
  const [avatar, setAvatar] = useState(null);
  const [activeTab, setActiveTab] = useState("cuenta");
  const [menuOpen, setMenuOpen] = useState(false);
  const fileInputRef = useRef(null);

  const [userPhone, setUserPhone] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [userCedula, setUserCedula] = useState("");
  const [userDescription, setUserDescription] = useState("");
  const [userUniversity, setUserUniversity] = useState("");
  const [userCareer, setUserCareer] = useState("");

  const getAvatarUrl = (url) => {
    if (!url) return null;
    return `${url}?t=${new Date().getTime()}`;
  };

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/usuarios/perfil`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const u = response.data;

      setUserName(u.nombre || "Usuario");
      setUserStatus(u.estado || "Disponible");
      setUserRole(u.rol || ""); // Guardar rol
      setAvatar(u.avatar || null);
      setUserPhone(u.telefono || "");
      setUserAddress(u.direccion || "");
      setUserCedula(u.cedula || "");
      setUserDescription(u.descripcion || "");
      setUserUniversity(u.universidad || "");
      setUserCareer(u.carrera || "");

    } catch (error) {
      console.error("Error al obtener perfil:", error.response?.data || error);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "VIBE-U");
    formData.append("folder", "avatars");

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Sesión expirada.");
      return;
    }

    try {
      const resCloudinary = await axios.post(
        "https://api.cloudinary.com/v1_1/dm5yhmz9a/image/upload",
        formData
      );

      const newAvatarUrl = resCloudinary.data.secure_url;

      setAvatar(newAvatarUrl);

      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/usuarios/actualizar`,
        { avatar: newAvatarUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Avatar actualizado correctamente.");

    } catch (err) {
      console.error("Error al actualizar avatar:", err.response?.data || err);
      toast.error("Error al actualizar avatar.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const renderRightContent = () => {
    switch (activeTab) {
      case "cuenta":
        return (
          <div className="user-profile-section">
            <h3 style={{ textAlign: "center", marginBottom: "15px", color: "#000" }}>
              {userName || "Usuario"}
            </h3>

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
              <div className="info-row">
                <strong>Descripción:</strong>
                <span>{userDescription || "No disponible"}</span>
              </div>
              <div className="info-row">
                <strong>Teléfono:</strong>
                <span>{userPhone || "No disponible"}</span>
              </div>
              <div className="info-row">
                <strong>Dirección:</strong>
                <span>{userAddress || "No disponible"}</span>
              </div>
              <div className="info-row">
                <strong>Cédula:</strong>
                <span>{userCedula || "No disponible"}</span>
              </div>
              <div className="info-row">
                <strong>Universidad:</strong>
                <span>{userUniversity || "No disponible"}</span>
              </div>
              <div className="info-row">
                <strong>Carrera:</strong>
                <span>{userCareer || "No disponible"}</span>
              </div>
            </div>
          </div>
        );

      case "favoritos":
        return <div><h3>Favoritos</h3></div>;
      case "chats":
        return <div><h3>Chats</h3></div>;
      case "notificaciones":
        return <div><h3>Notificaciones</h3></div>;
      default:
        return null;
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
            <div className="avatar-container" onClick={handleFileClick}>
              {avatar ? (
                <img src={getAvatarUrl(avatar)} alt="Avatar" className="avatar-img" />
              ) : (
                <span className="default-avatar">👤</span>
              )}
              <div className="avatar-overlay">
                <i className="fa fa-camera"></i>
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="input-file-hidden"
              accept="image/*"
            />
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
            <div
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                overflow: "hidden",
                margin: "0 auto",
                backgroundColor: "#ddd",
              }}
            >
              {avatar ? (
                <img src={getAvatarUrl(avatar)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <span style={{ fontSize: "50px", display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>👤</span>
              )}
            </div>

            {/* Rol arriba de Disponible */}
            {userRole && (
              <p style={{ color: "white", fontSize: "0.9rem", marginBottom: "3px", textTransform: "capitalize" }}>
                {userRole}
              </p>
            )}

            <h3 style={{ color: "white", marginTop: "10px" }}>{userName}</h3>
            <p style={{ color: "#8bc34a", marginTop: "-5px" }}>{userStatus}</p>

            <hr style={{ marginTop: "10px", marginBottom: "10px", borderTop: "1px solid rgba(255, 255, 255, 0.2)" }} />
          </div>

          <div className="menu-buttons">
            <button className={activeTab === "cuenta" ? "active" : ""} onClick={() => setActiveTab("cuenta")}>Cuenta</button>
            <button className={activeTab === "favoritos" ? "active" : ""} onClick={() => setActiveTab("favoritos")}>Favoritos</button>
            <button className={activeTab === "chats" ? "active" : ""} onClick={() => setActiveTab("chats")}>Chats</button>
            <button className={activeTab === "notificaciones" ? "active" : ""} onClick={() => setActiveTab("notificaciones")}>Notificaciones</button>
          </div>

        </div>
      </div>

      <div className="right-panel">
        {renderRightContent()}
      </div>
    </div>
  );
};

export default MUsuario;
