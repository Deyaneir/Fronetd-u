import { create } from "zustand";
import axios from "axios";

// Función para obtener headers con token desde localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
};

const storeProfile = create((set) => ({
  user: null, 
  clearUser: () => set({ user: null }),

  // Obtener perfil
  profile: async () => {
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/usuarios/perfil`; // ruta protegida
      const respuesta = await axios.get(url, getAuthHeaders());
      set({ user: respuesta.data });
    } catch (error) {
      console.error("Error al obtener perfil:", error.response?.data || error);
    }
  },

  // Actualizar perfil
  actualizarProfile: async (data) => {
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/usuarios/actualizar`;
      const respuesta = await axios.put(url, data, getAuthHeaders());
      set({ user: respuesta.data }); // actualizar estado
      return respuesta.data;
    } catch (error) {
      console.error("Error al actualizar perfil:", error.response?.data || error);
      throw error;
    }
  },
}));

export default storeProfile;
