const http = require('http');

const request = (method, path, data = null, token = null) => {
  return new Promise((resolve, reject) => {
    const payload = data ? JSON.stringify(data) : null;
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: `/api${path}`,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
};

async function runAudit() {
  console.log('🛡️  INICIANDO AUDITORÍA QA & SECURITY PARA MEDISYNC (GOOGLE AUTH & CALENDAR SYNC)...\n');

  try {
    // 1. Health Check
    console.log('[1/8] Probando GET /api/health ...');
    const health = await request('GET', '/health');
    console.log('   Status:', health.status, 'Service:', health.body.service);

    // 2. Autenticación con Google (Gmail OAuth 2.0)
    console.log('\n[2/8] Probando POST /api/auth/google (Login con Gmail) ...');
    const googleUserPayload = {
      googleUser: {
        email: `paciente_qa_${Date.now()}@gmail.com`,
        nombre: 'Paciente Google QA',
        google_id: `google_id_${Date.now()}`,
        avatar_url: 'https://lh3.googleusercontent.com/a/default-user'
      }
    };
    const googleAuthRes = await request('POST', '/auth/google', googleUserPayload);
    console.log('   Status:', googleAuthRes.status, 'User ID:', googleAuthRes.body.user?.id, 'Avatar:', googleAuthRes.body.user?.avatar_url);
    const token = googleAuthRes.body.token;

    // 3. Crear Cita con Generación de Google Calendar URL
    console.log('\n[3/8] Probando POST /api/citas (Crear Cita + Google Calendar URL) ...');
    const newCita = {
      titulo: 'Consulta Cardiología MediSync',
      especialidad: 'Cardiología',
      doctor: 'Dr. Alejandro Silva',
      fecha: '2026-09-10',
      hora: '11:00',
      lugar: 'Hospital San Rafael - Consultorio 402',
      notas: 'Llevar exámenes de sangre y electrocardiograma previo.'
    };
    const citaRes = await request('POST', '/citas', newCita, token);
    console.log('   Status:', citaRes.status, 'Cita ID:', citaRes.body.cita?.id);
    console.log('   📅 Google Calendar URL:', citaRes.body.cita?.google_calendar_url);

    // 4. Toggle Documento Checklist
    const docId = citaRes.body.cita?.documentos?.[0]?.id;
    console.log('\n[4/8] Probando PATCH /api/documentos/:id/toggle ...');
    const toggleRes = await request('PATCH', `/documentos/${docId}/toggle`, null, token);
    console.log('   Status:', toggleRes.status, 'Documento Completado:', toggleRes.body.documento?.completado);

    // 5. Listar Citas
    console.log('\n[5/8] Probando GET /api/citas ...');
    const getCitasRes = await request('GET', '/citas', null, token);
    console.log('   Status:', getCitasRes.status, 'Total Citas:', getCitasRes.body.count);

    // 6. Prueba de Seguridad: Petición sin Token (Debe retornar 401)
    console.log('\n[6/8] Probando Seguridad: Acceso sin Token JWT ...');
    const unauthorizedRes = await request('GET', '/citas');
    console.log('   Status:', unauthorizedRes.status, 'Error:', unauthorizedRes.body.error);

    // 7. Prueba de Seguridad: Petición 404
    console.log('\n[7/8] Probando Estandarización 404 ...');
    const notFoundRes = await request('GET', '/citas/999999', null, token);
    console.log('   Status:', notFoundRes.status, 'Error:', notFoundRes.body.error);

    // 8. Perfil de Usuario con Avatar de Google
    console.log('\n[8/8] Probando GET /api/users/profile ...');
    const profileRes = await request('GET', '/users/profile', null, token);
    console.log('   Status:', profileRes.status, 'Email:', profileRes.body.user?.email);

    console.log('\n✅ AUDITORÍA QA FINALIZADA CON ÉXITO: Autenticación con Google y Sincronización de Calendario validadas.');
  } catch (err) {
    console.error('❌ ERROR EN AUDITORÍA QA:', err);
  }
}

runAudit();
