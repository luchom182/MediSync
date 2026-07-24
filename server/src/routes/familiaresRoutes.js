const express = require('express');
const router = express.Router();
const { getFamiliares, createFamiliar, updateFamiliar, deleteFamiliar } = require('../controllers/familiaresController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.use(verifyToken);

router.get('/', getFamiliares);
router.post('/', createFamiliar);
router.put('/:id', updateFamiliar);
router.delete('/:id', deleteFamiliar);

module.exports = router;
