import React, { useState } from 'react';
import { CheckSquare, Square, Plus, Trash2, Tag } from 'lucide-react';
import { api } from '../services/api';

export const DocumentChecklist = ({ citaId, documentos, onUpdate }) => {
  const [newDocName, setNewDocName] = useState('');
  const [newDocCategory, setNewDocCategory] = useState('Examen');
  const [loading, setLoading] = useState(false);

  const handleToggle = async (docId, e) => {
    e.stopPropagation();
    try {
      await api.patch(`/documentos/${docId}/toggle`);
      onUpdate();
    } catch (err) {
      alert(err.message || 'Error al actualizar documento.');
    }
  };

  const handleAddDocument = async (e) => {
    e.preventDefault();
    if (!newDocName.trim()) return;

    setLoading(true);
    try {
      await api.post(`/citas/${citaId}/documentos`, {
        nombre: newDocName,
        categoria: newDocCategory
      });
      setNewDocName('');
      onUpdate();
    } catch (err) {
      alert(err.message || 'Error al añadir documento.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (docId, e) => {
    e.stopPropagation();
    if (!window.confirm('¿Eliminar este requisito de la lista?')) return;
    try {
      await api.delete(`/documentos/${docId}`);
      onUpdate();
    } catch (err) {
      alert(err.message || 'Error al eliminar documento.');
    }
  };

  return (
    <div style={{ marginTop: '16px' }}>
      <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        Checklist de Requisitos y Exámenes
      </h4>

      <div style={{ marginBottom: '14px' }}>
        {documentos && documentos.length > 0 ? (
          documentos.map((doc) => (
            <div
              key={doc.id}
              className={`checklist-item ${doc.completado ? 'completed' : ''}`}
              onClick={(e) => handleToggle(doc.id, e)}
              style={{ cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                {doc.completado ? (
                  <CheckSquare size={20} color="var(--status-completed)" />
                ) : (
                  <Square size={20} color="var(--text-dim)" />
                )}
                <div>
                  <span className="item-text" style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                    {doc.nombre}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                    <Tag size={11} color="var(--secondary)" />
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{doc.categoria}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={(e) => handleDelete(doc.id, e)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-dim)',
                  cursor: 'pointer',
                  padding: '6px'
                }}
                title="Eliminar requisito"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        ) : (
          <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontStyle: 'italic', textAlign: 'center', padding: '12px' }}>
            No hay documentos registrados para esta cita.
          </p>
        )}
      </div>

      {/* Agregar nuevo documento inline form */}
      <form onSubmit={handleAddDocument} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Añadir nuevo requisito o examen..."
          value={newDocName}
          onChange={(e) => setNewDocName(e.target.value)}
          className="input-field"
          style={{ padding: '8px 12px', fontSize: '0.85rem' }}
        />
        <select
          value={newDocCategory}
          onChange={(e) => setNewDocCategory(e.target.value)}
          className="input-field"
          style={{ width: '110px', padding: '8px', fontSize: '0.8rem' }}
        >
          <option value="Examen">Examen</option>
          <option value="Identificación">ID</option>
          <option value="Orden Médica">Orden</option>
          <option value="Requisito">Otro</option>
        </select>
        <button
          type="submit"
          className="btn-primary"
          disabled={loading || !newDocName.trim()}
          style={{ padding: '8px 12px', height: '36px' }}
        >
          <Plus size={16} />
        </button>
      </form>
    </div>
  );
};
