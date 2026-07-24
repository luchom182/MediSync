import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { AppointmentCard } from '../components/AppointmentCard';
import { CreateAppointmentModal } from '../components/CreateAppointmentModal';
import { AppointmentDetailModal } from '../components/AppointmentDetailModal';
import { FamilyManagerModal } from '../components/FamilyManagerModal';
import { api } from '../services/api';
import { Search, Calendar, PlusCircle, Users } from 'lucide-react';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [citas, setCitas] = useState([]);
  const [familiares, setFamiliares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedFilter, setSelectedFilter] = useState('Todas');
  const [selectedFamiliarFilter, setSelectedFamiliarFilter] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isFamilyModalOpen, setIsFamilyModalOpen] = useState(false);
  const [selectedCitaId, setSelectedCitaId] = useState(null);

  const fetchFamiliares = async () => {
    try {
      const res = await api.get('/familiares');
      if (res.success && res.familiares) {
        setFamiliares(res.familiares);
      }
    } catch (e) {
      console.error('Error fetching familiares:', e);
    }
  };

  const fetchCitas = async () => {
    setLoading(true);
    setError(null);
    try {
      let endpoint = '/citas?';
      if (selectedFilter !== 'Todas') {
        endpoint += `estado=${selectedFilter}&`;
      }
      if (selectedFamiliarFilter !== 'todos') {
        endpoint += `familiar_id=${selectedFamiliarFilter}&`;
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
    fetchFamiliares();
  }, []);

  useEffect(() => {
    fetchCitas();
  }, [selectedFilter, selectedFamiliarFilter]);

  // Client-side search filter by Doctor, Specialty, Title or Family Member Name
  const filteredCitas = citas.filter((c) => {
    const q = searchQuery.toLowerCase();
    const familiarName = (c.familiar_nombre || '').toLowerCase();
    return (
      c.titulo.toLowerCase().includes(q) ||
      c.doctor.toLowerCase().includes(q) ||
      c.especialidad.toLowerCase().includes(q) ||
      familiarName.includes(q)
    );
  });

  const totalCount = citas.length;
  const pendientesCount = citas.filter((c) => c.estado === 'Pendiente').length;
  const completadasCount = citas.filter((c) => c.estado === 'Completada').length;

  return (
    <div className="mobile-app-shell">
      <Navbar
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onOpenFamilyManager={() => setIsFamilyModalOpen(true)}
      />

      <main style={{ padding: '16px', flex: 1 }}>
        {/* Welcome Section */}
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
              Hola, {user?.nombre || 'Cabeza de Hogar'} 👋
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Gestionas la salud y citas de tu grupo familiar.
            </p>
          </div>
          <button
            onClick={() => setIsFamilyModalOpen(true)}
            style={{
              background: 'rgba(99, 102, 241, 0.15)',
              color: '#818cf8',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '6px 10px',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Users size={14} />
            <span>{familiares.length} Familiares</span>
          </button>
        </div>

        {/* Stats Chips */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '16px' }}>
          <div className="glass-card" style={{ padding: '10px 12px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>TOTAL CITAS</span>
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
        <div style={{ position: 'relative', marginBottom: '12px' }}>
          <Search size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Buscar por familiar, médico o especialidad..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field"
            style={{ paddingLeft: '38px', fontSize: '0.88rem' }}
          />
        </div>

        {/* Filter Chips por Núcleo Familiar */}
        <div style={{ marginBottom: '10px' }}>
          <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>
            FILTRAR POR PACIENTE
          </label>
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
            <button
              onClick={() => setSelectedFamiliarFilter('todos')}
              style={{
                padding: '5px 12px',
                fontSize: '0.78rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-full)',
                border: '1px solid',
                borderColor: selectedFamiliarFilter === 'todos' ? 'transparent' : 'var(--border-color)',
                background: selectedFamiliarFilter === 'todos' ? 'var(--primary)' : 'rgba(30, 41, 59, 0.6)',
                color: selectedFamiliarFilter === 'todos' ? '#fff' : 'var(--text-muted)',
                whiteSpace: 'nowrap',
                cursor: 'pointer'
              }}
            >
              👥 Todos
            </button>
            <button
              onClick={() => setSelectedFamiliarFilter('titular')}
              style={{
                padding: '5px 12px',
                fontSize: '0.78rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-full)',
                border: '1px solid',
                borderColor: selectedFamiliarFilter === 'titular' ? 'transparent' : 'var(--border-color)',
                background: selectedFamiliarFilter === 'titular' ? 'var(--primary)' : 'rgba(30, 41, 59, 0.6)',
                color: selectedFamiliarFilter === 'titular' ? '#fff' : 'var(--text-muted)',
                whiteSpace: 'nowrap',
                cursor: 'pointer'
              }}
            >
              👤 Mis Citas (Titular)
            </button>
            {familiares.map((fam) => (
              <button
                key={fam.id}
                onClick={() => setSelectedFamiliarFilter(fam.id.toString())}
                style={{
                  padding: '5px 12px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid',
                  borderColor: selectedFamiliarFilter === fam.id.toString() ? 'transparent' : 'var(--border-color)',
                  background: selectedFamiliarFilter === fam.id.toString() ? fam.color_tag || 'var(--primary)' : 'rgba(30, 41, 59, 0.6)',
                  color: '#fff',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer'
                }}
              >
                👥 {fam.nombre} ({fam.parentesco})
              </button>
            ))}
          </div>
        </div>

        {/* Filter Tabs por Estado de Cita */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '6px', marginBottom: '16px' }}>
          {['Todas', 'Pendiente', 'Completada', 'Cancelada'].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              style={{
                padding: '5px 12px',
                fontSize: '0.78rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-full)',
                border: '1px solid',
                borderColor: selectedFilter === filter ? 'transparent' : 'var(--border-color)',
                background: selectedFilter === filter ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'rgba(30, 41, 59, 0.4)',
                color: selectedFilter === filter ? '#fff' : 'var(--text-muted)',
                whiteSpace: 'nowrap',
                cursor: 'pointer'
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
              {searchQuery ? 'Prueba con otra búsqueda.' : 'Agenda citas para ti o para los miembros de tu núcleo familiar.'}
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
        onSuccess={() => { fetchCitas(); fetchFamiliares(); }}
        onOpenFamilyManager={() => setIsFamilyModalOpen(true)}
      />

      <AppointmentDetailModal
        citaId={selectedCitaId}
        isOpen={!!selectedCitaId}
        onClose={() => setSelectedCitaId(null)}
        onUpdate={fetchCitas}
      />

      <FamilyManagerModal
        isOpen={isFamilyModalOpen}
        onClose={() => setIsFamilyModalOpen(false)}
        onUpdate={() => { fetchFamiliares(); fetchCitas(); }}
      />
    </div>
  );
};
