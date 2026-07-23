const { get, run } = require('../config/database');

// Alternar estado completado (toggle 0 <-> 1)
const toggleDocumento = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const docId = req.params.id;

    // Verificar que el documento pertenezca a una cita del usuario autenticado
    const doc = await get(
      `SELECT d.*, c.user_id 
       FROM documentos d 
       JOIN citas c ON d.cita_id = c.id 
       WHERE d.id = ? AND c.user_id = ?`,
      [docId, userId]
    );

    if (!doc) {
      return res.status(404).json({ success: false, error: 'Documento no encontrado o no pertenece a una cita del usuario.' });
    }

    const nuevoEstado = doc.completado === 1 ? 0 : 1;

    await run('UPDATE documentos SET completado = ? WHERE id = ?', [nuevoEstado, docId]);

    const updatedDoc = await get('SELECT * FROM documentos WHERE id = ?', [docId]);

    res.json({
      success: true,
      message: `Documento marcado como ${nuevoEstado === 1 ? 'completado' : 'pendiente'}.`,
      documento: updatedDoc
    });
  } catch (err) {
    next(err);
  }
};

// Agregar un nuevo ítem al checklist de una cita
const addDocumento = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const citaId = req.params.citaId;
    const { nombre, categoria } = req.body;

    if (!nombre) {
      return res.status(400).json({ success: false, error: 'El nombre del documento es obligatorio.' });
    }

    // Verificar que la cita exista y sea del usuario
    const cita = await get('SELECT id FROM citas WHERE id = ? AND user_id = ?', [citaId, userId]);
    if (!cita) {
      return res.status(404).json({ success: false, error: 'Cita no encontrada.' });
    }

    const result = await run(
      'INSERT INTO documentos (cita_id, nombre, categoria, completado) VALUES (?, ?, ?, 0)',
      [citaId, nombre, categoria || 'Requisito']
    );

    const newDoc = await get('SELECT * FROM documentos WHERE id = ?', [result.lastID]);

    res.status(201).json({
      success: true,
      message: 'Ítem agregado a la lista de chequeo.',
      documento: newDoc
    });
  } catch (err) {
    next(err);
  }
};

// Eliminar un documento del checklist
const deleteDocumento = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const docId = req.params.id;

    const doc = await get(
      `SELECT d.id 
       FROM documentos d 
       JOIN citas c ON d.cita_id = c.id 
       WHERE d.id = ? AND c.user_id = ?`,
      [docId, userId]
    );

    if (!doc) {
      return res.status(404).json({ success: false, error: 'Documento no encontrado.' });
    }

    await run('DELETE FROM documentos WHERE id = ?', [docId]);

    res.json({
      success: true,
      message: 'Documento eliminado de la lista de chequeo.'
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  toggleDocumento,
  addDocumento,
  deleteDocumento
};
