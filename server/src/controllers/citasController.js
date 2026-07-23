const { query, get, run } = require('../config/database');

// Obtener todas las citas del usuario con filtros opcionales y resumen de documentos
const getCitas = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { estado, especialidad } = req.query;

    let sql = `
      SELECT 
        c.*,
        COUNT(d.id) AS total_documentos,
        SUM(CASE WHEN d.completado = 1 THEN 1 ELSE 0 END) AS documentos_completados
      FROM citas c
      LEFT JOIN documentos d ON c.id = d.cita_id
      WHERE c.user_id = ?
    `;

    const params = [userId];

    if (estado) {
      sql += ' AND c.estado = ?';
      params.push(estado);
    }

    if (especialidad) {
      sql += ' AND c.especialidad LIKE ?';
      params.push(`%${especialidad}%`);
    }

    sql += ' GROUP BY c.id ORDER BY c.fecha ASC, c.hora ASC';

    const citas = await query(sql, params);

    res.json({
      success: true,
      count: citas.length,
      citas
    });
  } catch (err) {
    next(err);
  }
};

// Detalle de una cita específica con su lista completa de documentos
const getCitaById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const citaId = req.params.id;

    const cita = await get('SELECT * FROM citas WHERE id = ? AND user_id = ?', [citaId, userId]);
    if (!cita) {
      return res.status(404).json({ success: false, error: 'Cita no encontrada.' });
    }

    const documentos = await query('SELECT * FROM documentos WHERE cita_id = ? ORDER BY id ASC', [citaId]);

    res.json({
      success: true,
      cita: {
        ...cita,
        documentos
      }
    });
  } catch (err) {
    next(err);
  }
};

// Crear nueva cita y generar checklist inicial de documentos
const createCita = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { titulo, especialidad, doctor, fecha, hora, lugar, notas, documentos } = req.body;

    if (!titulo || !especialidad || !doctor || !fecha || !hora || !lugar) {
      return res.status(400).json({
        success: false,
        error: 'Los campos (titulo, especialidad, doctor, fecha, hora, lugar) son obligatorios.'
      });
    }

    const result = await run(
      `INSERT INTO citas (user_id, titulo, especialidad, doctor, fecha, hora, lugar, estado, notas)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'Pendiente', ?)`,
      [userId, titulo, especialidad, doctor, fecha, hora, lugar, notas || '']
    );

    const citaId = result.lastID;

    // Generar documentos predeterminados si no se enviaron explícitamente
    const defaultDocs = [
      { nombre: 'Documento de Identificación (DNI/Cédula)', categoria: 'Identificación' },
      { nombre: 'Orden Médica o Remisión', categoria: 'Orden Médica' },
      { nombre: 'Exámenes o Laboratorios Previos', categoria: 'Examen' },
      { nombre: 'Carnet de Seguro/EPS', categoria: 'Requisito' }
    ];

    const docsToInsert = Array.isArray(documentos) && documentos.length > 0 ? documentos : defaultDocs;

    for (const doc of docsToInsert) {
      await run(
        'INSERT INTO documentos (cita_id, nombre, categoria, completado) VALUES (?, ?, ?, 0)',
        [citaId, typeof doc === 'string' ? doc : doc.nombre, doc.categoria || 'Requisito']
      );
    }

    const createdCita = await get('SELECT * FROM citas WHERE id = ?', [citaId]);
    const createdDocs = await query('SELECT * FROM documentos WHERE cita_id = ?', [citaId]);

    res.status(201).json({
      success: true,
      message: 'Cita creada exitosamente con lista de chequeo de documentos.',
      cita: {
        ...createdCita,
        documentos: createdDocs
      }
    });
  } catch (err) {
    next(err);
  }
};

// Actualizar cita o estado (Pendiente, Completada, Cancelada)
const updateCita = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const citaId = req.params.id;

    const existingCita = await get('SELECT * FROM citas WHERE id = ? AND user_id = ?', [citaId, userId]);
    if (!existingCita) {
      return res.status(404).json({ success: false, error: 'Cita no encontrada.' });
    }

    const { titulo, especialidad, doctor, fecha, hora, lugar, estado, notas } = req.body;

    const newEstado = estado || existingCita.estado;
    if (!['Pendiente', 'Completada', 'Cancelada'].includes(newEstado)) {
      return res.status(400).json({ success: false, error: 'Estado de cita inválido.' });
    }

    await run(
      `UPDATE citas SET
        titulo = COALESCE(?, titulo),
        especialidad = COALESCE(?, especialidad),
        doctor = COALESCE(?, doctor),
        fecha = COALESCE(?, fecha),
        hora = COALESCE(?, hora),
        lugar = COALESCE(?, lugar),
        estado = ?,
        notas = COALESCE(?, notas)
       WHERE id = ? AND user_id = ?`,
      [titulo, especialidad, doctor, fecha, hora, lugar, newEstado, notas, citaId, userId]
    );

    const updatedCita = await get('SELECT * FROM citas WHERE id = ?', [citaId]);
    const documentos = await query('SELECT * FROM documentos WHERE cita_id = ?', [citaId]);

    res.json({
      success: true,
      message: 'Cita actualizada correctamente.',
      cita: {
        ...updatedCita,
        documentos
      }
    });
  } catch (err) {
    next(err);
  }
};

// Eliminar cita
const deleteCita = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const citaId = req.params.id;

    const existingCita = await get('SELECT * FROM citas WHERE id = ? AND user_id = ?', [citaId, userId]);
    if (!existingCita) {
      return res.status(404).json({ success: false, error: 'Cita no encontrada.' });
    }

    await run('DELETE FROM citas WHERE id = ? AND user_id = ?', [citaId, userId]);

    res.json({
      success: true,
      message: 'Cita y sus documentos asociados eliminados exitosamente.'
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCitas,
  getCitaById,
  createCita,
  updateCita,
  deleteCita
};
