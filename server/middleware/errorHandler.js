/**
 * Middleware para rutas no encontradas (404)
 */
const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
    error: 'Not Found'
  });
};

/**
 * Middleware centralizado para manejo de errores (400, 404, 500)
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || 'Error interno del servidor';
  let errors = undefined;

  // Manejo de error de sintaxis JSON en el body (Bad Request - 400)
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    statusCode = 400;
    message = 'Formato JSON inválido en el cuerpo de la petición';
  }

  // Manejo de error de validación de Mongoose (Bad Request - 400)
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Error de validación en los datos enviados';
    errors = Object.values(err.errors).map((item) => item.message);
  }

  // Manejo de error de Cast de Mongoose (ej: ObjectId inválido) (Bad Request - 400)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Formato de ID inválido: '${err.value}' no es un identificador válido`;
  }

  // Manejo de clave duplicada en Mongo (Bad Request / Conflict - 400)
  if (err.code === 11000) {
    statusCode = 400;
    const duplicatedField = Object.keys(err.keyValue || {})[0];
    message = `El valor ingresado para '${duplicatedField}' ya se encuentra registrado`;
  }

  // Registro del error en consola para depuración
  if (statusCode === 500) {
    console.error(`[Error 500] ${req.method} ${req.originalUrl}:`, err);
  } else {
    console.warn(`[Warning ${statusCode}] ${req.method} ${req.originalUrl}: ${message}`);
  }

  return res.status(statusCode).json({
    message,
    ...(errors && { errors }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = {
  notFoundHandler,
  errorHandler
};
