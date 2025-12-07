import { NavLink, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFetch } from "../../hooks/useFetch";
import { useState } from "react";
import "./Register.css";

const KawaiiEyeIcon = () => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="22" 
        height="22" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className="icon-eye-kawaii"
    >
        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
        <circle cx="12" cy="12" r="3.5" fill="currentColor"/>
        <circle cx="13.5" cy="10.5" r="0.5" fill="white"/>
    </svg>
);

const KawaiiEyeOffIcon = () => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="22" 
        height="22" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className="icon-eye-off-kawaii"
    >
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.49M2 2l20 20" />
        <path d="M21.94 12c-3.1-4.81-6.57-7.25-9.44-8a18.45 18.45 0 0 0-3.04.57" />
    </svg>
);

const Register = () => {
    const navigate = useNavigate();
    const fetchDataBackend = useFetch();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const [showPassword, setShowPassword] = useState(false);

    // 🔹 Registro en backend
    const registerUser = async (dataForm) => {
        const url = `${import.meta.env.VITE_BACKEND_URL}/api/usuarios/register`;

        const body = {
            nombre: dataForm.name,
            correoInstitucional: dataForm.email,
            password: dataForm.password
        };
        
        console.log("URL del backend:", url);

        try {
            const response = await fetchDataBackend(url, body, "POST");

            if (response) {
                toast.success(response.msg || "Registro exitoso 🎉", {
                    position: "top-right",
                    autoClose: 10000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                navigate("/login");
            }
        } catch (error) {
            console.error("Error en el registro:", error);
        }
    };

    return (
        <div className="register-page">
            {/* Sección izquierda */}
            <div className="register-left">
                <div className="register-overlay">
                    <h1 className="vibe-logo">VIBE-<span>U</span></h1>
                    <p className="register-text">
                        Únete a la comunidad universitaria.<br />
                        Conecta, comparte y vive nuevas experiencias 🎓
                    </p>
                </div>
            </div>

            {/* Sección derecha con formulario */}
            <div className="register-right">
                <div className="register-card">
                    <h2 className="register-title">Crea tu cuenta</h2>
                    <p className="register-subtitle">
                        ¿Ya tienes una cuenta?{" "}
                        <NavLink to="/login" className="login-link">Inicia sesión</NavLink>
                    </p>

                    <form className="register-form" onSubmit={handleSubmit(registerUser)}>
                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="Nombre completo"
                                {...register("name", { required: "El nombre es obligatorio" })}
                            />
                            {errors.name && <span className="error-text">{errors.name.message}</span>}
                        </div>

                        <div className="input-group">
                            <input
                                type="email"
                                placeholder="Correo institucional"
                                {...register("email", { required: "El correo es obligatorio" })}
                            />
                            {errors.email && <span className="error-text">{errors.email.message}</span>}
                        </div>

                        <div className="input-group" style={{ position: "relative" }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Contraseña"
                                {...register("password", { required: "La contraseña es obligatoria" })}
                            />
                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: "absolute",
                                    right: "10px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    cursor: "pointer",
                                }}
                            >
                                {showPassword ? <KawaiiEyeIcon /> : <KawaiiEyeOffIcon />}
                            </span>
                            {errors.password && <span className="error-text">{errors.password.message}</span>}
                        </div>

                        <button type="submit" className="register-btn">Registrarme</button>
                    </form>
                </div>
            </div>

            <ToastContainer />
        </div>
    );
};

export default Register;
