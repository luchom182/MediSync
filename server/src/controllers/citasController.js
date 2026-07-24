const { query, get, run } = require('../config/database');
const { generateGoogleCalendarUrl, syncToGoogleCalendarAPI } = require('../services/calendarService');

// Obtener todas las citas del usuario con información del familiar asociado y resumen de documentos
const getCitas = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { estado, especialidad, familiar_id } = req.query;

    let sql = `
      SELECT 
        c.*,
        f.nombre AS familiar_nombre,
        f.parentesco AS familiar_parentesco,
        f.color_tag AS familiar_color,
        COUNT(d.id) AS total_documentos,
        SUM(CASE WHEN d.completado = 1 THEN 1 ELSE 0 END) AS documentos_completados
      FROM citas c
      LEFT JOIN familiares f ON c.familiar_id = f.id
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

    if (familiar_id) {
      if (familiar_id === 'titular') {
        sql += ' AND c.familiar_id IS NULL';
      } else {
        sql += ' AND c.familiar_id = ?';
        params.push(familiar_id);
      }
    }

    sql += ' GROUP BY c.id ORDER BY c.fecha ASC, c.hora ASC';

    const rawCitas = await query(sql, params);

    // Enriquecer cada cita con su enlace directo a Google Calendar
    const citas = rawCitas.map(c => ({
      ...c,
      google_calendar_url: generateGoogleCalendarUrl(c)
    }));

    res.json({
      success: true,
      count: citas.length,
      citas
    });
  } catch (err) {
    next(err);
  }
};

// Detalle de una cita específica con información del familiar y documentos
const getCitaById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const citaId = req.params.id;

    const sql = `
      SELECT 
        c.*,
        f.nombre AS familiar_nombre,
        f.parentesco AS familiar_parentesco,
        f.color_tag AS familiar_color
      FROM citas c
      LEFT JOIN familiares f ON c.familiar_id = f.id
      WHERE c.id = ? AND c.user_id = ?
    `;

    const cita = await get(sql, [citaId, userId]);
    if (!cita) {
      return res.status(404).json({ success: false, error: 'Cita no encontrada.' });
    }

    const documentos = await query('SELECT * FROM documentos WHERE cita_id = ? ORDER BY id ASC', [citaId]);

    res.json({
      success: true,
      cita: {
        ...cita,
        google_calendar_url: generateGoogleCalendarUrl(cita),
        documentos
      }
    });
  } catch (err) {
    next(err);
  }
};

// Crear nueva cita asociando opcionalmente a un miembro del núcleo familiar
const createCita = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { familiar_id, titulo, especialidad, doctor, fecha, hora, lugar, notas, documentos, googleAccessToken } = req.body;

    if (!titulo || !especialidad || !doctor || !fecha || !hora || !lugar) {
      return res.status(400).json({
        success: false,
        error: 'Los campos (titulo, especialidad, doctor, fecha, hora, lugar) son obligatorios.'
      });
    }

    // Si se especificó un familiar, verificar que pertenezca al usuario
    let validFamiliarId = null;
    if (familiar_id) {
      const fam = await get('SELECT id FROM familiares WHERE id = ? AND user_id = ?', [familiar_id, userId]);
      if (fam) validFamiliarId = fam.id;
    }

    // Si se proporciona un Access Token de Google, intentar sincronización directa con Calendar API
    let google_calendar_event_id = null;
    if (googleAccessToken) {
      google_calendar_event_id = await syncToGoogleCalendarAPI(
        { titulo, especialidad, doctor, fecha, hora, lugar, notas },
        googleAccessToken
      );
    }

    const result = await run(
      `INSERT INTO citas (user_id, familiar_id, titulo, especialidad, doctor, fecha, hora, lugar, estado, notas, google_calendar_event_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pendiente', ?, ?)`,
      [userId, validFamiliarId, titulo, especialidad, doctor, fecha, hora, lugar, notas || '', google_calendar_event_id]
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

    const createdCita = await get(
      `SELECT c.*, f.nombre AS familiar_nombre, f.parentesco AS familiar_parentesco, f.color_tag AS familiar_color
       FROM citas c LEFT JOIN familiares f ON c.familiar_id = f.id WHERE c.id = ?`,
      [citaId]
    );
    const createdDocs = await query('SELECT * FROM documentos WHERE cita_id = ?', [citaId]);

    res.status(201).json({
      success: true,
      message: 'Cita creada exitosamente con lista de chequeo.',
      cita: {
        ...createdCita,
        google_calendar_url: generateGoogleCalendarUrl(createdCita),
        documentos: createdDocs
      }
    });
  } catch (err) {
    next(err);
  }
};

// Actualizar cita o asociar a otro familiar
const updateCita = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const citaId = req.params.id;

    const existingCita = await get('SELECT * FROM citas WHERE id = ? AND user_id = ?', [citaId, userId]);
    if (!existingCita) {
      return res.status(404).json({ success: false, error: 'Cita no encontrada.' });
    }

    const { familiar_id, titulo, especialidad, doctor, fecha, hora, lugar, estado, notas } = req.body;

    const newEstado = estado || existingCita.estado;
    if (!['Pendiente', 'Completada', 'Cancelada'].includes(newEstado)) {
      return res.status(400).json({ success: false, error: 'Estado de cita inválido.' });
    }

    await run(
      `UPDATE citas SET
        familiar_id = COALESCE(?, familiar_id),
        titulo = COALESCE(?, titulo),
        especialidad = COALESCE(?, especialidad),
        doctor = COALESCE(?, doctor),
        fecha = COALESCE(?, fecha),
        hora = COALESCE(?, hora),
        lugar = COALESCE(?, lugar),
        estado = ?,
        notas = COALESCE(?, notas)
       WHERE id = ? AND user_id = ?`,
      [familiar_id, titulo, especialidad, doctor, fecha, hora, lugar, newEstado, notas, citaId, userId]
    );

    const updatedCita = await get(
      `SELECT c.*, f.nombre AS familiar_nombre, f.parentesco AS familiar_parentesco, f.color_tag AS familiar_color
       FROM citas c LEFT JOIN familiares f ON c.familiar_id = f.id WHERE c.id = ?`,
      [citaId]
    );
    const documentos = await query('SELECT * FROM documentos WHERE cita_id = ?', [citaId]);

    res.json({
      success: true,
      message: 'Cita actualizada correctamente.',
      cita: {
        ...updatedCita,
        google_calendar_url: generateGoogleCalendarUrl(updatedCita),
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
