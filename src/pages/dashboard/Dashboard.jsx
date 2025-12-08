import React, { useState, useEffect } from 'react';
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
    const [quote, setQuote] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const [avatar, setAvatar] = useState(null);

    // 🚀 Logout
    const handleLogout = () => {
        localStorage.clear();
        storeAuth.getState().clearToken();
        navigate("/login");
    };

    // 📌 CARGAR USUARIO + AVATAR
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const token = storeAuth.getState().token;
                if (!token) return setIsLoading(false);

                const res = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/perfil`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                if (res.data?.nombre) setUserName(res.data.nombre);
                if (res.data?.rol) setUserRole(res.data.rol);
                if (res.data?.avatar) setAvatar(res.data.avatar);

            } catch (error) {
                console.error("Error al obtener el usuario:", error);
            } finally {
                setIsLoading(false);
            }
        };

        const fetchQuote = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/frase`);
                const { q: frase, a: autor } = response.data[0];
                const traduccion = await axios.get(
                    `https://api.mymemory.translated.net/get?q=${encodeURIComponent(frase)}&langpair=en|es`
                );
                setQuote({ texto: `"${traduccion.data.responseData.translatedText}"`, autor });
            } catch (error) {
                console.error("Error frase motivadora:", error);
            }
        };

        fetchUserInfo();
        fetchQuote();

        const token = storeAuth.getState().token;
        const toastShownBefore = localStorage.getItem("loginToastShown");
        if (token && !toastShownBefore) {
            localStorage.setItem("loginToastShown", "true");
            setTimeout(() => {
                toast.success("Inicio de sesión exitoso 🎉", { position: "top-right", autoClose: 2000 });
            }, 0);
        }

    }, []);

    // Función auxiliar para obtener la URL del avatar con un timestamp para evitar caché si es necesario
    const getAvatarUrl = (url) => {
        if (!url) return null;
        return `${url}`; // Sin timestamp aquí para simplicidad, asume que el backend maneja bien los cambios.
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

            {/* MENÚ DESLIZABLE */}
            <nav className={`side-menu ${menuOpen ? "show" : ""}`}>
                <div className="menu-header">
                    <h3 className="menu-title">Menú</h3>

                    {/* ✅ ESTRUCTURA DE AVATAR MODIFICADA */}
                    <div className="avatar-section">
                        {avatar ? (
                            <img src={getAvatarUrl(avatar)} alt="Avatar" className="avatar-img" />
                        ) : (
                            <span className="default-avatar">👤</span>
                        )}
                    </div>
                    {/* FIN ESTRUCTURA DE AVATAR MODIFICADA */}

                </div>

                {/* BOTONES DEL MENÚ */}
                <div className="menu-buttons">
                    <button onClick={() => navigate("/Dashboard")}>Inicio</button>
                    <button onClick={() => navigate("/MUsuario")}>Mi cuenta</button>
                    <button onClick={() => {}}>Favoritos</button>
                    <button onClick={() => navigate("/Ajustes")}>Ajustes</button>
                    <button onClick={handleLogout}>Cerrar sesión</button>
                </div>
            </nav>

            {/* OVERLAY DEL MENÚ */}
            <div className={`menu-overlay ${menuOpen ? "show" : ""}`} onClick={() => setMenuOpen(false)}></div>

            {/* CONTENIDO PRINCIPAL */}
            <div className="dashboard-header">
                {isLoading ? <h2>Cargando...</h2> : <h2>¡Bienvenido de nuevo, {userName}!</h2>}
                <p>Explora lo mejor de tu comunidad universitaria.</p>
                {quote && (
                    <div className="motivational-quote">
                        <p className="quote-text">{quote.texto}</p>
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
                    <button className="dashboard-btn" onClick={() => navigate("/matches")}>Ver Matches</button>
                </div>
            </div>
        </section>
    );
};

export default Dashboard;
