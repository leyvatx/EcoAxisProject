import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTecnicoAuth } from '../contexts/TecnicoAuthContext';
import './TecnicoSidebar.css';

const TecnicoSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { tecnico, logoutTecnico } = useTecnicoAuth();

  const handleLogout = () => {
    logoutTecnico();
    navigate('/tecnico/login');
  };

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '🏠',
      path: '/tecnico/dashboard',
      description: 'Vista general'
    },
    {
      id: 'ordenes',
      label: 'Órdenes de Trabajo',
      icon: '📋',
      path: '/tecnico/ordenes',
      description: 'Gestionar órdenes asignadas'
    },
    {
      id: 'mantenimientos',
      label: 'Mantenimientos',
      icon: '🔧',
      path: '/tecnico/mantenimientos',
      description: 'Registrar mantenimientos'
    },
    {
      id: 'equipos',
      label: 'Equipos',
      icon: '⚙️',
      path: '/tecnico/equipos',
      description: 'Inventario de equipos'
    },
    {
      id: 'reportes',
      label: 'Reportes',
      icon: '📊',
      path: '/tecnico/reportes',
      description: 'Generar reportes técnicos'
    },
    {
      id: 'consumo',
      label: 'Consumo Energético',
      icon: '⚡',
      path: '/tecnico/consumo',
      description: 'Monitorear consumo'
    },
    {
      id: 'tickets',
      label: 'Tickets de Soporte',
      icon: '🎫',
      path: '/tecnico/tickets',
      description: 'Gestionar tickets'
    },
    {
      id: 'inventario',
      label: 'Inventario',
      icon: '📦',
      path: '/tecnico/inventario',
      description: 'Control de materiales'
    },
    {
      id: 'calendario',
      label: 'Calendario',
      icon: '📅',
      path: '/tecnico/calendario',
      description: 'Programar actividades'
    }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleMenuClick = (path) => {
    navigate(path);
  };

  return (
    <div className="tecnico-sidebar">
      {/* Header del Sidebar */}
      <div className="sidebar-header">
        <div className="logo-section">
          <div className="logo-icon">🌱</div>
          <div className="logo-text">
            <h3>EcoAxis</h3>
            <span>Técnico</span>
          </div>
        </div>
      </div>

      {/* Información del Técnico */}
      <div className="tecnico-info">
        <div className="tecnico-avatar">
          <span>🔧</span>
        </div>
        <div className="tecnico-details">
          <h4>{tecnico?.nombres} {tecnico?.apellidos}</h4>
          <p className="tecnico-role">{tecnico?.tipo_tecnico || 'Técnico'}</p>
          <p className="tecnico-empresa">{tecnico?.empresa}</p>
        </div>
      </div>

      {/* Menú de Navegación */}
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map((item) => (
            <li key={item.id} className="nav-item">
              <Link
                to={item.path}
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <div className="nav-content">
                  <span className="nav-label">{item.label}</span>
                  <span className="nav-description">{item.description}</span>
                </div>
                <span className="nav-arrow">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Sección inferior */}
      <div className="sidebar-footer">
        <div className="footer-section">
          <button
            className="nav-link"
            onClick={() => handleMenuClick('/tecnico/perfil')}
          >
            <span className="nav-icon">👤</span>
            <div className="nav-content">
              <span className="nav-label">Mi Perfil</span>
              <span className="nav-description">Configuración personal</span>
            </div>
          </button>
        </div>

        <div className="footer-section">
          <button
            className="nav-link logout-link"
            onClick={handleLogout}
          >
            <span className="nav-icon">🚪</span>
            <div className="nav-content">
              <span className="nav-label">Cerrar Sesión</span>
              <span className="nav-description">Salir del sistema</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TecnicoSidebar;
