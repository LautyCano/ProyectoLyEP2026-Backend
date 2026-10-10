import '../css/detallecliente.css';
import { useCallback, useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { Alert, Button, Form, Modal, Spinner } from "react-bootstrap";
import clientesService from "../services/clientesService";
import useAutorizaciones from "../hooks/useAutorizaciones";
import { obtenerMensajeError } from "../services/api";

const DetalleCliente = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { admin } = useAutorizaciones();
  const clienteInicialEdicion = location.state?.cliente;

  const [cliente, setCliente] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [eliminando, setEliminando] = useState(false);
  const [editando, setEditando] = useState(
    () =>
      Boolean(location.state?.abrirEdicion) &&
      admin?.sector?.trim() === "Gerencia" &&
      Boolean(clienteInicialEdicion)
  );
  const [guardando, setGuardando] = useState(false);
  const [datosEdicion, setDatosEdicion] = useState(() =>
    clienteInicialEdicion
      ? {
          firstname: clienteInicialEdicion.name.firstname,
          lastname: clienteInicialEdicion.name.lastname,
          email: clienteInicialEdicion.email,
          phone: clienteInicialEdicion.phone,
          city: clienteInicialEdicion.address.city,
        }
      : null
  );
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  useEffect(() => {
    const cargarCliente = async () => {
      try {
        setCliente(await clientesService.getClientePorId(id));
      } catch (err) {
        setError(obtenerMensajeError(err, "Error al cargar el detalle del cliente."));
      } finally {
        setLoading(false);
      }
    };
    cargarCliente();
  }, [id]);

  useEffect(() => {
    if (location.state?.abrirEdicion) {
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, location.state, navigate]);

  const iniciarEdicion = useCallback(() => {
    setMensaje("");
    setDatosEdicion({
      firstname: cliente.name.firstname,
      lastname: cliente.name.lastname,
      email: cliente.email,
      phone: cliente.phone,
      city: cliente.address.city,
    });
    setEditando(true);
  }, [cliente]);

  const cancelarEdicion = () => {
    setEditando(false);
    setDatosEdicion(null);
  };

  const actualizarCampo = (campo, valor) => {
    setDatosEdicion((actuales) => ({ ...actuales, [campo]: valor }));
  };

  const guardarEdicion = async (evento) => {
    evento.preventDefault();
    setMensaje("");
    setGuardando(true);

    try {
      const clienteActualizado = await clientesService.editarCliente(id, {
        name: {
          firstname: datosEdicion.firstname.trim(),
          lastname: datosEdicion.lastname.trim(),
        },
        email: datosEdicion.email.trim(),
        phone: datosEdicion.phone.trim(),
        address: { city: datosEdicion.city.trim() },
      });
      setCliente(clienteActualizado);
      setEditando(false);
      setDatosEdicion(null);
      setMensaje("Cliente actualizado correctamente.");
    } catch (err) {
      setMensaje(`No se pudo actualizar el cliente: ${obtenerMensajeError(err, "Error desconocido.")}`);
    } finally {
      setGuardando(false);
    }
  };

  const solicitarEliminacion = () => {
    if (admin?.sector?.trim() !== "Gerencia") {
      setMensaje("No tienes permisos para eliminar clientes.");
      return;
    }

    setMostrarConfirmacion(true);
  };

  const eliminarCliente = async () => {
    setMostrarConfirmacion(false);
    setEliminando(true);
    try {
      await clientesService.eliminarCliente(id);
      setMensaje("Cliente eliminado correctamente. Volviendo a la lista...");
      setTimeout(() => navigate("/clientes"), 1500);
    } catch (err) {
      setMensaje(`No se pudo eliminar el cliente: ${obtenerMensajeError(err, "Error desconocido.")}`);
      setEliminando(false);
    }
  };
  
  if (loading) {
    return <h2>Cargando cliente...</h2>;
  }

  if (error || !cliente) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          <p>{error || "Error al cargar el detalle del cliente."}</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/clientes")}
          >
            Volver a Clientes
          </button>
        </div>
      </div>
    );
  }

  const enmascarar = (str) => '•'.repeat(str?.length || 8); //crea una mascara de puntos para la contraseña y que tenga un minimo de 8 caracteres

  return (
    <div className="detalle-cliente">
      <h1>Ficha del Cliente</h1>

      {mensaje && (
        <Alert
          variant={mensaje.startsWith("No se pudo") ? "danger" : "success"}
          role={mensaje.startsWith("No se pudo") ? "alert" : "status"}
        >
          {mensaje}
        </Alert>
      )}

      <p>
        <strong>ID:</strong> {cliente.id}
      </p>

      {editando ? (
        <Form onSubmit={guardarEdicion}>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              required
              value={datosEdicion.firstname}
              onChange={(evento) => actualizarCampo("firstname", evento.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Apellido</Form.Label>
            <Form.Control
              required
              value={datosEdicion.lastname}
              onChange={(evento) => actualizarCampo("lastname", evento.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              required
              type="email"
              value={datosEdicion.email}
              onChange={(evento) => actualizarCampo("email", evento.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              value={datosEdicion.phone}
              onChange={(evento) => actualizarCampo("phone", evento.target.value)}
            />
          </Form.Group>
          <h2>Dirección</h2>
          <Form.Group className="mb-3">
            <Form.Label>Ciudad</Form.Label>
            <Form.Control
              value={datosEdicion.city}
              onChange={(evento) => actualizarCampo("city", evento.target.value)}
            />
          </Form.Group>
          <div className="d-flex gap-2">
            <Button type="submit" disabled={guardando}>
              {guardando ? <Spinner size="sm" /> : "Guardar cambios"}
            </Button>
            <Button
              type="button"
              variant="outline-secondary"
              onClick={cancelarEdicion}
              disabled={guardando}
            >
              Cancelar
            </Button>
          </div>
        </Form>
      ) : (
        <>
          <p>
            <strong>Nombre:</strong>{" "}
            {cliente.name.firstname} {cliente.name.lastname}
          </p>
          <p>
            <strong>Email:</strong> {cliente.email}
          </p>
          <p>
            <strong>Teléfono:</strong> {cliente.phone}
          </p>
          <h2>Dirección</h2>
          <p>
            <strong>Calle:</strong> {cliente.address.street}
          </p>
          <p>
            <strong>Número:</strong> {cliente.address.number}
          </p>
          <p>
            <strong>Código Postal:</strong> {cliente.address.zipcode}
          </p>
          <p>
            <strong>Ciudad:</strong> {cliente.address.city}
          </p>
          <h2>Credenciales</h2>
          <p>
            <strong>Usuario:</strong> {cliente.username}
          </p>
          <p>
            <strong>Contraseña:</strong> {enmascarar(cliente.password)}
          </p>
        </>
      )}

      {admin?.sector?.trim() === "Gerencia" && !editando && (
        <>
          <Button className="btn-editar-cliente" onClick={iniciarEdicion}>
            Editar Cliente
          </Button>
          <button
            className='btn-eliminar'
            onClick={solicitarEliminacion}
            disabled={eliminando}
          >
            {eliminando ? (
              <>
                <Spinner animation="border" size="sm" role="status" />
                <span className="texto-spinner">Eliminando...</span>
              </>
            ) : "Eliminar Cliente"}
          </button>
        </>
      )}

      <Modal
        show={mostrarConfirmacion}
        onHide={() => setMostrarConfirmacion(false)}
        centered
        className="modal-confirmacion"
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            ¿Está seguro de que desea eliminar al cliente{' '}
            <strong>{cliente.name.firstname} {cliente.name.lastname}</strong>?
          </p>
          <span className="texto-advertencia">
            Esta acción no se puede deshacer.
          </span>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => setMostrarConfirmacion(false)}
          >
            Cancelar
          </Button>
          <Button variant="danger" onClick={eliminarCliente}>
            Sí, eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DetalleCliente;