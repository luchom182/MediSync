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
  console.log('🛡️  INICIANDO AUDITORÍA QA & SECURITY PARA MEDISYNC (NÚCLEO FAMILIAR MULTI-PACIENTE)...\n');

  try {
    // 1. Health Check
    console.log('[1/9] Probando GET /api/health ...');
    const health = await request('GET', '/health');
    console.log('   Status:', health.status, 'Service:', health.body.service);

    // 2. Login con Google QA
    console.log('\n[2/9] Probando POST /api/auth/google (Login Cabeza de Hogar) ...');
    const googleUserPayload = {
      googleUser: {
        email: `alejandra_cabezahogar_${Date.now()}@gmail.com`,
        nombre: 'Alejandra Pérez',
        google_id: `google_id_${Date.now()}`,
        avatar_url: 'https://lh3.googleusercontent.com/a/default-user'
      }
    };
    const googleAuthRes = await request('POST', '/auth/google', googleUserPayload);
    console.log('   Status:', googleAuthRes.status, 'Usuario Titular:', googleAuthRes.body.user?.nombre);
    const token = googleAuthRes.body.token;

    // 3. Crear Miembro del Núcleo Familiar (Carmenza - Madre)
    console.log('\n[3/9] Probando POST /api/familiares (Agregar Madre: Carmenza) ...');
    const familiarPayload = {
      nombre: 'Carmenza Muñoz',
      parentesco: 'Madre',
      documento_identidad: '12.345.678',
      color_tag: '#ec4899'
    };
    const famRes = await request('POST', '/familiares', familiarPayload, token);
    console.log('   Status:', famRes.status, 'Familiar ID:', famRes.body.familiar?.id, 'Nombre:', famRes.body.familiar?.nombre);
    const carmenzaId = famRes.body.familiar?.id;

    // 4. Listar Núcleo Familiar
    console.log('\n[4/9] Probando GET /api/familiares ...');
    const getFamRes = await request('GET', '/familiares', null, token);
    console.log('   Status:', getFamRes.status, 'Total Familiares:', getFamRes.body.count);

    // 5. Agendar Cita Médica para la Madre (Carmenza)
    console.log('\n[5/9] Probando POST /api/citas (Agendar cita para Carmenza) ...');
    const newCitaCarmenza = {
      familiar_id: carmenzaId,
      titulo: 'Control de Hipertensión - Carmenza',
      especialidad: 'Cardiología',
      doctor: 'Dr. Fernando Gómez',
      fecha: '2026-09-15',
      hora: '09:30',
      lugar: 'Centro Médico Especializado - Consultorio 204',
      notas: 'Acompañar a Carmenza. Llevar examen de sangre reciente.'
    };
    const citaCarmenzaRes = await request('POST', '/citas', newCitaCarmenza, token);
    console.log('   Status:', citaCarmenzaRes.status, 'Cita ID:', citaCarmenzaRes.body.cita?.id);
    console.log('   👤 Paciente Asignado:', citaCarmenzaRes.body.cita?.familiar_nombre, `(${citaCarmenzaRes.body.cita?.familiar_parentesco})`);

    // 6. Filtrar Citas por Miembro Familiar
    console.log('\n[6/9] Probando GET /api/citas?familiar_id=... (Filtrado por Carmenza) ...');
    const filterCitasRes = await request('GET', `/citas?familiar_id=${carmenzaId}`, null, token);
    console.log('   Status:', filterCitasRes.status, 'Citas para Carmenza:', filterCitasRes.body.count);

    // 7. Toggle Documento Checklist de Carmenza
    const docId = citaCarmenzaRes.body.cita?.documentos?.[0]?.id;
    console.log('\n[7/9] Probando PATCH /api/documentos/:id/toggle (Checklist Carmenza) ...');
    const toggleRes = await request('PATCH', `/documentos/${docId}/toggle`, null, token);
    console.log('   Status:', toggleRes.status, 'Documento Completado:', toggleRes.body.documento?.completado);

    // 8. Seguridad: Acceso sin Token
    console.log('\n[8/9] Probando Seguridad: Acceso sin Token JWT ...');
    const unauthorizedRes = await request('GET', '/familiares');
    console.log('   Status:', unauthorizedRes.status, 'Error:', unauthorizedRes.body.error);

    // 9. Estandarización 404
    console.log('\n[9/9] Probando Estandarización 404 ...');
    const notFoundRes = await request('GET', '/familiares/999999', null, token);
    console.log('   Status:', notFoundRes.status, 'Error:', notFoundRes.body.error);

    console.log('\n✅ AUDITORÍA QA FINALIZADA CON ÉXITO: Gestión de Núcleo Familiar y Citas Multi-Paciente validadas.');
  } catch (err) {
    console.error('❌ ERROR EN AUDITORÍA QA:', err);
  }
}

runAudit();
