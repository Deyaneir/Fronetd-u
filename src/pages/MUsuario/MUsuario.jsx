import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./MUsuario.css";

const MUsuario = () => {
  const navigate = useNavigate();

  // =====================
  // ESTADOS
  // =====================
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

  // =====================
  // UTILIDAD AVATAR (CACHE FIX)
  // =====================
  const getAvatarUrl = (url) => {
    if (!url) return null;
    return `${url}?t=${Date.now()}`;
  };

  // =====================
  // TRAER PERFIL
  // =====================
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/perfil`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const u = response.data;

        if (u?.nombre) setUserName(u.nombre);
        if (u?.estado) setUserStatus(u.estado);
        if (u?.avatar) setAvatar(u.avatar);
        if (u?.telefono) setUserPhone(u.telefono);
        if (u?.direccion) setUserAddress(u.direccion);
        if (u?.cedula) setUserCedula(u.cedula);
        if (u?.descripcion) setUserDescription(u.descripcion);
        if (u?.universidad) setUserUniversity(u.universidad);
        if (u?.carrera) setUserCareer(u.carrera);
      } catch (err) {
        console.error("Error al obtener usuario:", err);
      }
    };

    fetchUserInfo();
  }, []);

  // =====================
  // SUBIR AVATAR (SOLO MENÚ HAMBURGUESA)
  // =====================
  const handleFileClick = () => fileInputRef.current.click();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "VIBE-U");
    formData.append("folder", "avatars");

    try {
      const resCloudinary = await axios.post(
        "https://api.cloudinary.com/v1_1/dm5yhmz9a/image/upload",
        formData
      );

      const newAvatarUrl = resCloudinary.data.secure_url;
      setAvatar(newAvatarUrl);

      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/actualizar`,
        { avatar: newAvatarUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Avatar actualizado correctamente");
    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar avatar");
    }
  };

  // =====================
  // MENU HAMBURGUESA
  // =====================
  const handleMenuToggle = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    const handleClickOutside = (e) => {
      const menu = document.querySelector(".side-menu");
      const hamburger = document.querySelector(".hamburger-btn");

      if (
        menuOpen &&
        menu &&
        !menu.contains(e.target) &&
        hamburger &&
        !hamburger.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [menuOpen]);

  // =====================
  // PANEL DERECHO
  // =====================
  const renderRightContent = () => {
    if (activeTab !== "cuenta") return null;

    return (
      <div className="user-profile-section">
        <div className="avatar-circle-large">
          {avatar ? (
            <img
              src={getAvatarUrl(avatar)}
              className="avatar-img-large"
              alt="avatar"
              style={{ pointerEvents: "none" }}   // ✅ NO CLICK
            />
          ) : (
            <div className="default-avatar-large">👤</div>
          )}
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
  };

  // =====================
  // RENDER
  // =====================
  return (
    <div className="musuario-container">
      <ToastContainer />

      {/* HAMBURGUESA */}
      <button className="hamburger-btn" onClick={handleMenuToggle}>
        <span />
        <span />
        <span />
      </button>

      {/* SIDE MENU */}
      <nav className={`side-menu ${menuOpen ? "show" : ""}`}>
        <div className="menu-header">
          <h3 className="menu-title">Menú</h3>

          {/* ✅ ÚNICO AVATAR CLICKABLE */}
          <div className="avatar-container" onClick={handleFileClick}>
            {avatar ? (
              <img src={getAvatarUrl(avatar)} className="avatar-img" />
            ) : (
              <div className="default-avatar">👤</div>
            )}
            <div className="avatar-overlay">📷</div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="input-file-hidden"
            accept="image/*"
          />
        </div>

        <div className="menu-buttons">
          <button onClick={() => navigate("/Dashboard")}>Inicio</button>
          <button onClick={() => navigate("/MUsuario")}>Mi cuenta</button>
          <button onClick={() => navigate("/Ajustes")}>Ajustes</button>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </nav>

      {/* PANEL IZQUIERDO (NO CLICK) */}
      <div className="main-nav-panel">
        <div
          className="desktop-avatar-container"
          style={{ pointerEvents: "none" }}   // ✅ NO CLICK
        >
          {avatar ? (
            <img src={getAvatarUrl(avatar)} alt="avatar" />
          ) : (
            <div className="default-avatar">👤</div>
          )}
        </div>

        <h3>{userName}</h3>
        <span className="desktop-status">{userStatus}</span>

        <div className="menu-buttons">
          <button
            className={activeTab === "cuenta" ? "active" : ""}
            onClick={() => setActiveTab("cuenta")}
          >
            Cuenta
          </button>
        </div>
      </div>

      <div className="right-panel">{renderRightContent()}</div>
    </div>
  );
};

export default MUsuario;
