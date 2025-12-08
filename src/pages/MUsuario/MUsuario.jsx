import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./MUsuario.css";

const MUsuario = () => {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("Usuario");
  const [userRole, setUserRole] = useState("");
  const [userStatus, setUserStatus] = useState("Disponible");
  const [avatar, setAvatar] = useState(null);
  const [activeTab, setActiveTab] = useState("cuenta");

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/usuarios/perfil`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const u = res.data;
      setUserName(u.nombre);
      setUserRole(u.rol);
      setUserStatus(u.estado);
      setAvatar(u.avatar);
    };

    fetchUserInfo();
  }, []);

  return (
    <div className="musuario-container">
      <div className="main-nav-panel">
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 100, height: 100, borderRadius: "50%", overflow: "hidden", margin: "0 auto" }}>
            {avatar ? <img src={avatar} style={{ width: "100%", height: "100%" }} /> : "👤"}
          </div>

          {userRole && <p style={{ textTransform: "capitalize" }}>{userRole}</p>}
          <h3>{userName}</h3>
          <p>{userStatus}</p>
        </div>

        <button onClick={() => setActiveTab("cuenta")}>Cuenta</button>
        <button onClick={() => navigate("/Ajustes")}>Ajustes</button>
        <button onClick={() => navigate("/login")}>Cerrar sesión</button>
      </div>

      <div className="right-panel">
        {activeTab === "cuenta" && <h3>Mi cuenta</h3>}
      </div>
    </div>
  );
};

export default MUsuario;
