const express = require('express');
const router = express.Router();
const { getCitas, getCitaById, createCita, updateCita, deleteCita } = require('../controllers/citasController');
const { addDocumento } = require('../controllers/documentosController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.use(verifyToken);

router.get('/', getCitas);
router.post('/', createCita);
router.get('/:id', getCitaById);
router.put('/:id', updateCita);
router.delete('/:id', deleteCita);

// Ruta para añadir documento a una cita específica
router.post('/:citaId/documentos', addDocumento);

module.exports = router;
