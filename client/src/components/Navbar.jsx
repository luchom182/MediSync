import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, LogOut, PlusCircle, Users } from 'lucide-react';

export const Navbar = ({ onOpenCreateModal, onOpenFamilyManager }) => {
  const { user, logout } = useAuth();

  return (
    <header className="navbar-header" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 20px',
      borderBottom: '1px solid var(--border-color)',
      background: 'rgba(15, 23, 42, 0.9)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          boxShadow: 'var(--shadow-glow)'
        }}>
          <Calendar size={20} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.1rem', fontWeight: 800, background: 'linear-gradient(90deg, #fff, var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            MediSync
          </h1>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>& Docs Checklist</p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={onOpenFamilyManager}
          className="btn-secondary"
          style={{ padding: '8px 12px', fontSize: '0.82rem', borderColor: 'var(--border-accent)', background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}
          title="Núcleo Familiar"
        >
          <Users size={16} />
          <span>Mi Familia</span>
        </button>

        <button
          onClick={onOpenCreateModal}
          className="btn-primary"
          style={{ padding: '8px 14px', fontSize: '0.85rem' }}
          title="Nueva Cita"
        >
          <PlusCircle size={16} />
          <span>Agendar</span>
        </button>

        <button
          onClick={logout}
          className="btn-secondary"
          style={{ padding: '8px', borderRadius: '10px' }}
          title="Cerrar Sesión"
        >
          <LogOut size={16} color="var(--text-muted)" />
        </button>
      </div>
    </header>
  );
};
