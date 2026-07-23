const bcrypt = require('bcryptjs');
const { get, run } = require('../config/database');

const getProfile = async (req, res, next) => {
  try {
    const user = await get('SELECT id, nombre, email, rol, created_at FROM users WHERE id = ?', [req.user.id]);
    if (!user) {
      return res.status(404).json({ success: false, error: 'Usuario no encontrado.' });
    }
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { nombre, password } = req.body;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(password, salt);
      await run('UPDATE users SET nombre = COALESCE(?, nombre), password_hash = ? WHERE id = ?', [nombre, password_hash, userId]);
    } else {
      await run('UPDATE users SET nombre = COALESCE(?, nombre) WHERE id = ?', [nombre, userId]);
    }

    const updatedUser = await get('SELECT id, nombre, email, rol, created_at FROM users WHERE id = ?', [userId]);

    res.json({
      success: true,
      message: 'Perfil actualizado exitosamente.',
      user: updatedUser
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProfile,
  updateProfile
};
