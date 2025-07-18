import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  // Función para obtener las iniciales del usuario
  const getUserInitials = () => {
    if (!user || !user.nombres || !user.apellidos) return 'U';
    return `${user.nombres.charAt(0)}${user.apellidos.charAt(0)}`.toUpperCase();
  };

  // Función para obtener el nombre completo
  const getUserFullName = () => {
    if (!user) return 'Usuario';
    const fullName = `${user.nombres || ''} ${user.apellidos || ''}`.trim();
    return fullName || 'Usuario';
  };

  // Función para determinar el rol del usuario
  const getUserRole = () => {
    if (!user) return 'Usuario';
    
    // Si el usuario tiene is_staff o is_superuser, es administrador
    if (user.is_staff || user.is_superuser) {
      return 'Administrador';
    }
    
    // Si no, asumimos que es empresa
    return 'Empresa';
  };

  const handleLogout = () => {
    logout();
  };

  const menuSections = [
    {
      title: 'Principal',
      items: [
        { path: '/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/dashboard/empresas', label: 'Empresas', icon: '🏢' },
        { path: '/dashboard/sucursales', label: 'Sucursales', icon: '🏪' },
      ]
    },
    {
      title: 'Gestión',
      items: [
        { path: '/dashboard/usuarios', label: 'Usuarios', icon: '👥' },
        { path: '/dashboard/tecnicos', label: 'Técnicos', icon: '👨‍🔧' },
        { path: '/dashboard/productos', label: 'Productos', icon: '📦' },
        { path: '/dashboard/reportes', label: 'Reportes', icon: '📊' },
        { path: '/dashboard/mantenimientos', label: 'Mantenimientos', icon: '🔧' },
      ]
    },
    {
      title: 'Financiero',
      items: [
        { path: '/dashboard/subscripciones', label: 'Suscripciones', icon: '📋' },
        { path: '/dashboard/pagos', label: 'Pagos', icon: '💳' },
      ]
    },
    {
      title: 'Administración',
      items: [
        { path: '/admin', label: 'Panel Admin', icon: '⚙️' },
        { path: '/tecnico-sup', label: 'Técnico Superior', icon: '🔧' },
      ]
    }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Link to="/" className="sidebar-logo">
          <img src="/verdealejandro.png" alt="EcoAxis" className="logo-icon" />
          <h3>EcoAxis</h3>
        </Link>
      </div>
      
      <nav className="sidebar-nav">
        {menuSections.map((section, index) => (
          <div key={index} className="sidebar-section">
            <div className="sidebar-section-title">{section.title}</div>
            {section.items.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-label">{item.label}</span>
              </Link>
            ))}
          </div>
        ))}
      </nav>
      
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">{getUserInitials()}</div>
          <div className="sidebar-user-info">
            <p className="sidebar-user-name">{getUserFullName()}</p>
            <p className="sidebar-user-role">{getUserRole()}</p>
          </div>
        </div>
        
        <button onClick={handleLogout} className="btn-logout">
          <span>🚪</span>
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;