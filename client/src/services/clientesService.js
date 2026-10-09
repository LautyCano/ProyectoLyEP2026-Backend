import api from "./api";

const normalizarCliente = (cliente) => {
  if (!cliente || typeof cliente !== "object" || Array.isArray(cliente)) {
    throw new Error("La API devolvió un cliente con formato inesperado.");
  }

  const id = cliente.id ?? cliente._id;
  const { name, address } = cliente;
  if (
    (typeof id !== "string" && typeof id !== "number") ||
    !cliente.email ||
    typeof cliente.email !== "string" ||
    !cliente.username ||
    typeof cliente.username !== "string" ||
    !cliente.password ||
    typeof cliente.password !== "string" ||
    !name ||
    typeof name !== "object" ||
    typeof name.firstname !== "string" ||
    typeof name.lastname !== "string" ||
    (address !== undefined &&
      (typeof address !== "object" || address === null || Array.isArray(address)))
  ) {
    throw new Error("La API devolvió un cliente con formato inesperado.");
  }

  const direccion = address || {};
  const camposDireccion = ["city", "street", "number", "zipcode"];
  if (
    camposDireccion.some(
      (campo) =>
        direccion[campo] !== undefined && typeof direccion[campo] !== "string"
    ) ||
    (cliente.phone !== undefined && typeof cliente.phone !== "string")
  ) {
    throw new Error("La API devolvió un cliente con formato inesperado.");
  }

  return {
    ...cliente,
    id: String(id),
    name: { ...name },
    address: {
      city: "",
      street: "",
      number: "",
      zipcode: "",
      ...direccion,
    },
    phone: cliente.phone || "",
  };
};

const crearCliente = async (cliente) => {
  const respuesta = await api.post("/clientes", cliente);
  return normalizarCliente(respuesta.data);
};

const getClientes = async () => {
  const respuesta = await api.get("/clientes");
  if (!Array.isArray(respuesta.data)) {
    throw new Error("La API devolvió una lista de clientes con formato inesperado.");
  }
  return respuesta.data.map(normalizarCliente);
};

const getClientePorId = async (id) => {
  const respuesta = await api.get(`/clientes/${encodeURIComponent(id)}`);
  return normalizarCliente(respuesta.data);
};

const eliminarCliente = async (id) => {
  const respuesta = await api.delete(`/clientes/${encodeURIComponent(id)}`);
  if (
    !respuesta.data ||
    typeof respuesta.data.message !== "string" ||
    !respuesta.data.client
  ) {
    throw new Error("La API devolvió una respuesta de eliminación inesperada.");
  }
  normalizarCliente(respuesta.data.client);
  return respuesta.data;
};

export default {
  crearCliente,
  getClientes,
  getClientePorId,
  eliminarCliente,
};
