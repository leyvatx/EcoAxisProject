import React, { useState, useEffect } from 'react';
import { useTecnicoAuth } from '../contexts/TecnicoAuthContext';
import './TecnicoMantenimientos.css';

const TecnicoMantenimientos = () => {
  const { tecnico } = useTecnicoAuth();
  const [mantenimientos, setMantenimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tipoFiltro, setTipoFiltro] = useState('todos');

  useEffect(() => {
    const mantenimientosDemo = [
      {
        id: 1,
        codigo: 'MNT-2024-001',
        equipo: 'Aire Acondicionado VRF',
        cliente: 'Hospital Central',
        ubicacion: 'UCI - Piso 4',
        tipo: 'preventivo',
        frecuencia: 'trimestral',
        ultima_fecha: '2023-10-15',
        proxima_fecha: '2024-01-15',
        estado: 'programado',
        prioridad: 'alta',
        duracion_estimada: '4 horas',
        tecnico_asignado: 'Efrain Leyva'
      },
      {
        id: 2,
        codigo: 'MNT-2024-002',
        equipo: 'Sistema de Ventilación',
        cliente: 'Centro Comercial Plaza',
        ubicacion: 'Área de Comidas',
        tipo: 'correctivo',
        frecuencia: 'bajo_demanda',
        ultima_fecha: '2024-01-10',
        proxima_fecha: null,
        estado: 'en_progreso',
        prioridad: 'media',
        duracion_estimada: '2 horas',
        tecnico_asignado: 'Efrain Leyva'
      },
      {
        id: 3,
        codigo: 'MNT-2024-003',
        equipo: 'Bomba de Calor Industrial',
        cliente: 'Fábrica TextilCorp',
        ubicacion: 'Planta de Producción',
        tipo: 'predictivo',
        frecuencia: 'mensual',
        ultima_fecha: '2024-01-05',
        proxima_fecha: '2024-02-05',
        estado: 'completado',
        prioridad: 'baja',
        duracion_estimada: '6 horas',
        tecnico_asignado: 'Efrain Leyva'
      }
    ];
    
    setTimeout(() => {
      setMantenimientos(mantenimientosDemo);
      setLoading(false);
    }, 1000);
  }, []);

  const filtrarMantenimientos = (mantenimientos, tipo) => {
    if (tipo === 'todos') return mantenimientos;
    return mantenimientos.filter(mant => mant.tipo === tipo);
  };

  const getTipoColor = (tipo) => {
    switch (tipo) {
      case 'preventivo': return '#3b82f6';
      case 'correctivo': return '#ef4444';
      case 'predictivo': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'programado': return '#f59e0b';
      case 'en_progreso': return '#3b82f6';
      case 'completado': return '#10b981';
      case 'cancelado': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getPrioridadColor = (prioridad) => {
    switch (prioridad) {
      case 'alta': return '#ef4444';
      case 'media': return '#f59e0b';
      case 'baja': return '#10b981';
      default: return '#6b7280';
    }
  };

  const mantenimientosFiltrados = filtrarMantenimientos(mantenimientos, tipoFiltro);

  if (loading) {
    return (
      <div className="mantenimientos-loading">
        <div className="spinner"></div>
        <p>Cargando mantenimientos...</p>
      </div>
    );
  }

  return (
    <div className="tecnico-mantenimientos">
      <div className="mantenimientos-header">
        <div className="header-title">
          <h1>🔧 Mantenimientos</h1>
          <p>Gestiona mantenimientos preventivos, correctivos y predictivos</p>
        </div>
        <div className="header-stats">
          <div className="stat-card preventivo">
            <span className="stat-number">{mantenimientos.filter(m => m.tipo === 'preventivo').length}</span>
            <span className="stat-label">Preventivos</span>
          </div>
          <div className="stat-card correctivo">
            <span className="stat-number">{mantenimientos.filter(m => m.tipo === 'correctivo').length}</span>
            <span className="stat-label">Correctivos</span>
          </div>
          <div className="stat-card predictivo">
            <span className="stat-number">{mantenimientos.filter(m => m.tipo === 'predictivo').length}</span>
            <span className="stat-label">Predictivos</span>
          </div>
        </div>
      </div>

      <div className="mantenimientos-filters">
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${tipoFiltro === 'todos' ? 'active' : ''}`}
            onClick={() => setTipoFiltro('todos')}
          >
            Todos ({mantenimientos.length})
          </button>
          <button 
            className={`filter-btn ${tipoFiltro === 'preventivo' ? 'active' : ''}`}
            onClick={() => setTipoFiltro('preventivo')}
          >
            Preventivos ({mantenimientos.filter(m => m.tipo === 'preventivo').length})
          </button>
          <button 
            className={`filter-btn ${tipoFiltro === 'correctivo' ? 'active' : ''}`}
            onClick={() => setTipoFiltro('correctivo')}
          >
            Correctivos ({mantenimientos.filter(m => m.tipo === 'correctivo').length})
          </button>
          <button 
            className={`filter-btn ${tipoFiltro === 'predictivo' ? 'active' : ''}`}
            onClick={() => setTipoFiltro('predictivo')}
          >
            Predictivos ({mantenimientos.filter(m => m.tipo === 'predictivo').length})
          </button>
        </div>
      </div>

      <div className="mantenimientos-grid">
        {mantenimientosFiltrados.map(mantenimiento => (
          <div key={mantenimiento.id} className="mantenimiento-card">
            <div className="card-header">
              <div className="card-title">
                <h3>{mantenimiento.codigo}</h3>
                <div className="card-badges">
                  <span 
                    className="tipo-badge" 
                    style={{ backgroundColor: getTipoColor(mantenimiento.tipo) }}
                  >
                    {mantenimiento.tipo}
                  </span>
                  <span 
                    className="estado-badge"
                    style={{ backgroundColor: getEstadoColor(mantenimiento.estado) }}
                  >
                    {mantenimiento.estado.replace('_', ' ')}
                  </span>
                  <span 
                    className="prioridad-badge"
                    style={{ backgroundColor: getPrioridadColor(mantenimiento.prioridad) }}
                  >
                    {mantenimiento.prioridad}
                  </span>
                </div>
              </div>
            </div>

            <div className="card-content">
              <div className="equipment-info">
                <div className="info-item">
                  <span className="icon">🏢</span>
                  <div>
                    <strong>Cliente:</strong>
                    <p>{mantenimiento.cliente}</p>
                  </div>
                </div>
                <div className="info-item">
                  <span className="icon">⚙️</span>
                  <div>
                    <strong>Equipo:</strong>
                    <p>{mantenimiento.equipo}</p>
                  </div>
                </div>
                <div className="info-item">
                  <span className="icon">📍</span>
                  <div>
                    <strong>Ubicación:</strong>
                    <p>{mantenimiento.ubicacion}</p>
                  </div>
                </div>
              </div>

              <div className="schedule-info">
                <div className="schedule-item">
                  <span className="icon">⏰</span>
                  <div>
                    <strong>Duración estimada:</strong>
                    <p>{mantenimiento.duracion_estimada}</p>
                  </div>
                </div>
                <div className="schedule-item">
                  <span className="icon">🔄</span>
                  <div>
                    <strong>Frecuencia:</strong>
                    <p>{mantenimiento.frecuencia.replace('_', ' ')}</p>
                  </div>
                </div>
                {mantenimiento.proxima_fecha && (
                  <div className="schedule-item">
                    <span className="icon">📅</span>
                    <div>
                      <strong>Próxima fecha:</strong>
                      <p>{new Date(mantenimiento.proxima_fecha).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="card-actions">
              {mantenimiento.estado === 'programado' && (
                <button className="action-btn start-btn">
                  ▶️ Iniciar
                </button>
              )}
              {mantenimiento.estado === 'en_progreso' && (
                <button className="action-btn complete-btn">
                  ✅ Completar
                </button>
              )}
              <button className="action-btn details-btn">
                👁️ Ver Detalles
              </button>
              <button className="action-btn history-btn">
                📋 Historial
              </button>
            </div>
          </div>
        ))}
      </div>

      {mantenimientosFiltrados.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🔧</div>
          <h3>No hay mantenimientos {tipoFiltro !== 'todos' ? `de tipo "${tipoFiltro}"` : ''}</h3>
          <p>Los mantenimientos programados aparecerán aquí.</p>
        </div>
      )}
    </div>
  );
};

export default TecnicoMantenimientos;
