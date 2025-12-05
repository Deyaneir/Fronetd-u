// Global_Styles/Menu.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Menu.css";

const MenuHamburguesa = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const [userName, setUserName] = useState("Usuario");
  const [userStatus, setUserStatus] = useState("Disponible");
  const [avatar, setAvatar] = useState(null);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const getAvatarUrl = (url) => {
    if (!url) return null;
    return `${url}?t=${new Date().getTime()}`;
  };

  // OBTENER DATOS DEL USUARIO
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/usuarios/perfil`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await response.json();

        if (data.nombre) setUserName(data.nombre);
        if (data.estado) setUserStatus(data.estado);
        if (data.avatar) setAvatar(data.avatar);
      } catch (error) {
        console.error("Error cargando usuario en menú:", error);
      }
    };
    fetchUserInfo();
  }, []);

  // CERRAR MENÚ AL HACER CLICK AFUERA
  useEffect(() => {
    const handleClickOutside = (event) => {
      const menu = document.querySelector(".side-menu");
      const hamburger = document.querySelector(".hamburger-btn");

      if (
        menuOpen &&
        menu &&
        !menu.contains(event.target) &&
        hamburger &&
        !hamburger.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () =>
      document.removeEventListener("click", handleClickOutside);
  }, [menuOpen]);

  return (
    <>
      {/* BOTÓN */}
      <button
        className={`hamburger-btn ${menuOpen ? "open" : ""}`}
        onClick={toggleMenu}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* MENÚ */}
      <nav className={`side-menu ${menuOpen ? "show" : ""}`}>
        <div className="menu-header">
          <div className="avatar-circle">
            {avatar ? (
              <img
                src={getAvatarUrl(avatar)}
                alt="Avatar"
                className="avatar-img"
              />
            ) : (
              <span className="default-avatar">👤</span>
            )}
          </div>

          <h3 className="user-name">{userName}</h3>
          <p className="user-status">{userStatus}</p>
        </div>

        <div className="menu-buttons">
          <button onClick={() => navigate("/dashboard")}>Inicio</button>
          <button onClick={() => navigate("/MUsuario")}>Mi perfil</button>
          <button onClick={() => navigate("/matches")}>Matches</button>
          <button onClick={() => navigate("/ajustes")}>Ajustes</button>
          <button onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </nav>
    </>
  );
};

export default MenuHamburguesa;
