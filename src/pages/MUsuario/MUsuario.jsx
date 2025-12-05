import React, { useState } from "react";
import "./MUsuario.css"; 
// No se incluyen axios, toast o MenuHamburguesa para mantener el código minimalista y centrado en la estructura.

const MUsuario = () => {
  // Los datos del usuario están simulados basándose en la imagen adjunta
  const [userInfo, setUserInfo] = useState({
    nombre: "Damaris Lopez", // Simulado
    status: "Disponible", // Simulado
    avatarUrl: "/path/to/robot-avatar.png", // URL simulada
    descripcion: "dscasc",
    telefono: "0987654321",
    direccion: "Quitumbe",
    cedula: "1786543209",
    universidad: "EPN",
    carrera: "Software",
  });
  
  const [activeTab, setActiveTab] = useState("cuenta"); // Estado para manejar la pestaña activa

  // Función para renderizar la tarjeta de perfil (para la pestaña "Cuenta")
  const renderProfileCard = () => (
    <div className="info-wrapper">
      <div className="profile-card">
        {/* Aquí renderizamos el avatar grande que se ve en la imagen del perfil/tarjeta */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
             {/* Clase de avatar simulada para el perfil derecho. Necesitarás CSS adicional para estilizarlo como el robot de la imagen. */}
             <div className="large-robot-avatar">
                {/*  */}
             </div>
        </div>

        {/* Mapeo simple de la información, imitando el formato de la imagen */}
        <p><strong>Descripción:</strong>{userInfo.descripcion}</p>
        <p><strong>Teléfono:</strong>{userInfo.telefono}</p>
        <p><strong>Dirección:</strong>{userInfo.direccion}</p>
        <p><strong>Cédula:</strong>{userInfo.cedula}</p>
        <p><strong>Universidad:</strong>{userInfo.universidad}</p>
        <p><strong>Carrera:</strong>{userInfo.carrera}</p>

        <button className="edit-btn">Editar Perfil</button>
      </div>
    </div>
  );
  
  // Función para determinar qué contenido mostrar en el panel derecho
  const renderRightContent = () => {
    switch (activeTab) {
      case "cuenta":
        return renderProfileCard();
      case "favoritos":
        return <h2 style={{ color: '#000' }}>Contenido de Favoritos</h2>;
      case "chats":
        return <h2 style={{ color: '#000' }}>Contenido de Chats</h2>;
      case "notificaciones":
        return <h2 style={{ color: '#000' }}>Contenido de Notificaciones</h2>;
      default:
        return null;
    }
  };


  return (
    <div className="musuario-container">
      
      {/* ========================================================== */}
      {/* 1. PANEL IZQUIERDO: Navegación Fija (Clase: main-nav-panel) */}
      {/* ========================================================== */}
      <div className="main-nav-panel">
        
        <div style={{ textAlign: "center", width: "100%" }}>
            {/* Avatar en el panel lateral */}
            <div className="user-avatar">
              <img 
                src={userInfo.avatarUrl} // Deberías usar el valor real de `avatar`
                alt="Avatar de Usuario" 
              />
            </div>

            {/* Información del usuario en el panel lateral */}
            <div className="user-info">
              <h3>{userInfo.nombre}</h3>
              <p style={{ color: '#f0f0f0', marginTop: '-10px' }}>{userInfo.status}</p>
            </div>
        </div>

        {/* Botones de navegación (Clase: menu-buttons) */}
        <div className="menu-buttons">
          <button 
            onClick={() => setActiveTab("cuenta")}
            className={activeTab === "cuenta" ? "active" : ""}
          >
            Cuenta
          </button>
          
          <button 
            onClick={() => setActiveTab("favoritos")}
            className={activeTab === "favoritos" ? "active" : ""}
          >
            Favoritos
          </button>
          
          <button 
            onClick={() => setActiveTab("chats")}
            className={activeTab === "chats" ? "active" : ""}
          >
            Chats
          </button>
          
          <button 
            onClick={() => setActiveTab("notificaciones")}
            className={activeTab === "notificaciones" ? "active" : ""}
          >
            Notificaciones
          </button>
        </div>
        
        {/* Aquí puedes añadir más elementos del panel lateral, si los hubiera */}
        
      </div>

      {/* =============================================================== */}
      {/* 2. PANEL DERECHO: Contenido Principal (Clase: right-panel)      */}
      {/* =============================================================== */}
      <div className="right-panel">
        {renderRightContent()}
      </div>
    </div>
  );
};

export default MUsuario;
