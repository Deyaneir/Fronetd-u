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
    return url; // ✅ NO timestamp → no cambia solo
  };

  // ✅ ÚNICO useEffect (se eliminó el duplicado)
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/perfil`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data?.nombre) setUserName(response.data.nombre);
        if (response.data?.estado) setUserStatus(response.data.estado);
        if (response.data?.avatar) setAvatar(response.data.avatar);
        if (response.data?.telefono) setUserPhone(response.data.telefono);
        if (response.data?.direccion) setUserAddress(response.data.direccion);
        if (response.data?.cedula) setUserCedula(response.data.cedula);
        if (response.data?.descripcion) setUserDescription(response.data.descripcion);
        if (response.data?.universidad) setUserUniversity(response.data.universidad);
        if (response.data?.carrera) setUserCareer(response.data.carrera);

      } catch (error) {
        console.error("Error al obtener el usuario:", error);
      }
    };

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

    const token = localStorage.getItem('token');
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
        `${import.meta.env.VITE_BACKEND_URL}/actualizar`,
        { avatar: newAvatarUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Avatar actualizado.");
    } catch (err) {
      toast.error("Error al actualizar avatar.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="musuario-container">
      <ToastContainer />

      <button className={`hamburger-btn ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(!menuOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav className={`side-menu ${menuOpen ? "show" : ""}`}>
        <div className="menu-header">
          <h3 className="menu-title">Menú</h3>

          {/* ✅ DIVS CORRECTAMENTE CERRADOS */}
          <div className="avatar-section">
            {avatar ? (
              <img src={getAvatarUrl(avatar)} alt="Avatar" className="avatar-img" />
            ) : (
              <span className="default-avatar">👤</span>
            )}

            <div className="avatar-overlay" onClick={handleFileClick}>
              <i className="fa fa-camera"></i>
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
          <button>Favoritos</button>
          <button onClick={() => navigate("/Ajustes")}>Ajustes</button>
          <button onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </nav>

      <div className="main-nav-panel">
        <div className="left-panel-content">
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <div style={{ width: 100, height: 100, borderRadius: "50%", overflow: "hidden", margin: "0 auto" }}>
              {avatar ? (
                <img src={getAvatarUrl(avatar)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <span style={{ fontSize: 50 }}>👤</span>
              )}
            </div>

            <h3 style={{ color: "white", marginTop: 10 }}>{userName}</h3>
            <p style={{ color: "#8bc34a" }}>{userStatus}</p>
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
        {activeTab === "cuenta" && (
          <div className="user-profile-section">
            <h3 style={{ textAlign: "center" }}>{userName}</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default MUsuario;
