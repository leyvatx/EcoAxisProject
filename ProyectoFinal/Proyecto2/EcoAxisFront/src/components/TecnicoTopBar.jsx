import React, { useState } from 'react';
import { useTecnicoAuth } from '../contexts/TecnicoAuthContext';
import './TecnicoTopBar.css';

const TecnicoTopBar = ({ title = 'Dashboard' }) => {
  const [showProfile, setShowProfile] = useState(false);
  const { tecnico } = useTecnicoAuth();

  return (
    <div className="tecnico-topbar">
      <div className="topbar-left">
        {/* Sin título ni breadcrumb */}
      </div>

      <div className="topbar-right">
        {/* Perfil de usuario */}
        <div className="profile-container">
          <button
            className="profile-btn"
            onClick={() => setShowProfile(!showProfile)}
          >
            <div className="profile-avatar">🔧</div>
            <div className="profile-info">
              <span className="profile-name">{tecnico?.nombres}</span>
              <span className="profile-role">{tecnico?.tipo_tecnico || 'Técnico'}</span>
            </div>
            <span className="dropdown-arrow">▼</span>
          </button>

          {showProfile && (
            <div className="profile-dropdown">
              <div className="profile-header">
                <div className="profile-avatar-large">🔧</div>
                <div className="profile-details">
                  <h3>{tecnico?.nombres} {tecnico?.apellidos}</h3>
                  <p>{tecnico?.email_user}</p>
                  <span className="profile-badge">{tecnico?.tipo_tecnico}</span>
                </div>
              </div>
              <div className="profile-menu">
                <button className="profile-menu-item">
                  <span className="menu-icon">👤</span>
                  Mi Perfil
                </button>
                <div className="menu-divider"></div>
                <button className="profile-menu-item logout">
                  <span className="menu-icon">🚪</span>
                  Cerrar Sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TecnicoTopBar;
