const { query, get, run } = require('../config/database');

// Obtener todos los familiares del usuario autenticado
const getFamiliares = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const familiares = await query(
      'SELECT * FROM familiares WHERE user_id = ? ORDER BY created_at ASC',
      [userId]
    );

    res.json({
      success: true,
      count: familiares.length,
      familiares
    });
  } catch (err) {
    next(err);
  }
};

// Crear un nuevo miembro del núcleo familiar
const createFamiliar = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { nombre, parentesco, documento_identidad, color_tag } = req.body;

    if (!nombre || !parentesco) {
      return res.status(400).json({
        success: false,
        error: 'El nombre y el parentesco (Madre, Cónyuge, Hijo/a, etc.) son obligatorios.'
      });
    }

    const defaultColors = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#06b6d4', '#8b5cf6'];
    const chosenColor = color_tag || defaultColors[Math.floor(Math.random() * defaultColors.length)];

    const result = await run(
      'INSERT INTO familiares (user_id, nombre, parentesco, documento_identidad, color_tag) VALUES (?, ?, ?, ?, ?)',
      [userId, nombre, parentesco, documento_identidad || '', chosenColor]
    );

    const newFamiliar = await get('SELECT * FROM familiares WHERE id = ?', [result.lastID]);

    res.status(201).json({
      success: true,
      message: 'Miembro familiar agregado exitosamente.',
      familiar: newFamiliar
    });
  } catch (err) {
    next(err);
  }
};

// Actualizar información de un familiar
const updateFamiliar = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const familiarId = req.params.id;
    const { nombre, parentesco, documento_identidad, color_tag } = req.body;

    const existing = await get('SELECT * FROM familiares WHERE id = ? AND user_id = ?', [familiarId, userId]);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Miembro familiar no encontrado.' });
    }

    await run(
      `UPDATE familiares SET
        nombre = COALESCE(?, nombre),
        parentesco = COALESCE(?, parentesco),
        documento_identidad = COALESCE(?, documento_identidad),
        color_tag = COALESCE(?, color_tag)
       WHERE id = ? AND user_id = ?`,
      [nombre, parentesco, documento_identidad, color_tag, familiarId, userId]
    );

    const updated = await get('SELECT * FROM familiares WHERE id = ?', [familiarId]);

    res.json({
      success: true,
      message: 'Información de familiar actualizada.',
      familiar: updated
    });
  } catch (err) {
    next(err);
  }
};

// Eliminar un familiar
const deleteFamiliar = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const familiarId = req.params.id;

    const existing = await get('SELECT * FROM familiares WHERE id = ? AND user_id = ?', [familiarId, userId]);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Miembro familiar no encontrado.' });
    }

    await run('DELETE FROM familiares WHERE id = ? AND user_id = ?', [familiarId, userId]);

    res.json({
      success: true,
      message: 'Miembro familiar eliminado.'
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getFamiliares,
  createFamiliar,
  updateFamiliar,
  deleteFamiliar
};
