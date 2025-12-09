import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './MUsuario.css';

const MUsuario = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Usuario");
  const [userRole, setUserRole] = useState("disponible"); 
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

  const getAvatarUrl = (url) => url ? url.split('?')[0] : null;
  const formatRole = (role) => role ? role.charAt(0).toUpperCase() + role.slice(1).toLowerCase() : "No disponible";

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/perfil`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const userData = response.data;
        if (userData?.nombre) setUserName(userData.nombre);
        if (userData?.estado) setUserRole(userData.estado); 
        if (userData?.avatar) setAvatar(getAvatarUrl(userData.avatar)); 
        if (userData?.telefono) setUserPhone(userData.telefono);
        if (userData?.direccion) setUserAddress(userData.direccion);
        if (userData?.cedula) setUserCedula(userData.cedula);
        if (userData?.descripcion) setUserDescription(userData.descripcion);
        if (userData?.universidad) setUserUniversity(userData.universidad);
        if (userData?.carrera) setUserCareer(userData.carrera);
      } catch (error) {
        console.error("Error al obtener el usuario:", error);
      }
    };
    fetchUserInfo();
  }, []);

  const handleFileClick = () => fileInputRef.current.click();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "VIBE-U");
    formData.append("folder", "avatars");
    const token = localStorage.getItem('token');
    if (!token) { toast.error("Sesión expirada"); return; }

    try {
      const resCloudinary = await axios.post(
        "https://api.cloudinary.com/v1_1/dm5yhmz9a/image/upload",
        formData
      );
      const correctedAvatarUrl = getAvatarUrl(resCloudinary.data.secure_url);
      setAvatar(correctedAvatarUrl);
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/actualizar`,
        { avatar: correctedAvatarUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Avatar actualizado");
    } catch (err) {
      console.error(err);
      toast.error("Error al actualizar el avatar");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleMenuToggle = () => setMenuOpen(!menuOpen);

  const renderRightContent = () => {
    switch (activeTab) {
      case "cuenta":
        return (
          <div className="user-profile-section">
            <h3 style={{ textAlign: "center", marginBottom: "15px", color: "#000" }}>{userName}</h3>
            <div className="avatar-circle-large">
              {avatar ? <img src={avatar} alt="Avatar" /> : <span className="default-avatar-large">👤</span>}
            </div>
            <div className="profile-info">
              <div><strong>Descripción:</strong> {userDescription || "No disponible"}</div>
              <div><strong>Teléfono:</strong> {userPhone || "No disponible"}</div>
              <div><strong>Dirección:</strong> {userAddress || "No disponible"}</div>
              <div><strong>Cédula:</strong> {userCedula || "No disponible"}</div>
              <div><strong>Universidad:</strong> {userUniversity || "No disponible"}</div>
              <div><strong>Carrera:</strong> {userCareer || "No disponible"}</div>
            </div>
          </div>
        );
      case "favoritos": return <div><h3>Favoritos</h3></div>;
      case "chats": return <div><h3>Chats</h3></div>;
      case "notificaciones": return <div><h3>Notificaciones</h3></div>;
      default: return null;
    }
  };

  return (
    <div className="musuario-container">
      <ToastContainer />

      {/* HAMBURGUESA */}
      <button className={`hamburger-btn ${menuOpen ? "open" : ""}`} onClick={handleMenuToggle}>
        <span></span><span></span><span></span>
      </button>

      {/* MENÚ LATERAL */}
      <nav className={`side-menu ${menuOpen ? "show" : ""}`}>
        <div className="menu-header">
          <h3 className="menu-title">Menú</h3>
          <div className="avatar-container">{avatar ? <img src={avatar} alt="Avatar" /> : <span className="default-avatar">👤</span>}</div>
        </div>
        <div className="menu-buttons">
          <button onClick={() => navigate("/Dashboard")}>Inicio</button>
          <button onClick={() => navigate("/MUsuario")}>Mi cuenta</button>
          <button onClick={() => setActiveTab("favoritos")}>Favoritos</button>
          <button onClick={() => navigate("/Ajustes")}>Ajustes</button>
          <button onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </nav>

      <div className="main-nav-panel">
        <div className="left-panel-content">
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <div style={{ width: "100px", height: "100px", borderRadius: "50%", overflow: "hidden", margin: "0 auto", backgroundColor: "#ddd" }}>
              {avatar ? <img src={avatar} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: "50px", display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>👤</span>}
            </div>
            <h3 style={{ color: "white", marginTop: "10px"}}>{userName}</h3>
            <p className="desktop-status">{formatRole(userRole)}</p>
            <hr style={{ borderTop: "1px solid rgba(255, 255, 255, 0.2)" }} />
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
