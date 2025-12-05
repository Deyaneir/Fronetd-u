import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./MUsuario.css";
import MenuHamburguesa from "../../Global_Styles/Menu.jsx";

const MUsuario = () => {
  const [userName, setUserName] = useState("Usuario");
  const [userStatus, setUserStatus] = useState("Disponible");
  const [avatar, setAvatar] = useState(null);
  const [activeTab, setActiveTab] = useState("cuenta");

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

        const data = response.data;

        if (data.nombre) setUserName(data.nombre);
        if (data.estado) setUserStatus(data.estado);
        if (data.avatar) setAvatar(data.avatar);
        if (data.telefono) setUserPhone(data.telefono);
        if (data.direccion) setUserAddress(data.direccion);
        if (data.cedula) setUserCedula(data.cedula);
        if (data.descripcion) setUserDescription(data.descripcion);
        if (data.universidad) setUserUniversity(data.universidad);
        if (data.carrera) setUserCareer(data.carrera);
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
            <h3 className="title-profile">{userName}</h3>

            <div className="profile-header">
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

      {/* Aquí se inserta el menú hamburguesa */}
      <MenuHamburguesa />

      <div className="main-nav-panel">
        <div className="left-panel-content">
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <div className="avatar-left-wrap">
              {avatar ? (
                <img src={getAvatarUrl(avatar)} className="avatar-left" />
              ) : (
                <span className="avatar-left-default">👤</span>
              )}
            </div>

            <h3 className="left-name">{userName}</h3>
            <p className="left-status">{userStatus}</p>

            <hr className="left-divider" />
          </div>

          <div className="menu-buttons-left">
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
