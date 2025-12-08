// src/pages/MUsuario/MUsuario.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import storeAuth from "../../context/storeAuth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MUsuario = () => {
  const [usuario, setUsuario] = useState(null);
  const token = storeAuth((state) => state.token);

  // Obtener perfil
  const fetchPerfil = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/usuarios/perfil`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsuario(res.data);
    } catch (error) {
      toast.error(error.response?.data?.msg || "Error al obtener perfil");
    }
  };

  useEffect(() => {
    if (token) fetchPerfil();
  }, [token]);

  // Actualizar perfil
  const handleActualizarPerfil = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/usuarios`,
        usuario,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(res.data.msg);
    } catch (error) {
      toast.error(error.response?.data?.msg || "Error al actualizar perfil");
    }
  };

  if (!usuario) return <p>Cargando perfil...</p>;

  return (
    <div className="musuario-container">
      <h2>Mi Perfil</h2>
      <form onSubmit={handleActualizarPerfil}>
        <input
          type="text"
          placeholder="Nombre"
          value={usuario.nombre || ""}
          onChange={(e) => setUsuario({ ...usuario, nombre: e.target.value })}
        />
        <input
          type="text"
          placeholder="Apellido"
          value={usuario.apellido || ""}
          onChange={(e) =>
            setUsuario({ ...usuario, apellido: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Teléfono"
          value={usuario.telefono || ""}
          onChange={(e) =>
            setUsuario({ ...usuario, telefono: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Dirección"
          value={usuario.direccion || ""}
          onChange={(e) =>
            setUsuario({ ...usuario, direccion: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Cédula"
          value={usuario.cedula || ""}
          onChange={(e) =>
            setUsuario({ ...usuario, cedula: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Universidad"
          value={usuario.universidad || ""}
          onChange={(e) =>
            setUsuario({ ...usuario, universidad: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Carrera"
          value={usuario.carrera || ""}
          onChange={(e) =>
            setUsuario({ ...usuario, carrera: e.target.value })
          }
        />
        <textarea
          placeholder="Descripción"
          value={usuario.descripcion || ""}
          onChange={(e) =>
            setUsuario({ ...usuario, descripcion: e.target.value })
          }
        ></textarea>

        <button type="submit">Actualizar Perfil</button>
      </form>

      <ToastContainer position="top-right" autoClose={4000} />
    </div>
  );
};

export default MUsuario;
