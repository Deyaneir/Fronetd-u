import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./MUsuario.css";
import { FaCamera, FaUser } from "react-icons/fa";

const MUsuario = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const fileInputRef = useRef(null);

  // 👉 URL del avatar (UN SOLO ESTADO)
  const [avatarUrl, setAvatarUrl] = useState("");

  // ===============================
  // Cargar usuario (EJEMPLO)
  // ===============================
  useEffect(() => {
    const fetchUser = async () => {
      // EJEMPLO (ajusta a tu backend)
      const res = await axios.get("http://localhost:3001/user");
      setUser(res.data);
      setAvatarUrl(res.data.avatar); // 👈 MUY IMPORTANTE
    };

    fetchUser();
  }, []);

  // ===============================
  // Subir imagen a Cloudinary
  // ===============================
  const uploadAvatar = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "avatar_preset"); // TU preset
    formData.append("cloud_name", "TU_CLOUD_NAME");

    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/TU_CLOUD_NAME/image/upload",
      formData
    );

    return res.data.secure_url;
  };

  // ===============================
  // Cambiar avatar
  // ===============================
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = await uploadAvatar(file);
    setAvatarUrl(url);

    // Guardar en backend
    await axios.put("http://localhost:3001/user/avatar", {
      avatar: url,
    });
  };

  if (!user) return null;

  return (
    <div className="musuario-container">
      {/* ============ PANEL IZQUIERDO ============ */}
      <div className="main-nav-panel">
        <div className="desktop-avatar-section">
          <div className="desktop-avatar-container">
            {avatarUrl ? (
              <img src={avatarUrl} alt="avatar" />
            ) : (
              <FaUser size={60} />
            )}
          </div>
          <span className="desktop-status">Disponible</span>
        </div>
      </div>

      {/* ============ PANEL DERECHO ============ */}
      <div className="right-panel">
        <button className="hamburger-btn" onClick={() => setMenuOpen(true)}>
          <span />
          <span />
          <span />
        </button>

        {/* ===== MENU PEQUEÑO ===== */}
        <div className={`side-menu ${menuOpen ? "show" : ""}`}>
          <div className="menu-header">
            <div className="avatar-section">
              <div
                className="avatar-container"
                onClick={() => fileInputRef.current.click()}
              >
                {avatarUrl ? (
                  <img src={avatarUrl} className="avatar-img" />
                ) : (
                  <div className="default-avatar">
                    <FaUser />
                  </div>
                )}
                <div className="avatar-overlay">
                  <FaCamera />
                </div>
              </div>

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="input-file-hidden"
                onChange={handleAvatarChange}
              />
            </div>
          </div>

          <button onClick={() => setMenuOpen(false)}>Cerrar</button>
        </div>

        {/* ===== PERFIL GRANDE ===== */}
        <div className="user-profile-section">
          <div className="avatar-circle-large">
            {avatarUrl ? (
              <img src={avatarUrl} className="avatar-img-large" />
            ) : (
              <div className="default-avatar-large">
                <FaUser />
              </div>
            )}
          </div>

          <div className="profile-info">
            <div className="info-row">
              <strong>Nombre</strong>
              <span>{user.nombre}</span>
            </div>

            <div className="info-row">
              <strong>Rol</strong>
              <span>{user.rol}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MUsuario;
