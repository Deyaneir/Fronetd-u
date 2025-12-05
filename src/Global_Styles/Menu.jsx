import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Menu.css";

const MenuHamburguesa = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Cerrar menú al hacer click afuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      const menu = document.querySelector(".side-menu");
      const hamburger = document.querySelector(".hamburger-btn");

      if (menuOpen && menu && !menu.contains(event.target) && hamburger && !hamburger.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [menuOpen]);

  return (
    <>
      {/* BOTÓN */}
      <button className={`hamburger-btn ${menuOpen ? "open" : ""}`} onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* MENÚ */}
      <nav className={`side-menu ${menuOpen ? "show" : ""}`}>
        <div className="menu-header">
          <h3 className="menu-title">Menú</h3>
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
