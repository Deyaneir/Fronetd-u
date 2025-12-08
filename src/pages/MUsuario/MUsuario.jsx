import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./MUsuario.css";

const MUsuario = () => {
  const navigate = useNavigate();

  // =====================
  // ESTADOS
  // =====================
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("cuenta");

  // =====================
  // TRAER PERFIL (YA EXISTENTE)
  // =====================
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/usuarios/perfil`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser(res.data); // ⬅️ AQUÍ ESTÁ TODO (incluido avatar Cloudinary)
      } catch (error) {
        console.error("Error cargando perfil:", error);
      }
    };

    fetchUserInfo();
  }, []);

  // =====================
  // GUARDAS DE SEGURIDAD
  // =====================
  const avatar = user?.avatar;
  const nombre = user?.nombre || "Usuario";
  const rol = user?.rol || "";
  const estado = user?.estado || "Disponible";

  // =====================
  // RENDER
  // =====================
  return (
    <div className="musuario-container">
      {/* ===================== PANEL IZQUIERDO ===================== */}
      <div className="main-nav-panel">
        <div className="desktop-avatar-section">
          <div className="desktop-avatar-container">
            {avatar ? (
              <img src={avatar} alt="avatar" />
            ) : (
              <div className="default-avatar">👤</div>
            )}
          </div>

          {rol && (
            <p style={{ textTransform: "capitalize", margin: "5px 0" }}>
              {rol}
            </p>
          )}

          <h3>{nombre}</h3>
          <span className="desktop-status">{estado}</span>
        </div>

        <div className="menu-buttons">
          <button
            className={activeTab === "cuenta" ? "active" : ""}
            onClick={() => setActiveTab("cuenta")}
          >
            Cuenta
          </button>

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
      </div>

      {/* ===================== PANEL DERECHO ===================== */}
      <div className="right-panel">
        {activeTab === "cuenta" && (
          <div className="user-profile-section">
            <div className="avatar-circle-large">
              {avatar ? (
                <img
                  src={avatar}
                  className="avatar-img-large"
                  alt="avatar"
                />
              ) : (
                <div className="default-avatar-large">👤</div>
              )}
            </div>

            <div className="profile-info">
              <div className="info-row">
                <strong>Nombre:</strong>
                <span>{nombre}</span>
              </div>

              <div className="info-row">
                <strong>Rol:</strong>
                <span style={{ textTransform: "capitalize" }}>{rol}</span>
              </div>

              <div className="info-row">
                <strong>Estado:</strong>
                <span>{estado}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MUsuario;
