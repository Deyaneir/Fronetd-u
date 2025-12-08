import { useEffect } from "react";
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Necesitas axios
import storeAuth from "../../context/storeAuth"; // Necesitas storeAuth
import "./Ajustes.css";

const Ajustes = () => {
  const [notificaciones, setNotificaciones] = useState(true);
  const [tema, setTema] = useState("claro");
  const [usuario, setUsuario] = useState({
    nombre: "",
    correo: "",
    avatar: "",
  });

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // =============================
  // TRAER DATOS USUARIO
  // =============================
  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/perfil`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUsuario(res.data);
      } catch (error) {
        console.error("Error al obtener usuario:", error);
      }
    };

    fetchUsuario();
  }, []);

  // =============================
  // SUBIR AVATAR
  // =============================
  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "VIBE-U");

    try {
      const resCloudinary = await axios.post(
        "https://api.cloudinary.com/v1_1/dm5yhmz9a/image/upload",
        formData
      );

      const avatarUrl = resCloudinary.data.secure_url;

      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/actualizar`,
        { avatar: avatarUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsuario({ ...usuario, avatar: avatarUrl });
    } catch (error) {
      console.error("Error al subir avatar:", error);
    }
  };

  return (
    <div className="ajustes-container">
      <div className="ajustes-card">
        <h2>Ajustes</h2>

        <div className="avatar-section">
          <div className="avatar-container" onClick={handleAvatarClick}>
            {usuario.avatar ? (
              <img src={usuario.avatar} alt="Avatar" />
            ) : (
              <div className="default-avatar">👤</div>
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>

        <div className="user-info">
          <p>
            <strong>Nombre:</strong> {usuario.nombre}
          </p>
          <p>
            <strong>Correo:</strong> {usuario.correo}
          </p>
        </div>

        <button onClick={() => navigate("/dashboard")}>
          Volver al Dashboard
        </button>
      </div>
    </div>
  );
};

export default Ajustes;
