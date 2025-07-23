import React, { useState, useEffect } from 'react';
import { useTecnicoAuth } from '../contexts/TecnicoAuthContext';
import './TecnicoOrdenes.css';

const TecnicoOrdenes = () => {
  const { tecnico } = useTecnicoAuth();
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('todas');

  // Datos simulados para demonstración
  useEffect(() => {
    const ordenesDemo = [
      {
        id: 1,
        numero: 'ORD-2024-001',
        cliente: 'Hotel Gran Plaza',
        equipo: 'Aire Acondicionado Central',
        ubicacion: 'Lobby Principal',
        prioridad: 'alta',
        estado: 'pendiente',
        fecha_asignacion: '2024-01-15T10:00:00Z',
        descripcion: 'Sistema de enfriamiento no funciona correctamente'
      },
      {
        id: 2,
        numero: 'ORD-2024-002',
        cliente: 'Oficinas Corp Center',
        equipo: 'Sistema de Ventilación',
        ubicacion: 'Piso 3',
        prioridad: 'media',
        estado: 'en_progreso',
        fecha_asignacion: '2024-01-14T14:30:00Z',
        descripcion: 'Mantenimiento preventivo trimestral'
      },
      {
        id: 3,
        numero: 'ORD-2024-003',
        cliente: 'Centro Comercial Plaza',
        equipo: 'Bomba de Calor',
        ubicacion: 'Área de Comidas',
        prioridad: 'baja',
        estado: 'completada',
        fecha_asignacion: '2024-01-13T09:15:00Z',
        descripcion: 'Revisión de eficiencia energética'
      }
    ];
    
    setTimeout(() => {
      setOrdenes(ordenesDemo);
      setLoading(false);
    }, 1000);
  }, []);

  const filtrarOrdenes = (ordenes, filtro) => {
    if (filtro === 'todas') return ordenes;
    return ordenes.filter(orden => orden.estado === filtro);
  };

  const cambiarEstado = (id, nuevoEstado) => {
    setOrdenes(ordenes.map(orden => 
      orden.id === id ? { ...orden, estado: nuevoEstado } : orden
    ));
  };

  const getPrioridadColor = (prioridad) => {
    switch (prioridad) {
      case 'alta': return '#ef4444';
      case 'media': return '#f59e0b';
      case 'baja': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'pendiente': return '#ef4444';
      case 'en_progreso': return '#f59e0b';
      case 'completada': return '#10b981';
      default: return '#6b7280';
    }
  };

  const ordenesFiltradas = filtrarOrdenes(ordenes, filtro);

  if (loading) {
    return (
      <div className="ordenes-loading">
        <div className="spinner"></div>
        <p>Cargando órdenes de trabajo...</p>
      </div>
    );
  }

  return (
    <div className="tecnico-ordenes">
      <div className="ordenes-header">
        <div className="header-title">
          <h1>📋 Órdenes de Trabajo</h1>
          <p>Gestiona tus órdenes asignadas</p>
        </div>
        <div className="header-stats">
          <div className="stat-card">
            <span className="stat-number">{ordenes.filter(o => o.estado === 'pendiente').length}</span>
            <span className="stat-label">Pendientes</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{ordenes.filter(o => o.estado === 'en_progreso').length}</span>
            <span className="stat-label">En Progreso</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{ordenes.filter(o => o.estado === 'completada').length}</span>
            <span className="stat-label">Completadas</span>
          </div>
        </div>
      </div>

      <div className="ordenes-filters">
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filtro === 'todas' ? 'active' : ''}`}
            onClick={() => setFiltro('todas')}
          >
            Todas ({ordenes.length})
          </button>
          <button 
            className={`filter-btn ${filtro === 'pendiente' ? 'active' : ''}`}
            onClick={() => setFiltro('pendiente')}
          >
            Pendientes ({ordenes.filter(o => o.estado === 'pendiente').length})
          </button>
          <button 
            className={`filter-btn ${filtro === 'en_progreso' ? 'active' : ''}`}
            onClick={() => setFiltro('en_progreso')}
          >
            En Progreso ({ordenes.filter(o => o.estado === 'en_progreso').length})
          </button>
          <button 
            className={`filter-btn ${filtro === 'completada' ? 'active' : ''}`}
            onClick={() => setFiltro('completada')}
          >
            Completadas ({ordenes.filter(o => o.estado === 'completada').length})
          </button>
        </div>
      </div>

      <div className="ordenes-list">
        {ordenesFiltradas.map(orden => (
          <div key={orden.id} className="orden-card">
            <div className="orden-header">
              <div className="orden-info">
                <h3>{orden.numero}</h3>
                <p className="cliente">{orden.cliente}</p>
              </div>
              <div className="orden-badges">
                <span 
                  className="prioridad-badge" 
                  style={{ backgroundColor: getPrioridadColor(orden.prioridad) }}
                >
                  {orden.prioridad.toUpperCase()}
                </span>
                <span 
                  className="estado-badge"
                  style={{ backgroundColor: getEstadoColor(orden.estado) }}
                >
                  {orden.estado.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>

            <div className="orden-details">
              <div className="detail-item">
                <span className="detail-icon">🔧</span>
                <div>
                  <strong>Equipo:</strong> {orden.equipo}
                </div>
              </div>
              <div className="detail-item">
                <span className="detail-icon">📍</span>
                <div>
                  <strong>Ubicación:</strong> {orden.ubicacion}
                </div>
              </div>
              <div className="detail-item">
                <span className="detail-icon">📅</span>
                <div>
                  <strong>Asignada:</strong> {new Date(orden.fecha_asignacion).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="orden-descripcion">
              <p>{orden.descripcion}</p>
            </div>

            <div className="orden-actions">
              {orden.estado === 'pendiente' && (
                <button 
                  className="action-btn start-btn"
                  onClick={() => cambiarEstado(orden.id, 'en_progreso')}
                >
                  ▶️ Iniciar Trabajo
                </button>
              )}
              {orden.estado === 'en_progreso' && (
                <button 
                  className="action-btn complete-btn"
                  onClick={() => cambiarEstado(orden.id, 'completada')}
                >
                  ✅ Completar
                </button>
              )}
              <button className="action-btn details-btn">
                👁️ Ver Detalles
              </button>
              <button className="action-btn report-btn">
                📝 Reportar
              </button>
            </div>
          </div>
        ))}
      </div>

      {ordenesFiltradas.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No hay órdenes {filtro !== 'todas' ? `en estado "${filtro.replace('_', ' ')}"` : ''}</h3>
          <p>Las nuevas órdenes aparecerán aquí cuando sean asignadas.</p>
        </div>
      )}
    </div>
  );
};

export default TecnicoOrdenes;
