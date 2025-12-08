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

  /* ================= AVATARES KAWAII ================= */
  const AVATAR_COUNT = 80;
  const avatarOptions = Array.from({ length: AVATAR_COUNT }, (_, i) => {
    const seed = `kawaii_${i + 1}`;
    return `https://api.dicebear.com/7.x/adventurer/png?seed=${seed}&size=200`;
  });

  /* ================= PERFIL ================= */
  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/usuarios/perfil`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const u = res.data.usuario || res.data;

        setUserName(u.nombre || "");
        setAvatar(u.avatar || null);
        setUserPhone(u.telefono || "");
        setUserAddress(u.direccion || "");
        setUserCedula(u.cedula || "");
        setUserDescription(u.descripcion || "");
        setUserUniversity(u.universidad || "");
        setUserCareer(u.carrera || "");
      } catch (err) {
        console.error(err);
      }
    };

    fetchUserInfo();
  }, []);

  /* ================= SUBIR FOTO ================= */
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
    formData.append("folder", "usuarios/avatars");

    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dm5yhmz9a/image/upload",
      formData
    );

    setAvatar(res.data.secure_url);
    toast.success("Avatar actualizado ✅");
  };

  /* ================= AVATAR SELECCIONADO → CLOUDINARY ================= */
  const selectAvatar = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append("file", blob);
      formData.append("upload_preset", "VIBE-U");
      formData.append("folder", "usuarios/avatars");

      const cloud = await axios.post(
        "https://api.cloudinary.com/v1_1/dm5yhmz9a/image/upload",
        formData
      );

      setAvatar(cloud.data.secure_url);
      setAvatarModalOpen(false);
      toast.success("Avatar seleccionado ✅");
    } catch {
      toast.error("Error al seleccionar avatar");
    }
  };

  /* ================= GUARDAR ================= */
  const handleUpdate = async () => {
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
  };

  return (
    <div className="actualizar-container">
      <ToastContainer />

      <h2 className="titulo">Actualizar información</h2>

      <div className="avatar-wrapper">
        <div className="avatar-circle">
          {avatar ? <img src={avatar} /> : <span>👤</span>}
        </div>

        <div className="btns-avatar">
          <button className="btn-avatar" onClick={handleFileClick}>
            Subir foto
          </button>
          <button className="btn-avatar" onClick={() => setAvatarModalOpen(true)}>
            Elegir avatar
          </button>
        </div>

        <input ref={fileInputRef} type="file" hidden onChange={handleFileChange} />
      </div>

      {avatarModalOpen && (
        <div className="avatar-modal">
          {avatarOptions.map((url, i) => (
            <img key={i} src={url} className="avatar-option" onClick={() => selectAvatar(url)} />
          ))}
          <button onClick={() => setAvatarModalOpen(false)}>Cerrar</button>
        </div>
      )}

      <div className="form-section">
        {[
          ["Usuario", userName, setUserName],
          ["Teléfono", userPhone, setUserPhone],
          ["Dirección", userAddress, setUserAddress],
          ["Cédula", userCedula, setUserCedula],
          ["Universidad", userUniversity, setUserUniversity],
          ["Carrera", userCareer, setUserCareer],
        ].map(([l, v, s], i) => (
          <div key={i}>
            <label>{l}</label>
            <input value={v} onChange={(e) => s(e.target.value)} />
          </div>
        ))}

        <label>Descripción</label>
        <textarea value={userDescription} onChange={(e) => setUserDescription(e.target.value)} />

        <button onClick={handleUpdate}>Guardar cambios</button>
      </div>
    </div>
  );
};

export default ActualizarInfo;
