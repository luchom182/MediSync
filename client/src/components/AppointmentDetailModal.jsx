import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, User, Trash2, Edit3 } from 'lucide-react';
import { DocumentChecklist } from './DocumentChecklist';
import { api } from '../services/api';

export const AppointmentDetailModal = ({ citaId, isOpen, onClose, onUpdate }) => {
  const [citaDetail, setCitaDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDetail = async () => {
    if (!citaId) return;
    setLoading(true);
    try {
      const res = await api.get(`/citas/${citaId}`);
      if (res.success && res.cita) {
        setCitaDetail(res.cita);
      }
    } catch (err) {
      setError(err.message || 'Error al cargar detalle de la cita.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && citaId) {
      fetchDetail();
    }
  }, [isOpen, citaId]);

  if (!isOpen) return null;

  const handleStatusChange = async (newEstado) => {
    try {
      await api.put(`/citas/${citaId}`, { estado: newEstado });
      fetchDetail();
      onUpdate();
    } catch (err) {
      alert(err.message || 'Error al cambiar estado.');
    }
  };

  const handleDeleteCita = async () => {
    if (!window.confirm('¿Estás seguro de eliminar esta cita y todos sus documentos asociados?')) return;
    try {
      await api.delete(`/citas/${citaId}`);
      onUpdate();
      onClose();
    } catch (err) {
      alert(err.message || 'Error al eliminar cita.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--secondary)', textTransform: 'uppercase' }}>
            {citaDetail?.especialidad || 'Detalle de Cita'}
          </span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '30px', textAlign: 'center' }}>
            <div className="skeleton" style={{ height: '24px', marginBottom: '12px' }} />
            <div className="skeleton" style={{ height: '16px', width: '60%', margin: '0 auto 12px' }} />
            <div className="skeleton" style={{ height: '80px' }} />
          </div>
        ) : error ? (
          <div style={{ color: '#f87171', padding: '16px', textAlign: 'center' }}>{error}</div>
        ) : citaDetail ? (
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>
              {citaDetail.titulo}
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <User size={16} color="var(--primary)" />
              <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>
                Dr. {citaDetail.doctor}
              </span>
            </div>

            {/* Quick Status Selector */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                ESTADO DE LA CITA
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
                {['Pendiente', 'Completada', 'Cancelada'].map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(st)}
                    style={{
                      padding: '6px 8px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid',
                      cursor: 'pointer',
                      borderColor: citaDetail.estado === st ? 'transparent' : 'var(--border-color)',
                      background: citaDetail.estado === st
                        ? (st === 'Completada' ? 'var(--status-completed)' : st === 'Cancelada' ? 'var(--status-cancelled)' : 'var(--status-pending)')
                        : 'rgba(255,255,255,0.04)',
                      color: citaDetail.estado === st ? '#fff' : 'var(--text-muted)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Date, Time & Location Cards */}
            <div style={{ background: 'rgba(15, 23, 42, 0.5)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '12px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' }}>
                <Calendar size={16} color="var(--secondary)" />
                <span>Fecha: <strong>{citaDetail.fecha}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' }}>
                <Clock size={16} color="var(--secondary)" />
                <span>Hora: <strong>{citaDetail.hora}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' }}>
                <MapPin size={16} color="#f43f5e" />
                <span>Lugar: <strong>{citaDetail.lugar}</strong></span>
              </div>
              {citaDetail.notas && (
                <div style={{ marginTop: '6px', paddingTop: '6px', borderTop: '1px dashed var(--border-color)', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                  <strong>Notas:</strong> {citaDetail.notas}
                </div>
              )}
            </div>

            {/* Document Checklist Component */}
            <DocumentChecklist
              citaId={citaId}
              documentos={citaDetail.documentos}
              onUpdate={() => {
                fetchDetail();
                onUpdate();
              }}
            />

            {/* Actions */}
            <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={handleDeleteCita}
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  color: '#ef4444',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: 'var(--radius-md)',
                  padding: '8px 14px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Trash2 size={16} />
                <span>Eliminar Cita</span>
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
