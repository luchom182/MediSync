import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, User, Stethoscope, FileText } from 'lucide-react';
import { api } from '../services/api';

export const CreateAppointmentModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    especialidad: 'Medicina General',
    doctor: '',
    fecha: new Date().toISOString().split('T')[0],
    hora: '09:00',
    lugar: '',
    notas: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      const res = await api.post('/citas', formData);
      if (res.success) {
        onSuccess();
        onClose();
        setFormData({
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
