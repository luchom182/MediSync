const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const citasRoutes = require('./routes/citasRoutes');
const documentosRoutes = require('./routes/documentosRoutes');
const usersRoutes = require('./routes/usersRoutes');
const errorHandler = require('./middlewares/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta raíz para evitar 404 al acceder a http://localhost:5000
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🏥 Servidor Backend MediSync activo.',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      citas: '/api/citas',
      documentos: '/api/documentos',
      users: '/api/users'
    },
    clientUrl: 'http://localhost:3000'
  });
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'MediSync API Server'
  });
});

// Rutas de la API REST
app.use('/api/auth', authRoutes);
app.use('/api/citas', citasRoutes);
app.use('/api/documentos', documentosRoutes);
app.use('/api/users', usersRoutes);

// Manejo de rutas no encontradas (404)
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
  });
});

// Middleware centralizado de errores
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`=================================`);
    console.log(`🚀 Servidor backend escuchando en puerto: ${PORT}`);
    console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`=================================`);
  });
}

module.exports = app;
