const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const clientRoutes = require('./routes/clientRoutes');

const app = express();
const PORT = process.env.PORT || 3001;
connectDB();

app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173']
}));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Servidor Express corriendo correctamente en puerto 3001',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/clientes', clientRoutes);

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});