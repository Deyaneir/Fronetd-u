import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Ajustes.css";

const Ajustes = () => {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState({
    nombre: "",
    correo: "",
    avatar: "",
  });

  // =============================
  // TRAER DATOS DEL USUARIO
  // =============================
  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/usuarios/perfil`,
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

  return (
    <div className="ajustes-container">
      <div className="ajustes-card">
        <h2>Ajustes</h2>

        {/* ✅ AVATAR SOLO VISUAL (NO CLICK, NO UPLOAD) */}
        <div className="avatar-section">
          <div className="avatar-container no-click">
            {usuario.avatar ? (
              <img src={usuario.avatar} alt="Avatar" />
            ) : (
              <div className="default-avatar">👤</div>
            )}
          </div>
        </div>

        <div className="user-info">
          <p>
            <strong>Nombre:</strong> {usuario.nombre}
          </p>
          <p>
            <strong>Correo:</strong> {usuario.correo}
          </p>
        </div>

        <button className="volver-btn" onClick={() => navigate("/dashboard")}>
          Volver al Dashboard
        </button>
      </div>
    </div>
  );
};

export default Ajustes;
