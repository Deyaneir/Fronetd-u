import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import storeAuth from "../../context/storeAuth";
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({ nombre: "Usuario", rol: "", avatar: null });
    const [isLoading, setIsLoading] = useState(true);
    const [quote, setQuote] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);

    const fileInputRef = useRef(null);

    // 🚀 Logout
    const handleLogout = () => {
        localStorage.clear();
        storeAuth.getState().clearToken();
        navigate("/login");
    };

    // 📌 Cargar usuario + avatar + frase motivadora
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const token = storeAuth.getState().token;
                if (!token) return setIsLoading(false);

                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/perfil`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setUser({
                    nombre: res.data.nombre || "Usuario",
                    rol: res.data.rol || "",
                    avatar: res.data.avatar || null
                });

            } catch (err) {
                console.error("Error al cargar usuario:", err.response?.data || err);
            } finally {
                setIsLoading(false);
            }
        };

        const fetchQuote = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/frase`);
                const quoteData = res.data[0];
                if (quoteData?.q && quoteData?.a) {
                    setQuote({ texto: quoteData.q, autor: quoteData.a });
                }
            } catch (err) {
                console.error("Error al cargar frase:", err.response?.data || err);
            }
        };

        fetchUserInfo();
        fetchQuote();

        // Toast solo al iniciar sesión
        const token = storeAuth.getState().token;
        if (token && !localStorage.getItem("loginToastShown")) {
            localStorage.setItem("loginToastShown", "true");
            setTimeout(() => {
                toast.success("Inicio de sesión exitoso 🎉", { position: "top-right", autoClose: 2000 });
            }, 0);
        }
    }, []);

    // 📸 Cambiar avatar
    const handleFileClick = () => fileInputRef.current.click();

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "VIBE-U");
        formData.append("folder", "avatars");

        try {
            const resCloud = await axios.post("https://api.cloudinary.com/v1_1/dm5yhmz9a/image/upload", formData);
            const newAvatar = resCloud.data.secure_url;

            setUser(prev => ({ ...prev, avatar: newAvatar }));

            // Guardar en backend
            const token = storeAuth.getState().token;
            await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/actualizar`,
                { avatar: newAvatar },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success("Avatar actualizado correctamente ✅");

        } catch (err) {
            console.error("Error al subir o guardar avatar:", err.response?.data || err);
            toast.error("Error al actualizar el avatar ❌");
        }
    };

    return (
        <section className="dashboard-section">
            <ToastContainer />

            {/* BOTÓN HAMBURGUESA */}
            <button className={`hamburger-btn ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(!menuOpen)}>
                <span></span>
                <span></span>
                <span></span>
            </button>

            {/* MENÚ LATERAL */}
            <nav className={`side-menu ${menuOpen ? "show" : ""}`}>
                <div className="menu-header">
                    <h3 className="menu-title">Menú</h3>
                    <div className="avatar-section">
                        <div className="avatar-container" onClick={handleFileClick}>
                            {user.avatar ? (
                                <img src={user.avatar} alt="Avatar" className="avatar-img" />
                            ) : (
                                <span className="default-avatar">👤</span>
                            )}
                            <div className="avatar-overlay"><i className="fa fa-camera"></i></div>
                        </div>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="input-file-hidden" accept="image/*" />
                    </div>
                </div>
                <div className="menu-buttons">
                    <button onClick={() => navigate("/Dashboard")}>Inicio</button>
                    <button onClick={() => navigate("/MUsuario")}>Mi cuenta</button>
                    <button onClick={() => { }}>Favoritos</button>
                    <button onClick={() => navigate("/Ajustes")}>Ajustes</button>
                    <button onClick={handleLogout}>Cerrar sesión</button>
                </div>
            </nav>

            {/* OVERLAY */}
            <div className={`menu-overlay ${menuOpen ? "show" : ""}`} onClick={() => setMenuOpen(false)}></div>

            {/* CONTENIDO PRINCIPAL */}
            <div className="dashboard-header">
                {isLoading ? <h2>Cargando...</h2> : <h2>¡Bienvenido de nuevo, {user.nombre}!</h2>}
                <p>Explora lo mejor de tu comunidad universitaria.</p>

                {quote && (
                    <div className="motivational-quote">
                        <p className="quote-text">"{quote.texto}"</p>
                        <p className="quote-author">- {quote.autor}</p>
                    </div>
                )}
            </div>

            {/* TARJETAS */}
            <div className="dashboard-grid">
                <div className="dashboard-card events-card">
                    <h3 className="card-title">Eventos en tu U 🎉</h3>
                    <p>Descubre próximos eventos en tu campus.</p>
                    <button className="dashboard-btn">Ver Eventos</button>
                </div>
                <div className="dashboard-card groups-card">
                    <h3 className="card-title">Grupos y Comunidades 🤝</h3>
                    <p>Únete a clubes con tus mismos intereses.</p>
                    <button className="dashboard-btn">Explorar Grupos</button>
                </div>
                <div className="dashboard-card matches-card">
                    <h3 className="card-title">Tus Posibles Matches 💖</h3>
                    <p>Conecta con estudiantes que comparten tu vibe.</p>
                    <button className="dashboard-btn" onClick={() => navigate("/matches")}>Ver Matches</button>
                </div>
            </div>
        </section>
    );
};

export default Dashboard;
