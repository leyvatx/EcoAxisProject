import React from 'react';
import { useTecnicoAuth } from '../../contexts/TecnicoAuthContext';
import { useNavigate } from 'react-router-dom';
import './TecnicoDashboard.css';

const TecnicoDashboard = () => {
  const { tecnico, logoutTecnico } = useTecnicoAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutTecnico();
    navigate('/tecnico-login');
  };

  if (!tecnico) {
    return (
      <div className="tecnico-dashboard-loading">
        <div className="spinner"></div>
        <p>Cargando datos del técnico...</p>
      </div>
    );
  }

  return (
    <div className="tecnico-dashboard">
      <header className="tecnico-header">
        <div className="tecnico-info">
          <div className="tecnico-avatar">
            <span>🔧</span>
          </div>
          <div className="tecnico-details">
            <h2>Bienvenido, {tecnico.nombres} {tecnico.apellidos}</h2>
            <p className="tecnico-type">{tecnico.tipo_tecnico}</p>
            <p className="tecnico-empresa">{tecnico.empresa} - {tecnico.sucursal}</p>
          </div>
        </div>
        <button className="logout-button" onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </header>

      <main className="tecnico-main">
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="card-icon">📋</div>
            <h3>Órdenes de Trabajo</h3>
            <p>Gestiona tus órdenes de trabajo asignadas</p>
            <button className="card-button">Ver Órdenes</button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">🔧</div>
            <h3>Mantenimientos</h3>
            <p>Registra y actualiza mantenimientos</p>
            <button className="card-button">Mantenimientos</button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">📊</div>
            <h3>Reportes</h3>
            <p>Genera reportes de tus actividades</p>
            <button className="card-button">Ver Reportes</button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">⚡</div>
            <h3>Consumo Energético</h3>
            <p>Monitorea el consumo energético</p>
            <button className="card-button">Ver Consumo</button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">🎫</div>
            <h3>Tickets</h3>
            <p>Gestiona tickets de soporte técnico</p>
            <button className="card-button">Ver Tickets</button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">📱</div>
            <h3>Perfil</h3>
            <p>Actualiza tu información personal</p>
            <button className="card-button">Mi Perfil</button>
          </div>
        </div>

        <div className="tecnico-stats">
          <h3>Resumen de Actividad</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">12</div>
              <div className="stat-label">Órdenes Completadas</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">3</div>
              <div className="stat-label">Órdenes Pendientes</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">8</div>
              <div className="stat-label">Mantenimientos</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">95%</div>
              <div className="stat-label">Eficiencia</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TecnicoDashboard;
