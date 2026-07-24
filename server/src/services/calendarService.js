const { google } = require('googleapis');

/**
 * Genera un enlace de 1 Clic para agregar la cita médica directamente a Google Calendar.
 * Funciona de inmediato en Web, Android e iOS sin requerir credenciales adicionales.
 */
const generateGoogleCalendarUrl = (cita) => {
  const { titulo, especialidad, doctor, fecha, hora, lugar, notas } = cita;

  // Formatear fechas de inicio y fin (asumiendo 1 hora de duración para la consulta)
  // fecha: YYYY-MM-DD, hora: HH:mm
  const [year, month, day] = fecha.split('-');
  const [hours, minutes] = hora.split(':');

  const startDate = new Date(Date.UTC(year, month - 1, day, hours, minutes));
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // +1 hora

  const formatUTC = (d) => d.toISOString().replace(/-|:|\.\d+/g, '');

  const datesParam = `${formatUTC(startDate)}/${formatUTC(endDate)}`;

  const titleParam = encodeURIComponent(`🏥 Cita Médica: ${titulo} (${especialidad})`);
  const detailsParam = encodeURIComponent(`Dr. ${doctor}\n\nNotas: ${notas || 'Sin notas adicionales.'}\n\nAgendado vía MediSync`);
  const locationParam = encodeURIComponent(lugar);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${titleParam}&dates=${datesParam}&details=${detailsParam}&location=${locationParam}`;
};

/**
 * Sincronización directa vía Google Calendar API (Servicio en Servidor)
 * Inserta el evento directamente en el calendario del usuario si se cuenta con Access Token.
 */
const syncToGoogleCalendarAPI = async (cita, accessToken) => {
  if (!accessToken) return null;

  try {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });

    const calendar = google.calendar({ version: 'v3', auth });

    const [year, month, day] = cita.fecha.split('-');
    const [hours, minutes] = cita.hora.split(':');

    const startISO = new Date(year, month - 1, day, hours, minutes).toISOString();
    const endISO = new Date(new Date(startISO).getTime() + 60 * 60 * 1000).toISOString();

    const event = {
      summary: `🏥 Cita Médica: ${cita.titulo} (${cita.especialidad})`,
      location: cita.lugar,
      description: `Dr. ${cita.doctor}\nNotas: ${cita.notas || 'N/A'}\n\nRecordatorio creado desde MediSync`,
      start: { dateTime: startISO, timeZone: 'America/Bogota' },
      end: { dateTime: endISO, timeZone: 'America/Bogota' },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'popup', minutes: 24 * 60 }, // Recordatorio 24 horas antes
          { method: 'popup', minutes: 60 }       // Recordatorio 1 hora antes
        ]
      }
    };

    const res = await calendar.events.insert({
      calendarId: 'primary',
      resource: event
    });

    return res.data.id;
  } catch (err) {
    console.error('[GOOGLE CALENDAR API ERROR]:', err.message);
    return null;
  }
};

module.exports = {
  generateGoogleCalendarUrl,
  syncToGoogleCalendarAPI
};
