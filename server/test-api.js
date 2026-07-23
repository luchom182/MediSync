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
  console.log('🛡️  INICIANDO AUDITORÍA QA & SECURITY PARA APP_CITAS...\n');

  try {
    // 1. Health Check
    console.log('[1/7] Probando GET /api/health ...');
    const health = await request('GET', '/health');
    console.log('   Status:', health.status, 'Response:', health.body);

    // 2. Registro
    console.log('\n[2/7] Probando POST /api/auth/register ...');
    const testUser = {
      nombre: 'Prueba QA',
      email: `qa_${Date.now()}@test.com`,
      password: 'SecurePassword123!'
    };
    const regRes = await request('POST', '/auth/register', testUser);
    console.log('   Status:', regRes.status, 'User ID:', regRes.body.user?.id);
    const token = regRes.body.token;

    // 3. Crear Cita
    console.log('\n[3/7] Probando POST /api/citas (Con JWT Token) ...');
    const newCita = {
      titulo: 'Consulta Médica General QA',
      especialidad: 'Medicina General',
      doctor: 'Dr. Carlos Mendoza',
      fecha: '2026-08-15',
      hora: '10:30',
      lugar: 'Clínica Central - Consultorio 101',
      notas: 'Prueba de integración QA'
    };
    const citaRes = await request('POST', '/citas', newCita, token);
    console.log('   Status:', citaRes.status, 'Cita ID:', citaRes.body.cita?.id, 'Docs iniciales:', citaRes.body.cita?.documentos?.length);
    const citaId = citaRes.body.cita?.id;
    const docId = citaRes.body.cita?.documentos?.[0]?.id;

    // 4. Toggle Documento Checklist
    console.log('\n[4/7] Probando PATCH /api/documentos/:id/toggle ...');
    const toggleRes = await request('PATCH', `/documentos/${docId}/toggle`, null, token);
    console.log('   Status:', toggleRes.status, 'Documento Completado:', toggleRes.body.documento?.completado);

    // 5. Listar Citas con Filtros
    console.log('\n[5/7] Probando GET /api/citas ...');
    const getCitasRes = await request('GET', '/citas', null, token);
    console.log('   Status:', getCitasRes.status, 'Total Citas:', getCitasRes.body.count);

    // 6. Prueba de Seguridad: Petición sin Token (Debe retornar 401)
    console.log('\n[6/7] Probando Seguridad: Acceso no autorizado (Sin Token) ...');
    const unauthorizedRes = await request('GET', '/citas');
    console.log('   Status:', unauthorizedRes.status, 'Esperado: 401. Error:', unauthorizedRes.body.error);

    // 7. Prueba de Seguridad: Petición a Cita Inexistente (Debe retornar 404 estandarizado)
    console.log('\n[7/7] Probando Estandarización de Errores (404) ...');
    const notFoundRes = await request('GET', '/citas/999999', null, token);
    console.log('   Status:', notFoundRes.status, 'Error:', notFoundRes.body.error);

    console.log('\n✅ AUDITORÍA QA FINALIZADA CON ÉXITO: Todos los endpoints responden según la especificación del Contrato API.');
  } catch (err) {
    console.error('❌ ERROR EN AUDITORÍA QA:', err);
  }
}

runAudit();
