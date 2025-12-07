import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import storeAuth from "../../context/storeAuth";
import './ActualizarPass.css';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const ChangePasswordForm = () => {
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [username, setUsername] = useState('Usuario');
  const [avatarUrl, setAvatarUrl] = useState(
    'https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg'
  );

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 🔹 Traer datos del usuario con manejo de errores más claro
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = storeAuth.getState().token;
        if (!token) return;

        const url = `${import.meta.env.VITE_BACKEND_URL}/perfil`;
        console.log("Intentando cargar usuario desde URL:", url);

        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setUsername(res.data?.nombre || "Usuario");
        setAvatarUrl(
          res.data?.avatar ||
          "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg"
        );

      } catch (error) {
        if (error.response) {
          console.error(
            "Error al cargar usuario:",
            "Status:", error.response.status,
            "Data:", error.response.data
          );
        } else if (error.request) {
          console.error("No hubo respuesta del servidor:", error.request);
        } else {
          console.error("Error inesperado:", error.message);
        }
      }
    };
    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      toast.error("Las contraseñas nuevas no coinciden");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Usuario no autorizado");
        return;
      }

      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/actualizar/password`,
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(res.data.msg || "Contraseña actualizada correctamente");

      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");

      setTimeout(() => {
        navigate("/ajustes");
      }, 1500);

    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.msg || "Error al actualizar la contraseña");
    }
  };

  const handleCancel = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    navigate("/ajustes");
  };

  // 🔹 Ojo kawaii
  const KawaiiEye = ({ isOpen }) => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke={isOpen ? "#ff77ff" : "#aaa"}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {isOpen ? (
        <>
          <ellipse cx="12" cy="12" rx="7" ry="4" fill="#ffccff" />
          <circle cx="12" cy="12" r="2.5" fill="#ff77ff" />
          <circle cx="13.5" cy="10.5" r="0.5" fill="white" />
        </>
      ) : (
        <>
          <path d="M2 12c2.5 3 11.5 3 14 0" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </>
      )}
    </svg>
  );

  return (
    <div className="password-change-container">
      <ToastContainer />

      <div className="password-change-card">
        <div
          style={{ cursor: 'pointer', textAlign: 'left', marginBottom: '15px' }}
          onClick={() => navigate("/ajustes")}
        >
          ← Volver a Ajustes
        </div>

        <h2 className="main-username-title">{username}</h2>

        <div className="icon-circle">
          <img
            src={avatarUrl}
            alt="Avatar de usuario"
            className="user-avatar-image"
          />
        </div>

        <h2 className="title">Cambiar contraseña</h2>

        <form onSubmit={handleSubmit} className="form-content">

          <div className="input-with-eye">
            <input
              type={showOldPassword ? 'text' : 'password'}
              className="input-field"
              placeholder="Contraseña anterior"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
            <span
              className="eye-icon"
              onClick={() => setShowOldPassword(!showOldPassword)}
            >
              <KawaiiEye isOpen={showOldPassword} />
            </span>
          </div>

          <div className="input-with-eye">
            <input
              type={showNewPassword ? 'text' : 'password'}
              className="input-field"
              placeholder="Contraseña nueva"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <span
              className="eye-icon"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              <KawaiiEye isOpen={showNewPassword} />
            </span>
          </div>

          <div className="input-with-eye">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              className="input-field"
              placeholder="Confirmar contraseña nueva"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
            />
            <span
              className="eye-icon"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <KawaiiEye isOpen={showConfirmPassword} />
            </span>
          </div>

          <div className="btn-row">
            <button
              type="button"
              className="cancel-btn"
              onClick={handleCancel}
            >
              Cancelar
            </button>

            <button type="submit" className="save-btn">
              Cambiar Contraseña
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ChangePasswordForm;
