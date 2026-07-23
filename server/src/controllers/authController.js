const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { get, run } = require('../config/database');
const { JWT_SECRET } = require('../middlewares/authMiddleware');

// Registro de usuario
const register = async (req, res, next) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Todos los campos (nombre, email, password) son obligatorios.'
      });
    }

    const existingUser = await get('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'El correo electrónico ya está registrado.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const result = await run(
      'INSERT INTO users (nombre, email, password_hash, rol) VALUES (?, ?, ?, ?)',
      [nombre, email, password_hash, 'paciente']
    );

    const newUser = await get('SELECT id, nombre, email, rol, created_at FROM users WHERE id = ?', [result.lastID]);
    const token = jwt.sign({ id: newUser.id, email: newUser.email, rol: newUser.rol }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente.',
      token,
      user: newUser
    });
  } catch (err) {
    next(err);
  }
};

// Login de usuario
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email y contraseña son requeridos.'
      });
    }

    const user = await get('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas.'
      });
    }

    const token = jwt.sign({ id: user.id, email: user.email, rol: user.rol }, JWT_SECRET, { expiresIn: '7d' });

    const userPayload = {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
      created_at: user.created_at
    };

    res.json({
      success: true,
      message: 'Inicio de sesión exitoso.',
      token,
      user: userPayload
    });
  } catch (err) {
    next(err);
  }
};

// Obtener perfil actual me
const getMe = async (req, res, next) => {
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

module.exports = {
  register,
  login,
  getMe
};
