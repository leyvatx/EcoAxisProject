import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './TopBar.css';

const TopBar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  // Generar breadcrumb basado en la ruta actual
  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard Principal';
    if (path === '/dashboard/empresas') return 'Gestión de Empresas';
    if (path === '/dashboard/sucursales') return 'Gestión de Sucursales';
    if (path === '/dashboard/usuarios') return 'Gestión de Usuarios';
    if (path === '/dashboard/tecnicos') return 'Gestión de Técnicos';
    if (path === '/dashboard/productos') return 'Gestión de Productos';
    if (path === '/dashboard/reportes') return 'Gestión de Reportes';
    if (path === '/dashboard/pagos') return 'Gestión de Pagos';
    if (path === '/dashboard/subscripciones') return 'Gestión de Suscripciones';
    if (path === '/dashboard/mantenimientos') return 'Gestión de Mantenimientos';
    if (path === '/admin') return 'Panel de Administración';
    if (path === '/tecnico-sup') return 'Panel Técnico Superior';
    return 'Panel de Control';
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/dashboard/empresas') return 'Empresas';
    if (path === '/dashboard/sucursales') return 'Sucursales';
    if (path === '/dashboard/usuarios') return 'Usuarios';
    if (path === '/dashboard/tecnicos') return 'Técnicos';
    if (path === '/dashboard/productos') return 'Productos';
    if (path === '/dashboard/reportes') return 'Reportes';
    if (path === '/dashboard/pagos') return 'Pagos';
    if (path === '/dashboard/subscripciones') return 'Suscripciones';
    if (path === '/dashboard/mantenimientos') return 'Mantenimientos';
    if (path === '/admin') return 'Administración';
    if (path === '/tecnico-sup') return 'Técnico Superior';
    return 'Panel de Control';
  };

  return (
    <div className="topbar">
      <div className="topbar-left">
        <div className="topbar-breadcrumb">
          <img src="/verdealejandro.png" alt="EcoAxis" className="breadcrumb-logo" />
          <span>EcoAxis</span>
          <span className="breadcrumb-separator">›</span>
          <span>{getBreadcrumb()}</span>
        </div>
      </div>
      
      <div className="topbar-right">
        <div className="topbar-search">
          <input 
            type="text" 
            placeholder="Buscar empresas, usuarios, técnicos..." 
          />
        </div>
        
        <div className="topbar-actions">
          <div className="topbar-notifications">
            <span className="notification-icon">🔔</span>
            <span className="notification-badge">3</span>
          </div>
          
          <div className="topbar-user" onClick={() => setShowUserMenu(!showUserMenu)}>
            <div className="topbar-user-info">
              <p className="topbar-user-name">{user?.nombres} {user?.apellidos}</p>
              <p className="topbar-user-role">{user?.is_staff || user?.is_superuser ? 'Administrador' : 'Empresa'}</p>
            </div>
            <div className="user-avatar">
              {user?.nombres?.[0]}{user?.apellidos?.[0]}
            </div>
            
            {showUserMenu && (
              <div className="user-menu-dropdown">
                <div className="user-menu-item">
                  <span>Mi Perfil</span>
                </div>
                <div className="user-menu-item">
                  <span>Configuración</span>
                </div>
                <div className="user-menu-divider"></div>
                <div className="user-menu-item" onClick={() => {
                  logout();
                  setShowUserMenu(false);
                }}>
                  <span>Cerrar Sesión</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="topbar-mobile-menu">
          <span className="menu-icon">☰</span>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
