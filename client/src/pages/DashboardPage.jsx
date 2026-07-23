import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { AppointmentCard } from '../components/AppointmentCard';
import { CreateAppointmentModal } from '../components/CreateAppointmentModal';
import { AppointmentDetailModal } from '../components/AppointmentDetailModal';
import { api } from '../services/api';
import { Search, Filter, Calendar, CheckCircle2, Clock, PlusCircle } from 'lucide-react';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCitaId, setSelectedCitaId] = useState(null);

  const fetchCitas = async () => {
    setLoading(true);
    setError(null);
    try {
      let endpoint = '/citas';
      if (selectedFilter !== 'Todas') {
        endpoint += `?estado=${selectedFilter}`;
      }
      const res = await api.get(endpoint);
      if (res.success && res.citas) {
        setCitas(res.citas);
      }
    } catch (err) {
      setError(err.message || 'Error al cargar tus citas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCitas();
  }, [selectedFilter]);

  // Client-side search filter by Doctor or Specialty or Title
  const filteredCitas = citas.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.titulo.toLowerCase().includes(q) ||
      c.doctor.toLowerCase().includes(q) ||
      c.especialidad.toLowerCase().includes(q)
    );
  });

  const totalCount = citas.length;
  const pendientesCount = citas.filter((c) => c.estado === 'Pendiente').length;
  const completadasCount = citas.filter((c) => c.estado === 'Completada').length;

  return (
    <div className="mobile-app-shell">
      <Navbar onOpenCreateModal={() => setIsCreateModalOpen(true)} />

      <main style={{ padding: '16px', flex: 1 }}>
        {/* Welcome Section */}
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
            Hola, {user?.nombre || 'Paciente'} 👋
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Tienes {pendientesCount} {pendientesCount === 1 ? 'cita pendiente' : 'citas pendientes'} y documentos por verificar.
          </p>
        </div>

        {/* Stats Chips */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '16px' }}>
          <div className="glass-card" style={{ padding: '10px 12px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>TOTAL</span>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>{totalCount}</span>
          </div>
          <div className="glass-card" style={{ padding: '10px 12px', textAlign: 'center', borderColor: 'rgba(245, 158, 11, 0.3)' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--status-pending)', display: 'block', fontWeight: 600 }}>PENDIENTES</span>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--status-pending)' }}>{pendientesCount}</span>
          </div>
          <div className="glass-card" style={{ padding: '10px 12px', textAlign: 'center', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--status-completed)', display: 'block', fontWeight: 600 }}>LISTAS</span>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--status-completed)' }}>{completadasCount}</span>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ position: 'relative', marginBottom: '14px' }}>
          <Search size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Buscar por médico, especialidad o título..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field"
            style={{ paddingLeft: '38px', fontSize: '0.88rem' }}
          />
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '6px', marginBottom: '16px' }}>
          {['Todas', 'Pendiente', 'Completada', 'Cancelada'].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              style={{
                padding: '6px 14px',
                fontSize: '0.8rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-full)',
                border: '1px solid',
                borderColor: selectedFilter === filter ? 'transparent' : 'var(--border-color)',
                background: selectedFilter === filter ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'rgba(30, 41, 59, 0.6)',
                color: selectedFilter === filter ? '#fff' : 'var(--text-muted)',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Appointments List */}
        {loading ? (
          <div>
            <div className="glass-card skeleton" style={{ height: '140px', marginBottom: '12px' }} />
            <div className="glass-card skeleton" style={{ height: '140px', marginBottom: '12px' }} />
          </div>
        ) : error ? (
          <div className="glass-card" style={{ textAlign: 'center', color: '#f87171', padding: '24px' }}>
            <p>{error}</p>
            <button onClick={fetchCitas} className="btn-secondary" style={{ marginTop: '10px' }}>
              Reintentar
            </button>
          </div>
        ) : filteredCitas.length > 0 ? (
          filteredCitas.map((cita) => (
            <AppointmentCard
              key={cita.id}
              cita={cita}
              onClick={(c) => setSelectedCitaId(c.id)}
            />
          ))
        ) : (
          <div className="glass-card" style={{ textAlign: 'center', padding: '36px 20px' }}>
            <Calendar size={40} color="var(--text-dim)" style={{ marginBottom: '10px' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
              No hay citas encontradas
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              {searchQuery ? 'Prueba con otra búsqueda o limpia el filtro.' : 'Agenda tu primera cita médica con lista de chequeo.'}
            </p>
            <button onClick={() => setIsCreateModalOpen(true)} className="btn-primary" style={{ margin: '0 auto' }}>
              <PlusCircle size={16} />
              <span>Agendar Nueva Cita</span>
            </button>
          </div>
        )}
      </main>

      {/* Modals */}
      <CreateAppointmentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchCitas}
      />

      <AppointmentDetailModal
        citaId={selectedCitaId}
        isOpen={!!selectedCitaId}
        onClose={() => setSelectedCitaId(null)}
        onUpdate={fetchCitas}
      />
    </div>
  );
};
