const express = require('express');
const router = express.Router();
const { toggleDocumento, deleteDocumento } = require('../controllers/documentosController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.use(verifyToken);

router.patch('/:id/toggle', toggleDocumento);
router.delete('/:id', deleteDocumento);

module.exports = router;
