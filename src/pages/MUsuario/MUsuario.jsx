import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./MUsuario.css";
import MenuHamburguesa from "../../components/Menu/MenuHamburguesa";


const MUsuario = () => {
  const [userName, setUserName] = useState("Usuario");
  const [userStatus, setUserStatus] = useState("Disponible");
  const [avatar, setAvatar] = useState(null);
  const [activeTab, setActiveTab] = useState("cuenta");
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

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/usuarios/perfil`,
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
        if (error.response?.status === 401) {
          toast.error("Sesión expirada. Vuelve a iniciar sesión.");
        }
      }
    };

    fetchUserInfo();
  }, []);

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
                  <img
                    src={getAvatarUrl(avatar)}
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
            <p style={{ color: "#8bc34a", marginTop: "-5px" }}>{userStatus}</p>

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
