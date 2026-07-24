import React, { useState, useEffect } from 'react';
import { X, Users, Plus } from 'lucide-react';
import { api } from '../services/api';

export const CreateAppointmentModal = ({ isOpen, onClose, onSuccess, onOpenFamilyManager }) => {
  const [formData, setFormData] = useState({
    familiar_id: '',
    titulo: '',
    especialidad: 'Medicina General',
    doctor: '',
    fecha: new Date().toISOString().split('T')[0],
    hora: '09:00',
    lugar: '',
    notas: ''
  });

  const [familiares, setFamiliares] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      api.get('/familiares').then(res => {
        if (res.success && res.familiares) {
          setFamiliares(res.familiares);
        }
      }).catch(console.error);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = {
        ...formData,
        familiar_id: formData.familiar_id ? parseInt(formData.familiar_id) : null
      };

      const res = await api.post('/citas', payload);
      if (res.success) {
        onSuccess();
        onClose();
        setFormData({
          familiar_id: '',
          titulo: '',
          especialidad: 'Medicina General',
          doctor: '',
          fecha: new Date().toISOString().split('T')[0],
          hora: '09:00',
          lugar: '',
          notas: ''
        });
      }
    } catch (err) {
      setError(err.message || 'Error al agendar la cita.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>Agendar Nueva Cita</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-sm)', color: '#f87171', fontSize: '0.85rem', marginBottom: '14px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Selector de Miembro del Núcleo Familiar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--secondary)' }}>
                ¿Para quién es la cita? (Paciente)
              </label>
              <button
                type="button"
                onClick={() => { onClose(); onOpenFamilyManager(); }}
                style={{ background: 'none', border: 'none', color: 'var(--primary-hover)', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Plus size={14} />
                <span>Gestionar Familiares</span>
              </button>
            </div>
            <select
              name="familiar_id"
              value={formData.familiar_id}
              onChange={handleChange}
              className="input-field"
              style={{ borderColor: 'var(--border-accent)', background: 'rgba(13, 148, 136, 0.1)' }}
            >
              <option value="">👤 Para mí (Titular de la cuenta)</option>
              {familiares.map((fam) => (
                <option key={fam.id} value={fam.id}>
                  👥 {fam.nombre} ({fam.parentesco})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              Título / Motivo de la Consulta
            </label>
            <input
              type="text"
              name="titulo"
              placeholder="Ej: Chequeo Anual de Cardiología"
              value={formData.titulo}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Especialidad
              </label>
              <select name="especialidad" value={formData.especialidad} onChange={handleChange} className="input-field">
                <option value="Medicina General">Medicina General</option>
                <option value="Cardiología">Cardiología</option>
                <option value="Dermatología">Dermatología</option>
                <option value="Odontología">Odontología</option>
                <option value="Oftalmología">Oftalmología</option>
                <option value="Pediatría">Pediatría</option>
                <option value="Traumatología">Traumatología</option>
                <option value="Otra">Otra</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Médico / Especialista
              </label>
              <input
                type="text"
                name="doctor"
                placeholder="Nombre del doctor"
                value={formData.doctor}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Fecha
              </label>
              <input
                type="date"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Hora
              </label>
              <input
                type="time"
                name="hora"
                value={formData.hora}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              Lugar / Clínica / Dirección
            </label>
            <input
              type="text"
              name="lugar"
              placeholder="Ej: Clínica San José - Piso 3 Consultorio 302"
              value={formData.lugar}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              Notas adicionales (opcional)
            </label>
            <textarea
              name="notas"
              rows={2}
              placeholder="Ej: Ir en ayunas de 8 horas, traer exámenes anteriores."
              value={formData.notas}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button type="button" onClick={onClose} className="btn-secondary" style={{ flex: 1 }}>
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="btn-primary" style={{ flex: 1 }}>
              {loading ? 'Guardando...' : 'Crear Cita'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
