const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db');
const clientRoutes = require('./routes/clientRoutes');
const corsMiddleware = require('./middleware/cors');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;
connectDB();

app.use(corsMiddleware);
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Servidor Express corriendo correctamente en puerto 3001',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/clientes', clientRoutes);

// Middlewares globales para manejo de rutas no encontradas y errores
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
