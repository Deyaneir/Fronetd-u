import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './Dashboard.css';
import storeAuth from "../../context/storeAuth";   

const Dashboard = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState("usuario");
    const [userRole, setUserRole] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [quote, setQuote] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [avatar, setAvatar] = useState(null);

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

                const res = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/perfil`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                setUserName(res.data.nombre || "usuario");
                setUserRole(res.data.rol || "");
                setAvatar(res.data.avatar || null);

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
                toast.success("Inicio de sesión exitoso 🎉", {
                    position: "top-right",
                    autoClose: 2000,
                });
            }, 0);
        }
    }, []);

    // 📸 Abrir selector de archivo
    const handleFileClick = () => fileInputRef.current.click();

    // 📸 Vista previa del avatar nuevo
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setAvatar(reader.result);
            reader.readAsDataURL(file);
        }
    };

    return (
        <section className="dashboard-section">
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
                    <div className="avatar-section">
                        <div className="avatar-container" onClick={handleFileClick}>
                            {avatar ? (
                                <img src={avatar} alt="Avatar" className="avatar-img" />
                            ) : (
                                <span className="default-avatar">👤</span>
                            )}
                            <div className="avatar-overlay">
                                <i className="fa fa-camera"></i>
                            </div>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="input-file-hidden"
                            accept="image/*"
                        />
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

            {/* OVERLAY DEL MENÚ */}
            <div
                className={`menu-overlay ${menuOpen ? "show" : ""}`}
                onClick={() => setMenuOpen(false)}
            ></div>

            {/* CONTENIDO PRINCIPAL */}
            <div className="dashboard-header">
                {isLoading ? (
                    <h2>Cargando...</h2>
                ) : (
                    <h2>¡Bienvenido de nuevo, {userName}!</h2>
                )}
                <p>Explora lo mejor de tu comunidad universitaria.</p>

                {quote && (
                    <div className="motivational-quote">
                        <p className="quote-text">"{quote.texto}"</p>
                        <p className="quote-author">- {quote.autor}</p>
                    </div>
                )}
            </div>

            {/* TARJETAS DEL DASHBOARD */}
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
                    <button
                        className="dashboard-btn"
                        onClick={() => navigate("/matches")}
                    >
                        Ver Matches
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Dashboard;
