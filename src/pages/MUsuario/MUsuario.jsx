import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./MUsuario.css";

const MUsuario = () => {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("Usuario");
  const [userRole, setUserRole] = useState("");
  const [userStatus, setUserStatus] = useState("Disponible");
  const [avatar, setAvatar] = useState("");
  const [activeTab, setActiveTab] = useState("cuenta");

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/usuarios/perfil`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const u = res.data;

        setUserName(u.nombre || "Usuario");
        setUserRole(u.rol || "");
        setUserStatus(u.estado || "Disponible");
        setAvatar(u.avatar || "");
      } catch (error) {
        console.error("Error al cargar perfil:", error);
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <div className="musuario-container">
      {/* PANEL IZQUIERDO */}
      <div className="main-nav-panel">
        <div className="perfil-panel">
          {/* AVATAR SOLO VISUAL */}
          <div className="avatar-container">
            <img
              src={avatar || "/avatar-default.png"}
              alt="Avatar del usuario"
              className="avatar-img"
              draggable={false}
            />
          </div>

          {/* ROL */}
          {userRole && (
            <p className="rol-usuario">
              {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
            </p>
          )}

          {/* NOMBRE */}
          <h3 className="nombre-usuario">{userName}</h3>

          {/* ESTADO */}
          <p className="estado-usuario">{userStatus}</p>
        </div>

        {/* BOTONES */}
        <button onClick={() => setActiveTab("cuenta")}>Cuenta</button>
        <button onClick={() => navigate("/Ajustes")}>Ajustes</button>
        <button onClick={() => navigate("/login")}>Cerrar sesión</button>
      </div>

      {/* PANEL DERECHO */}
      <div className="right-panel">
        {activeTab === "cuenta" && <h3>Mi cuenta</h3>}
      </div>
    </div>
  );
};

export default MUsuario;
