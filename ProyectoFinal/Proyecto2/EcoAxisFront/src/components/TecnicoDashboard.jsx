import React from 'react';
import { useTecnicoAuth } from '../contexts/TecnicoAuthContext';
import { useNavigate } from 'react-router-dom';
import TecnicoSidebar from './TecnicoSidebar';
import TecnicoTopBar from './TecnicoTopBar';
import './TecnicoDashboard.css';

const TecnicoDashboard = () => {
  const { tecnico } = useTecnicoAuth();
  const navigate = useNavigate();

  if (!tecnico) {
    return (
      <div className="tecnico-dashboard-loading">
        <div className="spinner"></div>
        <p>Cargando datos del técnico...</p>
      </div>
    );
  }

  const handleCardClick = (action) => {
    // Aquí puedes manejar la navegación a diferentes secciones
    switch (action) {
      case 'ordenes':
        navigate('/tecnico/ordenes');
        break;
      case 'mantenimientos':
        navigate('/tecnico/mantenimientos');
        break;
      case 'reportes':
        navigate('/tecnico/reportes');
        break;
      case 'consumo':
        navigate('/tecnico/consumo');
        break;
      case 'tickets':
        navigate('/tecnico/tickets');
        break;
      case 'perfil':
        navigate('/tecnico/perfil');
        break;
      default:
        console.log('Acción no implementada:', action);
    }
  };

  return (
    <div className="tecnico-dashboard-layout">
      <TecnicoSidebar />
      
      <div className="tecnico-main-content">
        <TecnicoTopBar title="Dashboard" />
        
        <div className="dashboard-content">
          {/* Resumen de bienvenida */}
          <div className="welcome-section">
            <div className="welcome-card">
              <div className="welcome-header">
                <div className="welcome-icon">👋</div>
                <div className="welcome-text">
                  <h2>¡Bienvenido de vuelta, {tecnico.nombres}!</h2>
                  <p>Aquí tienes un resumen de tu actividad y tareas pendientes</p>
                </div>
              </div>
              <div className="welcome-stats">
                <div className="stat-item">
                  <span className="stat-number">3</span>
                  <span className="stat-label">Órdenes Pendientes</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">12</span>
                  <span className="stat-label">Completadas Hoy</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">95%</span>
                  <span className="stat-label">Eficiencia</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tarjetas de acciones rápidas */}
          <div className="quick-actions">
            <h3>Acciones Rápidas</h3>
            <div className="actions-grid">
              <div className="action-card" onClick={() => handleCardClick('ordenes')}>
                <div className="card-icon">📋</div>
                <div className="card-content">
                  <h4>Órdenes de Trabajo</h4>
                  <p>Gestiona tus órdenes asignadas</p>
                  <span className="card-badge">3 pendientes</span>
                </div>
                <div className="card-arrow">→</div>
              </div>

              <div className="action-card" onClick={() => handleCardClick('mantenimientos')}>
                <div className="card-icon">🔧</div>
                <div className="card-content">
                  <h4>Mantenimientos</h4>
                  <p>Registra y actualiza mantenimientos</p>
                  <span className="card-badge">2 programados</span>
                </div>
                <div className="card-arrow">→</div>
              </div>

              <div className="action-card" onClick={() => handleCardClick('reportes')}>
                <div className="card-icon">📊</div>
                <div className="card-content">
                  <h4>Reportes</h4>
                  <p>Genera reportes de actividades</p>
                  <span className="card-badge">Disponible</span>
                </div>
                <div className="card-arrow">→</div>
              </div>

              <div className="action-card" onClick={() => handleCardClick('consumo')}>
                <div className="card-icon">⚡</div>
                <div className="card-content">
                  <h4>Consumo Energético</h4>
                  <p>Monitorea el consumo</p>
                  <span className="card-badge status-warning">Alerta</span>
                </div>
                <div className="card-arrow">→</div>
              </div>

              <div className="action-card" onClick={() => handleCardClick('tickets')}>
                <div className="card-icon">🎫</div>
                <div className="card-content">
                  <h4>Tickets de Soporte</h4>
                  <p>Gestiona tickets asignados</p>
                  <span className="card-badge">1 urgente</span>
                </div>
                <div className="card-arrow">→</div>
              </div>

              <div className="action-card" onClick={() => handleCardClick('perfil')}>
                <div className="card-icon">👤</div>
                <div className="card-content">
                  <h4>Mi Perfil</h4>
                  <p>Actualiza tu información</p>
                  <span className="card-badge status-success">Actualizado</span>
                </div>
                <div className="card-arrow">→</div>
              </div>
            </div>
          </div>

          {/* Actividad reciente y alertas */}
          <div className="dashboard-bottom">
            <div className="recent-activity">
              <h3>Actividad Reciente</h3>
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-icon">✅</div>
                  <div className="activity-content">
                    <p><strong>Orden completada:</strong> Mantenimiento HVAC - Sucursal Centro</p>
                    <span className="activity-time">Hace 2 horas</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">📝</div>
                  <div className="activity-content">
                    <p><strong>Reporte generado:</strong> Inspección mensual de equipos</p>
                    <span className="activity-time">Hace 4 horas</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">🔧</div>
                  <div className="activity-content">
                    <p><strong>Mantenimiento programado:</strong> Sistema de iluminación LED</p>
                    <span className="activity-time">Ayer</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="alerts-panel">
              <h3>Alertas y Notificaciones</h3>
              <div className="alerts-list">
                <div className="alert-item priority-high">
                  <div className="alert-icon">⚠️</div>
                  <div className="alert-content">
                    <p><strong>Equipo con fallo:</strong> Sistema HVAC requiere atención inmediata</p>
                    <span className="alert-location">Sucursal Norte</span>
                  </div>
                </div>
                <div className="alert-item priority-medium">
                  <div className="alert-icon">📋</div>
                  <div className="alert-content">
                    <p><strong>Nueva orden asignada:</strong> Mantenimiento preventivo programado</p>
                    <span className="alert-location">Sucursal Centro</span>
                  </div>
                </div>
                <div className="alert-item priority-low">
                  <div className="alert-icon">💡</div>
                  <div className="alert-content">
                    <p><strong>Recordatorio:</strong> Actualizar reporte semanal</p>
                    <span className="alert-location">Vence mañana</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TecnicoDashboard;
