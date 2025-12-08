import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import storeAuth from "../../context/storeAuth";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./Ajustes.css";

const avatarOptions = [
    "https://api.dicebear.com/6.x/bottts/svg?seed=Avatar1",
    "https://api.dicebear.com/6.x/bottts/svg?seed=Avatar2",
    "https://api.dicebear.com/6.x/bottts/svg?seed=Avatar3",
    "https://api.dicebear.com/6.x/bottts/svg?seed=Avatar4",
    "https://api.dicebear.com/6.x/bottts/svg?seed=Avatar5",
    "https://api.dicebear.com/6.x/bottts/svg?seed=Robot",
    "https://api.dicebear.com/6.x/bottts/svg?seed=Dragon",
    "https://api.dicebear.com/6.x/bottts/svg?seed=Star",
];

const Ajustes = () => {
    const [notificaciones, setNotificaciones] = useState(true);
    const [tema, setTema] = useState("light");
    const [idioma, setIdioma] = useState("es");
    const [menuOpen, setMenuOpen] = useState(false);
    const [avatar, setAvatar] = useState(null);
    const [avatarModalOpen, setAvatarModalOpen] = useState(false); // 🔑 Nuevo estado para la modal

    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    // Función auxiliar para forzar la recarga del avatar y evitar caché
    const getAvatarUrl = (url) => {
        if (!url) return null;
        // Añadir timestamp para evitar caché
        return `${url}?t=${new Date().getTime()}`; 
    };

    // 🔹 Cargar avatar
    useEffect(() => {
        const fetchAvatar = async () => {
            try {
                const token = storeAuth.getState().token;
                if (!token || !import.meta.env.VITE_BACKEND_URL) return;

                const res = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/perfil`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                if (res.data?.avatar) setAvatar(res.data.avatar);
            } catch (error) {
                console.error("Error al obtener avatar:", error);
            }
        };

        fetchAvatar();
    }, []);

    // 🔑 Función para actualizar el avatar seleccionado en el backend
    const handleAvatarSelect = async (selectedAvatarUrl) => {
        const token = storeAuth.getState().token;
        if (!token) {
            toast.error("Sesión expirada. Por favor, inicia sesión.");
            return;
        }

        try {
            await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/actualizar`,
                { avatar: selectedAvatarUrl },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // 1. Actualiza el estado local con la nueva URL
            setAvatar(selectedAvatarUrl);
            
            // 2. Cierra la modal
            setAvatarModalOpen(false);

            toast.success("Avatar actualizado correctamente.", { autoClose: 2000 });

        } catch (error) {
            console.error("Error al actualizar el avatar:", error);
            toast.error("Error al guardar el nuevo avatar.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };
    
    // 🔑 Manejar clic en el avatar para abrir la modal
    const handleAvatarClick = () => {
        setAvatarModalOpen(true);
    };


    return (
        <section className="ajustes-section">
            <ToastContainer />

            {/* BOTÓN HAMBURGUESA */}
            <button
                className={`hamburger-btn ${menuOpen ? "open" : ""}`}
                onClick={() => setMenuOpen(!menuOpen)}
            >
                <span></span>
                <span></span>
                <span></span>
            </button>

            {/* MENÚ LATERAL */}
            <nav className={`side-menu ${menuOpen ? "show" : ""}`}>
                <div className="menu-header">
                    <h3 className="menu-title">Menú</h3>

                    {/* 🔑 Avatar con funcionalidad de clic */}
                    <div className="avatar-section">
                        <div className="avatar-container" onClick={handleAvatarClick}>
                            {avatar ? (
                                <img src={getAvatarUrl(avatar)} alt="Avatar" className="avatar-img" />
                            ) : (
                                <span className="default-avatar">👤</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="menu-buttons">
                    <button onClick={() => navigate("/dashboard")}>Inicio</button>
                    <button onClick={() => navigate("/MUsuario")}>Mi cuenta</button>
                    <button onClick={() => navigate("/matches")}>Favoritos</button>
                    <button onClick={() => navigate("/ajustes")}>Ajustes</button>
                    <button onClick={handleLogout}>Cerrar sesión</button>
                </div>
            </nav>
            {/* Overlay para cerrar el menú lateral */}
            <div className={`menu-overlay ${menuOpen ? "show" : ""}`} onClick={() => setMenuOpen(false)}></div>


            {/* TÍTULO Y CONTENIDO PRINCIPAL */}
            <h2 className="ajustes-title">Ajustes</h2>

            <div className="ajustes-container">
                {/* CUENTA */}
                <div className="ajustes-card">
                    <h3>Cuenta</h3>
                    {/* ... Resto de la tarjeta de Cuenta ... */}
                </div>

                {/* PERSONALIZACIÓN */}
                <div className="ajustes-card">
                    <h3>Personalización</h3>
                    {/* ... Resto de la tarjeta de Personalización ... */}
                </div>

                {/* SESIÓN */}
                <div className="ajustes-card">
                    <h3>Sesión</h3>
                    {/* ... Resto de la tarjeta de Sesión ... */}
                </div>
            </div>

            {/* 🔑 MODAL DE SELECCIÓN DE AVATAR */}
            {avatarModalOpen && (
                <div className="modal-overlay" onClick={() => setAvatarModalOpen(false)}>
                    <div className="avatar-modal" onClick={(e) => e.stopPropagation()}>
                        <h3>Seleccionar Avatar</h3>
                        <p>Elige una imagen para tu perfil.</p>
                        <div className="avatar-grid">
                            {avatarOptions.map((url, index) => (
                                <div 
                                    key={index}
                                    className="avatar-option"
                                    onClick={() => handleAvatarSelect(url)}
                                >
                                    <img src={url} alt={`Avatar ${index + 1}`} />
                                    {/* Opcional: Marcar el avatar actualmente seleccionado */}
                                    {avatar === url && <span className="selected-check">✓</span>}
                                </div>
                            ))}
                        </div>
                        <button 
                            className="close-modal-btn" 
                            onClick={() => setAvatarModalOpen(false)}
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Ajustes;
