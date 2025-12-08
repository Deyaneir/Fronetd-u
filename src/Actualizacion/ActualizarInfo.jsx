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

  /* ================================
     AVATARES KAWAII (DICEBEAR)
     ================================ */
  const AVATAR_COUNT = 40;

 const avatarOptions = Array.from({ length: AVATAR_COUNT }, (_, i) => {
  const seed = `kawaii_${i + 1}`;
  return `https://api.dicebear.com/7.x/adventurer/png?seed=${seed}&size=200`;
});


  /* ================================
     CARGAR PERFIL
     ================================ */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/usuarios/perfil`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const u = res.data.usuario || res.data;

        setUserName(u.nombre || "");
        setAvatar(u.avatar || null);
        setUserPhone(u.telefono || "");
        setUserAddress(u.direccion || "");
        setUserCedula(u.cedula || "");
        setUserDescription(u.descripcion || "");
        setUserUniversity(u.universidad || "");
        setUserCareer(u.carrera || "");
      })
      .catch(() => toast.error("Error al cargar perfil"));
  }, []);

  /* ================================
     SUBIR FOTO
     ================================ */
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
    if (!blob) return;

    const formData = new FormData();
    formData.append("file", blob);
    formData.append("upload_preset", "VIBE-U");

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

  /* ================================
     SELECCIONAR AVATAR
     ================================ */
  const selectAvatar = (url) => {
    setAvatar(url);
    setAvatarModalOpen(false);
  };

  /* ================================
     GUARDAR
     ================================ */
  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/usuarios/actualizar`,
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
    } catch {
      toast.error("Error al guardar");
    }
  };

  return (
    <div className="actualizar-container">
      <ToastContainer />

      <h2 className="titulo">Actualizar información</h2>

      {/* AVATAR */}
      <div className="avatar-wrapper">
        <div className="avatar-circle" onClick={handleFileClick}>
          {avatar ? <img src={avatar} alt="avatar" /> : <span>👤</span>}
        </div>

        <div className="btns-avatar">
          <button className="btn-avatar" onClick={handleFileClick}>
            Subir foto
          </button>
          <button
            className="btn-avatar"
            onClick={() => setAvatarModalOpen(true)}
          >
            Elegir avatar
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          className="input-file-hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>

      {/* MODAL AVATARES */}
      {avatarModalOpen && (
        <div className="avatar-modal-overlay">
          <div className="avatar-modal-content">
            <h3>Selecciona un avatar kawaii</h3>

            <div className="avatar-modal">
              {avatarOptions.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  className="avatar-option"
                  onClick={() => selectAvatar(url)}
                />
              ))}
            </div>

            <button
              className="btn-avatar"
              onClick={() => setAvatarModalOpen(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* CROP */}
      {cropperModalOpen && imageToCrop && (
        <AvatarCropperModal
          imageSrc={imageToCrop}
          open={cropperModalOpen}
          onClose={() => setCropperModalOpen(false)}
          onCropComplete={handleCroppedAvatar}
        />
      )}

      {/* FORM */}
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
