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

  const [avatar, setAvatar] = useState(null); // Avatar principal (URL fijo)
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState(null); // Avatar temporal
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

  // ---------- AVATARES KAWAIIS FIJOS ----------
  const AVATAR_COUNT = 12; 
  const generateAvatars = () => {
    const styles = ["adventurer", "micah"];
    const seeds = ["Aura", "Kiko", "Leo", "Panda", "Luna", "Star", "Bob", "Ivy", "Felix", "Nina", "Ryu", "Toby"];
    return Array.from({ length: AVATAR_COUNT }, (_, i) => {
      const style = styles[i % 2]; 
      const seed = seeds[i]; 
      // La URL generada SIEMPRE lleva el ?seed= para ser fija.
      return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`;
    });
  };
  const avatarOptions = generateAvatars();

  // ---------- FUNCIÓN DE ARREGLO DE URL 🔑 NUEVA LÓGICA DE FIJACIÓN ----------
  /**
   * Asegura que si la URL de DiceBear no tiene la seed, se le añada una fija (usando el nombre).
   */
  const ensureFixedSeed = (url, name) => {
    if (url && url.includes("dicebear") && !url.includes("?seed=")) {
      // Si es DiceBear pero falta la seed (URL dinámica), la arreglamos con el nombre.
      const defaultStyle = "micah"; 
      const seed = name?.trim() || "default-user";
      return `https://api.dicebear.com/7.x/${defaultStyle}/svg?seed=${seed}`;
    }
    return url; // Devuelve la URL tal cual si ya es Cloudinary, otra API o ya tiene seed.
  };


  // ---------- CARGAR INFO DEL USUARIO (CORREGIDO) ----------
  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        // NOTA: La ruta de perfil en tu router es /perfil, pero aquí usas solo /perfil. 
        // Asumo que tu backend está configurado para la ruta correcta.
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/usuarios/perfil`, // Ajustando a la ruta de tu router
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const userData = res.data;
        
        // 🔑 APLICAR CORRECCIÓN: Arreglar el URL del avatar al cargar
        const fixedAvatar = ensureFixedSeed(userData.avatar, userData.nombre);
        
        setUserName(userData.nombre || "");
        setAvatar(fixedAvatar); // Usar el avatar fijo
        setSelectedAvatarUrl(fixedAvatar); // Usar el avatar fijo para la previsualización
        setUserPhone(userData.telefono || "");
        setUserAddress(userData.direccion || "");
        setUserCedula(userData.cedula || "");
        setUserDescription(userData.descripcion || "");
        setUserUniversity(userData.universidad || "");
        setUserCareer(userData.carrera || "");
      } catch (err) {
        console.error("Error perfil:", err.response?.data || err);
      }
    };

    fetchUserInfo();
  }, []);


  const handleFileClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImageToCrop(reader.result);
      setCropperModalOpen(true);
      setAvatarModalOpen(false);
    };
    reader.readAsDataURL(file);
  };

  // ---------- SUBIR AVATAR CORTADO ----------
  const handleCroppedAvatar = async (croppedImageBlob) => {
    setCropperModalOpen(false);
    setImageToCrop(null);
    if (!croppedImageBlob) return;

    const safeUserName = userName?.trim()
      ? userName.replace(/\s+/g, "_")
      : "usuario_sin_nombre";

    const formData = new FormData();
    formData.append("file", croppedImageBlob);
    formData.append("upload_preset", "VIBE-U");
    formData.append("folder", `usuarios/${safeUserName}`);
    formData.append("public_id", "avatar");

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dm5yhmz9a/image/upload",
        formData
      );
      setAvatar(res.data.secure_url);
      setSelectedAvatarUrl(res.data.secure_url);
      toast.success("Avatar actualizado ✅");
    } catch (err) {
      console.error("Cloudinary:", err.response?.data || err);
      toast.error("Error al subir avatar");
    }
  };

  // ---------- ACTUALIZAR INFO (CORREGIDO) ----------
  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    
    // Esta lógica es correcta si ya se usó "Aplicar" o si se subió una foto
    let finalAvatar = selectedAvatarUrl; 
    
    // NOTA: No necesitamos el if/else aquí si ya confiamos en selectedAvatarUrl, 
    // que es el último estado deseado. El código anterior era un poco redundante.

    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/usuarios/actualizar`, // Ajustando a la ruta de tu router
        {
          nombre: userName,
          telefono: userPhone,
          direccion: userAddress,
          cedula: userCedula,
          descripcion: userDescription,
          universidad: userUniversity,
          carrera: userCareer,
          // 🔑 Enviamos finalAvatar, que ya ha sido arreglado al cargar
          avatar: finalAvatar, 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Información actualizada");
      setTimeout(() => navigate("/ajustes"), 1200);
    } catch (err) {
      console.error("Actualizar:", err.response?.data || err);
      toast.error("Error al guardar");
    }
  };

  return (
    <div className="actualizar-container">
      <ToastContainer />

      <h2 className="titulo">Actualizar información de cuenta</h2>

      {/* ---------- AVATAR ---------- */}
      <div className="avatar-wrapper">
        <div className="avatar-circle" onClick={handleFileClick}>
          <img 
            src={avatar || "https://via.placeholder.com/150"} 
            alt="Avatar" 
            className="avatar-img-preview" 
          />
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
          className="input-file-hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>

      {/* ---------- MINI POP-OVER AVATARES ---------- */}
      {avatarModalOpen && (
        <div className="avatar-popover-overlay">
          <div className="avatar-popover-content">
            <h4 className="popover-title">Seleccionar Avatar Kawaii</h4>
            <div className="avatar-options-grid">
              {avatarOptions.map((url, i) => (
                <div
                  key={i}
                  className={`avatar-option ${selectedAvatarUrl === url ? 'selected' : ''}`}
                  onClick={() => setSelectedAvatarUrl(url)}
                >
                  <img src={url} alt={`avatar-${i}`} />
                  {selectedAvatarUrl === url && <span className="selected-check">✓</span>}
                </div>
              ))}
            </div>
            <div className="popover-btn-row">
              <button
                className="popover-apply-btn"
                onClick={() => {
                  setAvatar(selectedAvatarUrl);
                  setAvatarModalOpen(false);
                  toast.success("Avatar seleccionado ✅");
                }}
              >
                Aplicar
              </button>
              <button
                className="popover-cancel-btn"
                onClick={() => {
                  setSelectedAvatarUrl(avatar);
                  setAvatarModalOpen(false);
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------- MODAL DE CROP ---------- */}
      {cropperModalOpen && imageToCrop && (
        <AvatarCropperModal
          imageSrc={imageToCrop}
          open={cropperModalOpen}
          onClose={() => setCropperModalOpen(false)}
          onCropComplete={handleCroppedAvatar}
        />
      )}

      {/* ---------- FORMULARIO ---------- */}
      <div className="form-section">
        {[
          ["Usuario", userName, setUserName],
          ["Teléfono", userPhone, setUserPhone],
          ["Dirección", userAddress, setUserAddress],
          ["Cédula", userCedula, setUserCedula],
          ["Universidad", userUniversity, setUserUniversity],
          ["Carrera", userCareer, setCareer],
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
