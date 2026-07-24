import React, { useState, useEffect } from 'react';
import { X, Users, UserPlus, Trash2, Tag, ShieldAlert } from 'lucide-react';
import { api } from '../services/api';

export const FamilyManagerModal = ({ isOpen, onClose, onUpdate }) => {
  const [familiares, setFamiliares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nombre: '',
    parentesco: 'Madre',
    documento_identidad: '',
    color_tag: '#ec4899'
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const fetchFamiliares = async () => {
    setLoading(true);
    try {
      const res = await api.get('/familiares');
      if (res.success && res.familiares) {
        setFamiliares(res.familiares);
      }
    } catch (err) {
      setError(err.message || 'Error al cargar miembros del grupo familiar.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchFamiliares();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddFamiliar = async (e) => {
    e.preventDefault();
    if (!formData.nombre.trim()) return;

    setSubmitting(true);
    setError(null);
    try {
      const res = await api.post('/familiares', formData);
      if (res.success) {
        setFormData({
          nombre: '',
          parentesco: 'Madre',
          documento_identidad: '',
          color_tag: '#ec4899'
        });
        fetchFamiliares();
        onUpdate();
      }
    } catch (err) {
      setError(err.message || 'Error al agregar familiar.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar a este miembro del grupo familiar? Sus citas seguirán guardadas.')) return;
    try {
      await api.delete(`/familiares/${id}`);
      fetchFamiliares();
      onUpdate();
    } catch (err) {
      alert(err.message || 'Error al eliminar familiar.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={22} color="var(--primary)" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>Núcleo Familiar</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
          Administra las personas a tu cargo (madre, cónyuge, hijos) para agendar sus citas médicas y llevar su checklist de documentos.
        </p>

        {error && (
          <div style={{ padding: '10px 14px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-md)', color: '#f87171', fontSize: '0.85rem', marginBottom: '14px' }}>
            {error}
          </div>
        )}

        {/* Lista de Miembros Actuales */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '10px' }}>
            Miembros Registrados ({familiares.length})
          </h4>

          {loading ? (
            <div className="skeleton" style={{ height: '60px' }} />
          ) : familiares.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {familiares.map((fam) => (
                <div
                  key={fam.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid var(--border-color)',
                    borderLeft: `4px solid ${fam.color_tag || 'var(--primary)'}`,
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  <div>
                    <h5 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>
                      {fam.nombre}
                    </h5>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      <span style={{ background: `${fam.color_tag}25`, color: fam.color_tag, padding: '2px 8px', borderRadius: 'var(--radius-full)', fontWeight: 700 }}>
                        {fam.parentesco}
                      </span>
                      {fam.documento_identidad && <span>Doc: {fam.documento_identidad}</span>}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(fam.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: '6px' }}
                    title="Eliminar miembro"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontStyle: 'italic', textAlign: 'center', padding: '12px' }}>
              Aún no has registrado familiares. Agrega a tu madre, esposo o hijos a continuación.
            </p>
          )}
        </div>

        {/* Formulario para Agregar Nuevo Miembro */}
        <form onSubmit={handleAddFamiliar} style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <UserPlus size={16} color="var(--primary)" />
            <span>Agregar Nuevo Familiar</span>
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Nombre Completo *
              </label>
              <input
                type="text"
                name="nombre"
                placeholder="Ej: Carmenza Muñoz"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Parentesco *
                </label>
                <select name="parentesco" value={formData.parentesco} onChange={handleChange} className="input-field">
                  <option value="Madre">Madre</option>
                  <option value="Padre">Padre</option>
                  <option value="Cónyuge">Cónyuge / Esposo(a)</option>
                  <option value="Hijo/a">Hijo / Hija</option>
                  <option value="Hermano/a">Hermano / Hermana</option>
                  <option value="Abuelo/a">Abuelo / Abuela</option>
                  <option value="Otro">Otro Familiar</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Cédula / DNI (Opcional)
                </label>
                <input
                  type="text"
                  name="documento_identidad"
                  placeholder="Número de doc."
                  value={formData.documento_identidad}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
            </div>

            <button type="submit" disabled={submitting || !formData.nombre.trim()} className="btn-primary" style={{ marginTop: '6px', padding: '10px' }}>
              {submitting ? 'Guardando...' : 'Guardar Familiar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
