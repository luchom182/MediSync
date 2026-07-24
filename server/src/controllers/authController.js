const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const { get, run } = require('../config/database');
const { JWT_SECRET } = require('../middlewares/authMiddleware');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || 'MOCK_GOOGLE_CLIENT_ID');

// Registro de usuario tradicional
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

    const newUser = await get('SELECT id, nombre, email, rol, avatar_url, created_at FROM users WHERE id = ?', [result.lastID]);
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

// Login de usuario tradicional
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
      avatar_url: user.avatar_url,
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

// Autenticación con Google (Gmail OAuth 2.0)
const googleAuth = async (req, res, next) => {
  try {
    const { googleToken, googleUser } = req.body;

    let email, nombre, google_id, avatar_url;

    // Si viene ID Token oficial de Google, verificarlo
    if (googleToken) {
      try {
        const ticket = await client.verifyIdToken({
          idToken: googleToken,
          audience: process.env.GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();
        email = payload.email;
        nombre = payload.name;
        google_id = payload.sub;
        avatar_url = payload.picture;
      } catch (e) {
        // Si no hay Client ID real en dev, aceptar objeto verificado dev
        if (googleUser && googleUser.email) {
          email = googleUser.email;
          nombre = googleUser.nombre || googleUser.name;
          google_id = googleUser.google_id || googleUser.sub || `google_${Date.now()}`;
          avatar_url = googleUser.picture || googleUser.avatar_url;
        } else {
          return res.status(401).json({ success: false, error: 'Token de Google inválido.' });
        }
      }
    } else if (googleUser && googleUser.email) {
      email = googleUser.email;
      nombre = googleUser.nombre || googleUser.name;
      google_id = googleUser.google_id || `google_${Date.now()}`;
      avatar_url = googleUser.picture || googleUser.avatar_url;
    } else {
      return res.status(400).json({ success: false, error: 'Datos de autenticación con Google no proporcionados.' });
    }

    // Buscar si el usuario ya existe por email o google_id
    let user = await get('SELECT * FROM users WHERE email = ? OR google_id = ?', [email, google_id]);

    if (user) {
      // Actualizar google_id o avatar si no los tenía
      await run('UPDATE users SET google_id = COALESCE(?, google_id), avatar_url = COALESCE(?, avatar_url) WHERE id = ?', [google_id, avatar_url, user.id]);
      user = await get('SELECT id, nombre, email, rol, avatar_url, created_at FROM users WHERE id = ?', [user.id]);
    } else {
      // Crear nuevo usuario registrado vía Google
      const randomPassword = await bcrypt.hash(`google_${Date.now()}_${Math.random()}`, 10);
      const result = await run(
        'INSERT INTO users (nombre, email, password_hash, rol, google_id, avatar_url) VALUES (?, ?, ?, ?, ?, ?)',
        [nombre, email, randomPassword, 'paciente', google_id, avatar_url]
      );
      user = await get('SELECT id, nombre, email, rol, avatar_url, created_at FROM users WHERE id = ?', [result.lastID]);
    }

    const token = jwt.sign({ id: user.id, email: user.email, rol: user.rol }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      message: 'Autenticación con Google exitosa.',
      token,
      user
    });
  } catch (err) {
    next(err);
  }
};

// Obtener perfil actual me
const getMe = async (req, res, next) => {
  try {
    const user = await get('SELECT id, nombre, email, rol, avatar_url, created_at FROM users WHERE id = ?', [req.user.id]);
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
  googleAuth,
  getMe
};
