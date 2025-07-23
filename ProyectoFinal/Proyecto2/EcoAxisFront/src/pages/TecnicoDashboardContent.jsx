import React from 'react';
import { useTecnicoAuth } from '../contexts/TecnicoAuthContext';
import './TecnicoDashboardContent.css';

const TecnicoDashboardContent = () => {
  const { tecnico } = useTecnicoAuth();

  const handleCardClick = (path) => {
    // Esta función se puede usar para navegación programática si es necesario
    console.log(`Navegando a: ${path}`);
  };

  return (
    <div className="dashboard-content">
      {/* Sección de bienvenida */}
      <div className="welcome-section">
        <div className="welcome-card">
          <div className="welcome-header">
            <div className="welcome-icon">👋</div>
            <div className="welcome-text">
              <h2>¡Bienvenido de vuelta, {tecnico?.first_name}!</h2>
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
            <div className="stat-item">
              <span className="stat-number">8</span>
              <span className="stat-label">Horas Trabajadas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="quick-actions">
        <h3>Acciones Rápidas</h3>
        <div className="actions-grid">
          <div className="action-card" onClick={() => handleCardClick('/tecnico/ordenes')}>
            <div className="card-icon">📋</div>
            <div className="card-content">
              <h4>Órdenes de Trabajo</h4>
              <p>Gestiona tus órdenes asignadas</p>
              <span className="card-badge status-warning">3 pendientes</span>
            </div>
            <div className="card-arrow">→</div>
          </div>

          <div className="action-card" onClick={() => handleCardClick('/tecnico/mantenimientos')}>
            <div className="card-icon">🔧</div>
            <div className="card-content">
              <h4>Mantenimientos</h4>
              <p>Registra y actualiza mantenimientos</p>
              <span className="card-badge status-success">2 programados</span>
            </div>
            <div className="card-arrow">→</div>
          </div>

          <div className="action-card" onClick={() => handleCardClick('/tecnico/equipos')}>
            <div className="card-icon">⚙️</div>
            <div className="card-content">
              <h4>Equipos</h4>
              <p>Inventario de equipos</p>
              <span className="card-badge">Ver todos</span>
            </div>
            <div className="card-arrow">→</div>
          </div>

          <div className="action-card" onClick={() => handleCardClick('/tecnico/reportes')}>
            <div className="card-icon">📊</div>
            <div className="card-content">
              <h4>Reportes</h4>
              <p>Genera reportes de actividades</p>
              <span className="card-badge">Disponible</span>
            </div>
            <div className="card-arrow">→</div>
          </div>

          <div className="action-card" onClick={() => handleCardClick('/tecnico/consumo')}>
            <div className="card-icon">⚡</div>
            <div className="card-content">
              <h4>Consumo Energético</h4>
              <p>Monitorea el consumo</p>
              <span className="card-badge status-warning">Alerta</span>
            </div>
            <div className="card-arrow">→</div>
          </div>

          <div className="action-card" onClick={() => handleCardClick('/tecnico/tickets')}>
            <div className="card-icon">🎫</div>
            <div className="card-content">
              <h4>Tickets de Soporte</h4>
              <p>Gestiona tickets asignados</p>
              <span className="card-badge status-warning">1 urgente</span>
            </div>
            <div className="card-arrow">→</div>
          </div>
        </div>
      </div>

      {/* Sección inferior del dashboard */}
      <div className="dashboard-bottom">
        <div className="recent-activity">
          <h3>Actividad Reciente</h3>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon">✅</div>
              <div className="activity-content">
                <p>Orden de trabajo OT-2024-001 completada</p>
                <span className="activity-time">Hace 2 horas</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">🔧</div>
              <div className="activity-content">
                <p>Mantenimiento preventivo realizado</p>
                <span className="activity-time">Hace 4 horas</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">📝</div>
              <div className="activity-content">
                <p>Reporte de eficiencia generado</p>
                <span className="activity-time">Ayer</span>
              </div>
            </div>
          </div>
        </div>

        <div className="alerts-panel">
          <h3>Alertas y Notificaciones</h3>
          <div className="alerts-list">
            <div className="alert-item priority-high">
              <div className="alert-icon">🚨</div>
              <div className="alert-content">
                <p>Equipo AC-001 requiere atención inmediata</p>
                <span className="alert-location">Edificio Principal - Piso 3</span>
              </div>
            </div>
            <div className="alert-item priority-medium">
              <div className="alert-icon">⚠️</div>
              <div className="alert-content">
                <p>Mantenimiento programado para mañana</p>
                <span className="alert-location">Sistema de Ventilación</span>
              </div>
            </div>
            <div className="alert-item priority-low">
              <div className="alert-icon">💡</div>
              <div className="alert-content">
                <p>Nuevo protocolo de seguridad disponible</p>
                <span className="alert-location">Centro de Documentación</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TecnicoDashboardContent;
