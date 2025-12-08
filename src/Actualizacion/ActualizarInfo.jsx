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

  const [avatar, setAvatar] = useState(null); // Avatar actual del perfil
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState(null); // 🔑 URL temporal de avatar preseleccionado
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

  // ---------- AVATARES KAWAIIS (DiceBear Adventurer/Micah) ----------
  const AVATAR_COUNT = 12; 
  const generateAvatars = () => {
    const styles = ["adventurer", "micah"];
    const seeds = ["Aura", "Kiko", "Leo", "Panda", "Luna", "Star", "Bob", "Ivy", "Felix", "Nina", "Ryu", "Toby"];

    return Array.from({ length: AVATAR_COUNT }, (_, i) => {
      const style = styles[i % 2]; 
      const seed = seeds[i]; 
      return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`;
    });
  };
  const avatarOptions = generateAvatars();

  // Función para obtener la URL del avatar evitando la caché
  const getAvatarUrl = (url) => {
    if (!url) return null;
    return `${url}`; 
  };


  // ---------- CARGAR INFO DEL USUARIO ----------
  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/perfil`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Inicializa los estados
        setUserName(res.data.nombre || "");
        setAvatar(res.data.avatar || null); 
        setUserPhone(res.data.telefono || "");
        setUserAddress(res.data.direccion || "");
        setUserCedula(res.data.cedula || "");
        setUserDescription(res.data.descripcion || "");
        setUserUniversity(res.data.universidad || "");
        setUserCareer(res.data.carrera || "");
        
        // Inicializa el estado temporal con el avatar actual
        setSelectedAvatarUrl(res.data.avatar || null); 

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
      setAvatarModalOpen(false); // Asegúrate de cerrar la modal de selección si está abierta
    };
    reader.readAsDataURL(file);
  };

  // ---------- SUBIR AVATAR CORTADO A CLOUDINARY ----------
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
      
      // 🔑 Al subir una foto, se actualiza el avatar principal y el temporal
      setAvatar(res.data.secure_url);
      setSelectedAvatarUrl(res.data.secure_url); 
      
      toast.success("Avatar actualizado ✅");
    } catch (err) {
      console.error("Cloudinary:", err.response?.data || err);
      toast.error("Error al subir avatar");
    }
  };
  
  // 🔑 Función para aplicar el avatar seleccionado (Solo se llama al guardar)
  const applySelectedAvatar = () => {
    // Si se seleccionó un avatar predefinido, lo establecemos como el avatar final
    if (selectedAvatarUrl && selectedAvatarUrl !== avatar) {
      setAvatar(selectedAvatarUrl);
    }
    setAvatarModalOpen(false);
  };
  
  // 🔑 Función para cerrar la modal y descartar la preselección si no se guarda
  const closeAvatarModal = () => {
    // Restaurar el avatar temporal al valor actual del avatar si se cancela
    setSelectedAvatarUrl(avatar);
    setAvatarModalOpen(false);
  };


  // ---------- ACTUALIZAR INFO EN BACKEND ----------
  const handleUpdate = async () => {
    const token = localStorage.getItem("token");

    // 🔑 Aplicar el avatar seleccionado *antes* de enviar la petición
    // Esto es crucial para que el avatar que se envía sea el elegido en la modal
    let finalAvatar = avatar;
    if (selectedAvatarUrl !== avatar) {
        finalAvatar = selectedAvatarUrl;
        setAvatar(finalAvatar); // Actualiza el estado principal
    }
    
    try {
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
          avatar: finalAvatar, // Envía el avatar final (subido o seleccionado)
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
          {/* Muestra el avatar temporal si la modal está abierta, si no, muestra el avatar principal */}
          <img 
            src={getAvatarUrl(avatar)} 
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

      {/* ---------- MODAL DE AVATARES KAWAIIS ---------- */}
      {avatarModalOpen && (
        <div className="avatar-modal-overlay">
          <div className="avatar-modal-content">
            <h3 className="modal-title">Seleccionar Avatar Kawaii</h3>
            <p>Elige una opción y presiona 'Aplicar' para verla en el formulario.</p>
            
            <div className="avatar-options-grid">
              {avatarOptions.map((url, i) => (
                <div 
                    key={i}
                    className={`avatar-option ${selectedAvatarUrl === url ? 'selected' : ''}`}
                    onClick={() => setSelectedAvatarUrl(url)} // 🔑 Solo actualiza el estado temporal
                >
                    <img
                        src={url}
                        alt={`kawaii-avatar-${i}`}
                    />
                    {selectedAvatarUrl === url && <span className="selected-check">✓</span>}
                </div>
              ))}
            </div>
            
            <div className="modal-btns-row">
                <button
                    className="modal-apply-btn"
                    onClick={applySelectedAvatar} // 🔑 Aplica la selección al estado principal
                >
                    Aplicar
                </button>
                <button
                    className="modal-close-btn"
                    onClick={closeAvatarModal} // 🔑 Cierra y descarta la preselección
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
