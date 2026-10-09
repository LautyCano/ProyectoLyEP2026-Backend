import axios from "axios";

const api = axios.create({
  baseURL: (
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api"
  ).trim().replace(/\/+$/, ""),
});

export const obtenerMensajeError = (error, mensajePredeterminado) => {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error ? error.message : mensajePredeterminado;
  }

  const respuesta = error.response;
  if (!respuesta) {
    return "No se pudo conectar con el servidor. Verifique que el backend esté en ejecución.";
  }

  const mensaje = respuesta.data?.message;
  const detalles = respuesta.data?.errors;
  if (typeof mensaje === "string") {
    return Array.isArray(detalles)
      ? `${mensaje}: ${detalles.join(", ")}`
      : mensaje;
  }

  return `El servidor respondió con el error ${respuesta.status}.`;
};

export default api;
