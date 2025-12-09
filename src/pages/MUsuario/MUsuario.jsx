import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./MUsuario.css";
import MenuHamburguesa from "../../Global_Styles/Menu.jsx";


const MUsuario = () => {
  const [userName, setUserName] = useState("Usuario");
  // 🔑 CAMBIO 1: Cambiamos el nombre de la variable para que sea explícita (ROL)
  const [userRole, setUserRole] = useState("disponible"); 
  const [avatar, setAvatar] = useState(null); // URL del avatar guardada en la DB
  const [activeTab, setActiveTab] = useState("cuenta");
  const fileInputRef = useRef(null);

  const [userPhone, setUserPhone] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [userCedula, setUserCedula] = useState("");
  const [userDescription, setUserDescription] = useState("");
  const [userUniversity, setUserUniversity] = useState("");
  const [userCareer, setUserCareer] = useState("");

  // Función de utilidad para obtener la URL sin cambios innecesarios
  const getAvatarUrl = (url) => {
    if (!url) return null;
    return url; 
  };

  // 🔑 FUNCIÓN CLAVE: Asegura que el avatar de DiceBear tenga una seed
  const ensureFixedSeed = (url, name) => {
    if (url && url.includes("dicebear") && !url.includes("?seed=")) {
      const defaultStyle = "micah"; 
      // Crea una seed basada en el nombre para que el avatar sea fijo
      const seed = name?.trim().replace(/\s+/g, '_') || "default-user-vibe"; 
      return `https://api.dicebear.com/7.x/${defaultStyle}/svg?seed=${seed}`;
    }
    return url; 
  };

  // 🔑 FUNCIÓN DE FORMATO: Capitaliza la primera letra del rol
  const formatRole = (role) => {
    if (!role) return "";
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  };


  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/usuarios/perfil`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        const userData = response.data;

        // 🔑 CARGA Y CORRECCIÓN DEL ROL
        if (userData?.rol) setUserRole(userData.rol); 
        
        if (userData?.nombre) setUserName(userData.nombre);
        // Quitamos userStatus que no existe en el perfil, y usamos userRole en su lugar.
        if (userData?.telefono) setUserPhone(userData.telefono);
        if (userData?.direccion) setUserAddress(userData.direccion);
        if (userData?.cedula) setUserCedula(userData.cedula);
        if (userData?.descripcion) setUserDescription(userData.descripcion);
        if (userData?.universidad) setUserUniversity(userData.universidad);
        if (userData?.carrera) setUserCareer(userData.carrera);

        // APLICAR LA CORRECCIÓN DE AVATAR AL CARGAR
        let loadedAvatar = userData?.avatar || null;
        const fixedAvatar = ensureFixedSeed(loadedAvatar, userData?.nombre);

        setAvatar(fixedAvatar); 

      } catch (error) {
        console.error("Error al obtener el usuario:", error);
        if (error.response?.status === 401) {
          toast.error("Sesión expirada. Vuelve a iniciar sesión.");
        }
      }
    };

    fetchUserInfo();
  }, []); 

  const renderRightContent = () => {
    const currentAvatarUrl = getAvatarUrl(avatar);
    
    switch (activeTab) {
      case "cuenta":
        return (
          <div className="user-profile-section">
            <h3 style={{ textAlign: "center", marginBottom: "15px", color: "#000" }}>
              {userName || "Usuario"}
            </h3>

            <div className="profile-header" style={{ justifyContent: "center" }}>
              <div className="avatar-circle-large">
                {currentAvatarUrl ? (
                  <img
                    src={currentAvatarUrl}
                    alt="Avatar"
                    className="avatar-img-large"
                  />
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
        return <h3>Favoritos</h3>;

      case "chats":
        return <h3>Chats</h3>;

      case "notificaciones":
        return <h3>Notificaciones</h3>;

      default:
        return null;
    }
  };

  return (
    <div className="musuario-container">
      <ToastContainer />
       <MenuHamburguesa />

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
                <img
                  src={getAvatarUrl(avatar)} 
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span style={{ fontSize: "50px" }}>👤</span>
              )}
            </div>

            <h3 style={{ color: "white", marginTop: "10px" }}>{userName}</h3>
            {/* 🔑 CAMBIO 2: Mostrar el rol con la primera letra mayúscula */}
            <p style={{ color: "#8bc34a", marginTop: "-5px" }}>{formatRole(userRole)}</p>

            <hr style={{ opacity: 0.3 }} />
          </div>

          <div className="menu-buttons">
            <button
              className={activeTab === "cuenta" ? "active" : ""}
              onClick={() => setActiveTab("cuenta")}
            >
              Cuenta
            </button>
            <button
              className={activeTab === "favoritos" ? "active" : ""}
              onClick={() => setActiveTab("favoritos")}
            >
              Favoritos
            </button>
            <button
              className={activeTab === "chats" ? "active" : ""}
              onClick={() => setActiveTab("chats")}
            >
              Chats
            </button>
            <button
              className={activeTab === "notificaciones" ? "active" : ""}
              onClick={() => setActiveTab("notificaciones")}
            >
              Notificaciones
            </button>
          </div>
        </div>
      </div>

      <div className="right-panel">{renderRightContent()}</div>
    </div>
  );
};

export default MUsuario;
