// MUsuario.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import storeAuth from "../../context/storeAuth";
import "./MUsuario.css";

const MUsuario = () => {
  const [usuario, setUsuario] = useState(null);
  const token = storeAuth((state) => state.token);

  useEffect(() => {
    const obtenerPerfil = async () => {
      try {
        const res = await axios.get("https://unlikely-marji-vibe-u-56bc48e6.koyeb.app/usuarios/perfil", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsuario(res.data);
      } catch (error) {
        console.error("Error al obtener perfil:", error);
      }
    };

    if (token) {
      obtenerPerfil();
    }
  }, [token]);

  if (!usuario) return <p>Cargando usuario...</p>;

  return (
    <div className="musuario-container">
      <div className="musuario-card">
        <img
          src={usuario.avatar || "/default-avatar.png"}
          alt="Avatar"
          className="musuario-avatar"
        />
        <h2>{usuario.nombre} {usuario.apellido}</h2>
        <p>Rol: {usuario.rol.charAt(0).toUpperCase() + usuario.rol.slice(1)}</p>
        <p>Email: {usuario.correoInstitucional}</p>
        <p>Teléfono: {usuario.telefono || "No proporcionado"}</p>
        <p>Dirección: {usuario.direccion || "No proporcionada"}</p>
      </div>
    </div>
  );
};

export default MUsuario;
