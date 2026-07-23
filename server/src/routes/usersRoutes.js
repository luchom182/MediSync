const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/usersController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.use(verifyToken);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);

module.exports = router;
