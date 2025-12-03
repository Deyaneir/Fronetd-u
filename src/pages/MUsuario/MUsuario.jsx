import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFetch } from "../../hooks/useFetch.js"; // importamos hook
import "./MUsuario.css";

const MUsuario = () => {
  const navigate = useNavigate();
  const fetchData = useFetch();
  const fileInputRef = useRef(null);

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

  // Función para refrescar avatar
  const getAvatarUrl = (url) => (url ? `${url}?t=${new Date().getTime()}` : null);

  // 🔹 Cargar perfil al iniciar
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const data = await fetchData(
          `${import.meta.env.VITE_BACKEND_URL}/api/usuarios/perfil`,
          null,
          "GET",
          { Authorization: `Bearer ${token}` }
        );

        setUserName(data.nombre || "Usuario");
        setUserStatus(data.estado || "Disponible");
        setAvatar(data.avatar || null);
        setUserPhone(data.telefono || "");
        setUserAddress(data.direccion || "");
        setUserCedula(data.cedula || "");
        setUserDescription(data.descripcion || "");
        setUserUniversity(data.universidad || "");
        setUserCareer(data.carrera || "");

      } catch (err) {
        console.error(err);
      }
    };

    fetchUserInfo();
  }, []);

  // 🔹 Subir avatar
  const handleFileClick = () => fileInputRef.current.click();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "VIBE-U");
    formData.append("folder", "avatars");

    try {
      const resCloudinary = await fetchData(
        "https://api.cloudinary.com/v1_1/dm5yhmz9a/image/upload",
        formData,
        "POST"
      );
      const newAvatarUrl = resCloudinary.secure_url;
      setAvatar(newAvatarUrl);

      const token = localStorage.getItem("token");
      if (token) {
        await fetchData(
          `${import.meta.env.VITE_BACKEND_URL}/api/usuarios/actualizar`,
          { avatar: newAvatarUrl },
          "PUT",
          { Authorization: `Bearer ${token}` }
        );
        toast.success("Avatar actualizado correctamente.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error al actualizar avatar");
    }
  };

  // 🔹 Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // 🔹 Menu toggle
  const handleMenuToggle = () => setMenuOpen(!menuOpen);

  // 🔹 Cerrar menú si clic afuera o Escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      const menu = document.querySelector(".side-menu");
      const btn = document.querySelector(".hamburger-btn");
      if (menuOpen && menu && !menu.contains(e.target) && btn && !btn.contains(e.target)) setMenuOpen(false);
    };
    const handleEscape = (e) => { if (e.key === "Escape") setMenuOpen(false); };
    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  // 🔹 Render derecha según tab
  const renderRightContent = () => {
    switch (activeTab) {
      case "cuenta":
        return (
          <div className="user-profile-section">
            <h3>{userName}</h3>
            <div className="avatar-circle-large">
              {avatar ? <img src={getAvatarUrl(avatar)} alt="Avatar" /> : <span>👤</span>}
            </div>
            <div className="profile-info">
              <div><strong>Teléfono:</strong> {userPhone || "No disponible"}</div>
              <div><strong>Dirección:</strong> {userAddress || "No disponible"}</div>
              <div><strong>Cédula:</strong> {userCedula || "No disponible"}</div>
              <div><strong>Universidad:</strong> {userUniversity || "No disponible"}</div>
              <div><strong>Carrera:</strong> {userCareer || "No disponible"}</div>
              <div><strong>Descripción:</strong> {userDescription || "No disponible"}</div>
            </div>
          </div>
        );
      case "favoritos": return <div>Favoritos...</div>;
      case "chats": return <div>Chats...</div>;
      case "notificaciones": return <div>Notificaciones...</div>;
      default: return null;
    }
  };

  return (
    <div className="musuario-container">
      <ToastContainer />
      <button className={`hamburger-btn ${menuOpen ? "open" : ""}`} onClick={handleMenuToggle}><span></span><span></span><span></span></button>

      <nav className={`side-menu ${menuOpen ? "show" : ""}`}>
        <div className="menu-header">
          <h3>Menú</h3>
          <div className="avatar-section" onClick={handleFileClick}>
            {avatar ? <img src={getAvatarUrl(avatar)} alt="Avatar" /> : <span>👤</span>}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="input-file-hidden" />
          </div>
        </div>
        <div className="menu-buttons">
          <button onClick={() => navigate("/Dashboard")}>Inicio</button>
          <button onClick={() => setActiveTab("cuenta")}>Mi cuenta</button>
          <button onClick={() => setActiveTab("favoritos")}>Favoritos</button>
          <button onClick={() => navigate("/Ajustes")}>Ajustes</button>
          <button onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </nav>

      <div className="right-panel">
        {renderRightContent()}
      </div>
    </div>
  );
};

export default MUsuario;
