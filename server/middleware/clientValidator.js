const mongoose = require('mongoose');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validador de formato de ObjectId de MongoDB en parámetros
 */
const validateClientId = (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: 'El ID proporcionado no tiene un formato válido de MongoDB'
    });
  }
  next();
};

/**
 * Validador del payload para la creación de un nuevo cliente (POST)
 */
const validateCreateClient = (req, res, next) => {
  const { email, username, password, name, phone, address } = req.body;
  const errors = [];

  if (!name || typeof name !== 'object') {
    errors.push('El objeto name es obligatorio');
  } else {
    if (!name.firstname || typeof name.firstname !== 'string' || name.firstname.trim() === '') {
      errors.push('El campo name.firstname es obligatorio');
    }
  }

  if (!email || typeof email !== 'string' || email.trim() === '') {
    errors.push('El campo email es obligatorio');
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.push('El formato del correo electrónico no es válido');
  }

  if (!username || typeof username !== 'string' || username.trim() === '') {
    errors.push('El campo username es obligatorio');
  }

  if (!password || typeof password !== 'string' || password.trim() === '') {
    errors.push('El campo password es obligatorio');
  }

  if (phone !== undefined && typeof phone !== 'string') {
    errors.push('El campo phone debe ser una cadena de texto');
  }

  if (address !== undefined && typeof address !== 'object') {
    errors.push('El campo address debe ser un objeto');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      message: 'Error de validación en los datos del cliente',
      errors
    });
  }

  next();
};

/**
 * Validador del payload para la actualización de un cliente (PUT)
 */
const validateUpdateClient = (req, res, next) => {
  if (!req.body || typeof req.body !== 'object' || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      message: 'El cuerpo de la petición no puede estar vacío para actualizar'
    });
  }

  const { email, phone, name, address } = req.body;
  const errors = [];

  if (email !== undefined) {
    if (typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      errors.push('El formato del correo electrónico no es válido');
    }
  }

  if (name !== undefined) {
    if (typeof name !== 'object') {
      errors.push('El campo name debe ser un objeto');
    } else if (name.firstname !== undefined && (typeof name.firstname !== 'string' || name.firstname.trim() === '')) {
      errors.push('El campo name.firstname no puede estar vacío');
    }
  }

  if (phone !== undefined && typeof phone !== 'string') {
    errors.push('El campo phone debe ser una cadena de texto');
  }

  if (address !== undefined && typeof address !== 'object') {
    errors.push('El campo address debe ser un objeto');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      message: 'Error de validación en los datos de actualización',
      errors
    });
  }

  next();
};

module.exports = {
  validateClientId,
  validateCreateClient,
  validateUpdateClient
};
