import "../css/listaclientes.css"
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FormCliente from "../components/FormCliente";
import clientesService from "../services/clientesService";
import { obtenerMensajeError } from "../services/api";
import useAutorizaciones from "../hooks/useAutorizaciones";

const normalizarTextoBusqueda = (texto) =>
  texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es")
    .trim();

const ListaClientes = () => {
  const { admin } = useAutorizaciones();
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarClientes = async () => {
      try {
        const data = await clientesService.getClientes();
        setClientes(data);
      } catch (err) {
        setError(obtenerMensajeError(err, "Error al cargar los clientes."));
      } finally {
        setLoading(false);
      }
    };

    cargarClientes();
  }, []);

  const handleClienteCreado = (nuevoCliente) => {
    setClientes((prevClientes) => [nuevoCliente, ...prevClientes]);
  };

  const terminosBusqueda = normalizarTextoBusqueda(busqueda)
    .split(/\s+/)
    .filter(Boolean);

  const clientesFiltrados = clientes.filter((cliente) => {
    const textoCliente = normalizarTextoBusqueda(
      [
        cliente.id,
        cliente.name?.firstname,
        cliente.name?.lastname,
        cliente.email,
        cliente.phone,
        cliente.address?.city,
        cliente.username,
      ]
        .filter(Boolean)
        .join(" ")
    );

    return terminosBusqueda.every((termino) => textoCliente.includes(termino));
  });

  if (loading) {
    return <h2>Cargando clientes...</h2>;
  }

  if (error) {
    return <h2 role="alert">Error al cargar los clientes: {error}</h2>;
  }

  return (
    <div className="clientes-container">

      <h1>Clientes</h1>
      <FormCliente onClienteCreado={handleClienteCreado} />

      <hr />

      <div className="contenedor-buscador">

        <h2 className="titulo-buscador">
          Buscar Clientes
        </h2>

        <input
          className="buscador"
          type="text"
          placeholder="Buscar por nombre, email, teléfono, ciudad o ID"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <p className="cantidad-clientes">
          Clientes encontrados: {clientesFiltrados.length}
        </p>

      </div>
      <table className="tabla-clientes">

        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Ciudad</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>

          {clientesFiltrados.map((cliente) => (
            <tr key={cliente.id}>

              <td>{cliente.id}</td>

              <td>
                {cliente.name?.firstname} {cliente.name?.lastname}
              </td>

              <td>{cliente.email}</td>

              <td>{cliente.phone}</td>

              <td>{cliente.address?.city}</td>

              <td>
                <div className="acciones-cliente">
                  <Link
                    className="btn-ficha"
                    to={`/clientes/${cliente.id}`}
                  >
                    Ver Ficha Completa
                  </Link>
                  {admin?.sector?.trim() === "Gerencia" && (
                    <Link
                      className="btn-editar-ficha"
                      to={`/clientes/${cliente.id}`}
                      state={{ abrirEdicion: true, cliente }}
                    >
                      Editar
                    </Link>
                  )}
                </div>
              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
};

export default ListaClientes;