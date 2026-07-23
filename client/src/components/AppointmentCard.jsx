import React from 'react';
import { Calendar, Clock, MapPin, UserCheck, FileCheck } from 'lucide-react';

export const AppointmentCard = ({ cita, onClick }) => {
  const totalDocs = cita.total_documentos || 0;
  const completedDocs = cita.documentos_completados || 0;
  const progressPercentage = totalDocs > 0 ? Math.round((completedDocs / totalDocs) * 100) : 0;

  const getBadgeClass = (estado) => {
    switch (estado) {
      case 'Completada': return 'badge-completada';
      case 'Cancelada': return 'badge-cancelada';
      default: return 'badge-pendiente';
    }
  };

  return (
    <div 
      className="glass-card" 
      onClick={() => onClick(cita)}
      style={{ cursor: 'pointer', marginBottom: '14px', position: 'relative' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {cita.especialidad}
          </span>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginTop: '2px' }}>
            {cita.titulo}
          </h3>
        </div>
        <span className={`badge ${getBadgeClass(cita.estado)}`}>
          {cita.estado}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <UserCheck size={15} color="var(--primary)" />
          <span>Dr. {cita.doctor}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={15} color="var(--secondary)" />
            <span>{cita.fecha}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={15} color="var(--secondary)" />
            <span>{cita.hora}</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <MapPin size={15} color="#f43f5e" />
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '300px' }}>
            {cita.lugar}
          </span>
        </div>
      </div>

      {/* Progress Bar for Documents Checklist */}
      <div style={{ paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', marginBottom: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)' }}>
            <FileCheck size={14} color={progressPercentage === 100 ? 'var(--status-completed)' : 'var(--text-muted)'} />
            <span>Checklist Documentos</span>
          </div>
          <span style={{ fontWeight: 700, color: progressPercentage === 100 ? 'var(--status-completed)' : 'var(--text-main)' }}>
            {completedDocs} / {totalDocs} ({progressPercentage}%)
          </span>
        </div>
        <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
          <div 
            style={{ 
              width: `${progressPercentage}%`, 
              height: '100%', 
              background: progressPercentage === 100 ? 'var(--status-completed)' : 'linear-gradient(90deg, var(--primary), var(--secondary))',
              transition: 'width 0.4s ease'
            }} 
          />
        </div>
      </div>
    </div>
  );
};
