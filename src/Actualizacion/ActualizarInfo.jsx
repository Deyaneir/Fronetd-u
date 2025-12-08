import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ActualizarInfo.css";

import AvatarCropperModal from "../components/Avatar/AvatarCropperModal.jsx";

const ActualizarInfo = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [avatar, setAvatar] = useState(null);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [cropperModalOpen, setCropperModalOpen] = useState(false);

  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [userCedula, setUserCedula] = useState("");
  const [userDescription, setUserDescription] = useState("");
  const [userUniversity, setUserUniversity] = useState("");
  const [userCareer, setUserCareer] = useState("");

  /* =====================================================
     AVATARES KAWAII (CANTIDAD ILIMITADA)
     👉 SOLO cambia AVATAR_COUNT si quieres más
     ===================================================== */
  const AVATAR_COUNT = 200; // 🔥 200, 500, 1000… lo que quieras

  const avatarOptions = Array.from({ length: AVATAR_COUNT }, (_, i) => {
    const seed = `avatar_${i + 1}`;
    return `https://api.dicebear.com/6.x/bottts/svg?seed=${seed}`;
  });

  /* =====================================================
     CARGAR PERFIL (AVATAR FIJO)
     ===================================================== */
  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/perfil`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setUserName(res.data.nombre || "");
        setAvatar(res.data.avatar || null);
        setUserPhone(res.data.telefono || "");
        setUserAddress(res.data.direccion || "");
        setUserCedula(res.data.cedula || "");
        setUserDescription(res.data.descripcion || "");
        setUserUniversity(res.data.universidad || "");
        setUserCareer(res.data.carrera || "");
      } catch (err) {
        console.error("Error perfil:", err);
      }
    };

    fetchUserInfo();
  }, []);

  /* =====================================================
     FOTO PROPIA (CROP)
     ===================================================== */
  const handleFileClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImageToCrop(reader.result);
      setCropperModalOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCroppedAvatar = async (blob) => {
    setCropperModalOpen(false);
    setImageToCrop(null);
    if (!blob) return;

    const formData = new FormData();
    formData.append("file", blob);
    formData.append("upload_preset", "VIBE-U");
    formData.append("folder", "usuarios/avatars");

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dm5yhmz9a/image/upload",
        formData
      );
      setAvatar(res.data.secure_url);
      toast.success("Avatar actualizado ✅");
    } catch {
      toast.error("Error al subir avatar");
    }
  };

  /* =====================================================
     AVATAR DICEBEAR → CLOUDINARY (FIJO ✅)
     ===================================================== */
  const selectAvatar = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append("file", blob);
      formData.append("upload_preset", "VIBE-U");
      formData.append("folder", "usuarios/avatars-dicebear");

      const cloud = await axios.post(
        "https://api.cloudinary.com/v1_1/dm5yhmz9a/image/upload",
        formData
      );

      setAvatar(cloud.data.secure_url);
      setAvatarModalOpen(false);
      toast.success("Avatar seleccionado ✅");
    } catch (err) {
      console.error(err);
      toast.error("Error al seleccionar avatar");
    }
  };

  /* =====================================================
     GUARDAR INFO (SIN ERRORES)
     ===================================================== */
  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/actualizar`,
        {
          nombre: userName,
          telefono: userPhone,
          direccion: userAddress,
          cedula: userCedula,
          descripcion: userDescription,
          universidad: userUniversity,
          carrera: userCareer,
          avatar,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Información actualizada ✅");
      setTimeout(() => navigate("/ajustes"), 1200);
    } catch (err) {
      console.error(err);
      toast.error("Error al guardar");
    }
  };

  /* =====================================================
     JSX (TODO INTACTO)
     ===================================================== */
  return (
    <div className="actualizar-container">
      <ToastContainer />

      <h2 className="titulo">Actualizar información de cuenta</h2>

      <div className="avatar-wrapper">
        <div className="avatar-circle" onClick={handleFileClick}>
          {avatar ? (
            <img src={avatar} alt="Avatar" className="avatar-img-preview" />
          ) : (
            <span className="default-avatar">👤</span>
          )}
        </div>

        <div className="btns-avatar">
          <button className="btn-upload" onClick={handleFileClick}>
            Subir foto
          </button>
          <button
            className="btn-select"
            onClick={() => setAvatarModalOpen(true)}
          >
            Elegir avatar
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          hidden
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>

      {/* MODAL AVATARES */}
      {avatarModalOpen && (
        <div className="avatar-modal-overlay">
          <div className="avatar-modal-content">
            <h3 className="modal-title">Seleccionar Avatar</h3>

            <div className="avatar-options-grid">
              {avatarOptions.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  className="avatar-option"
                  alt={`avatar-${i}`}
                  onClick={() => selectAvatar(url)}
                />
              ))}
            </div>

            <button
              className="modal-close-btn"
              onClick={() => setAvatarModalOpen(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* MODAL CROP */}
      {cropperModalOpen && imageToCrop && (
        <AvatarCropperModal
          imageSrc={imageToCrop}
          open={cropperModalOpen}
          onClose={() => setCropperModalOpen(false)}
          onCropComplete={handleCroppedAvatar}
        />
      )}

      {/* FORMULARIO (INTOCABLE ✅) */}
      <div className="form-section">
        {[
          ["Usuario", userName, setUserName],
          ["Teléfono", userPhone, setUserPhone],
          ["Dirección", userAddress, setUserAddress],
          ["Cédula", userCedula, setUserCedula],
          ["Universidad", userUniversity, setUserUniversity],
          ["Carrera", userCareer, setUserCareer],
        ].map(([label, value, setter], i) => (
          <div className="field-row" key={i}>
            <label className="field-label">{label}</label>
            <input
              className="field-input"
              value={value}
              onChange={(e) => setter(e.target.value)}
            />
          </div>
        ))}

        <div className="field-row">
          <label className="field-label">Descripción</label>
          <textarea
            className="field-input textarea-input"
            value={userDescription}
            onChange={(e) => setUserDescription(e.target.value)}
          />
        </div>

        <div className="btn-row">
          <button className="cancel-btn" onClick={() => navigate("/ajustes")}>
            Cancelar
          </button>
          <button className="save-btn" onClick={handleUpdate}>
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActualizarInfo;
