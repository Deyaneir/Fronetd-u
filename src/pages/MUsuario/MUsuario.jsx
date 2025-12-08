// MUsuario.jsx
import React, { useEffect, useState } from "react";
import storeAuth from "../../context/storeAuth";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./MUsuario.css";

const MUsuario = () => {
  const [usuario, setUsuario] = useState(null);
  const token = storeAuth((state) => state.token);

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const res = await axios.get(`https://unlikely-marji-vibe-u-56bc48e6.koyeb.app/usuarios/perfil`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsuario(res.data);
      } catch (error) {
        console.error("Error al obtener perfil:", error);
        toast.error("No se pudo cargar el perfil");
      }
    };

    fetchPerfil();
  }, [token]);

  if (!usuario) return <div>Cargando usuario...</div>;

  return (
    <div className="musuario-container">
      <div className="avatar-section">
        <img
          src={usuario.avatar || "/default-avatar.png"}
          alt="Avatar de usuario"
          className="avatar-img"
          style={{
            cursor: "default", // no clickeable
            pointerEvents: "none", // desactiva hover/interacción
          }}
        />
      </div>

      <div className="info-section">
        <p><strong>Nombre:</strong> {usuario.nombre}</p>
        <p><strong>Apellido:</strong> {usuario.apellido}</p>
        <p><strong>Correo:</strong> {usuario.correoInstitucional}</p>
        <p><strong>Rol:</strong> {usuario.rol.charAt(0).toUpperCase() + usuario.rol.slice(1)}</p>
        <p><strong>Teléfono:</strong> {usuario.telefono || "No registrado"}</p>
        <p><strong>Dirección:</strong> {usuario.direccion || "No registrada"}</p>
        <p><strong>Cédula:</strong> {usuario.cedula || "No registrada"}</p>
        <p><strong>Descripción:</strong> {usuario.descripcion || "No registrada"}</p>
        <p><strong>Universidad:</strong> {usuario.universidad || "No registrada"}</p>
        <p><strong>Carrera:</strong> {usuario.carrera || "No registrada"}</p>
      </div>

      <ToastContainer position="top-right" autoClose={4000} />
    </div>
  );
};

export default MUsuario;
