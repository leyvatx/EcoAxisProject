import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/dashboard/Sidebar';
import TopBar from '../../components/dashboard/TopBar';
import { dashboardAPI, usuariosAPI, empresasAPI, tecnicosAPI } from '../../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    usuariosActivos: 0,
    empresasRegistradas: 0,
    tecnicosDisponibles: 0,
    equiposMonitoreados: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const statsData = await dashboardAPI.getStats();
      setStats(statsData);
      
      // Simular actividad reciente por ahora
      setRecentActivity([
        {
          icon: '🏢',
          text: 'Nueva empresa registrada',
          time: 'Hace 2 horas'
        },
        {
          icon: '👨‍🔧',
          text: 'Técnico asignado a mantenimiento',
          time: 'Hace 4 horas'
        },
        {
          icon: '⚙️',
          text: 'Nuevo equipo añadido al catálogo',
          time: 'Hace 6 horas'
        },
        {
          icon: '📊',
          text: 'Reporte mensual generado',
          time: 'Hace 1 día'
        }
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsConfig = [
    {
      icon: '�',
      number: stats.usuariosActivos.toString(),
      label: 'Usuarios Activos',
      description: 'Usuarios registrados en la plataforma',
      trend: '+12%',
      trendType: 'up'
    },
    {
      icon: '🏢',
      number: stats.empresasRegistradas.toString(),
      label: 'Empresas Registradas',
      description: 'Empresas activas en la plataforma',
      trend: '+8%',
      trendType: 'up'
    },
    {
      icon: '👨‍🔧',
      number: stats.tecnicosDisponibles.toString(),
      label: 'Técnicos Disponibles',
      description: 'Técnicos activos este mes',
      trend: '+5%',
      trendType: 'up'
    },
    {
      icon: '⚙️',
      number: stats.equiposMonitoreados.toString(),
      label: 'Equipos Monitoreados',
      description: 'Equipos bajo gestión sostenible',
      trend: '+18%',
      trendType: 'up'
    }
  ];

  const quickActions = [
    {
      icon: '🏢',
      text: 'Gestionar Empresas',
      link: '/dashboard/empresas'
    },
    {
      icon: '👨‍🔧',
      text: 'Ver Técnicos',
      link: '/dashboard/tecnicos'
    },
    {
      icon: '⚙️',
      text: 'Panel Admin',
      link: '/admin'
    },
    {
      icon: '📊',
      text: 'Reportes',
      link: '/dashboard/reportes'
    }
  ];

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="dashboard-main">
        <TopBar />
        <div className="dashboard-content">
          <div className="dashboard-welcome">
            <h1>¡Bienvenido a EcoAxis!</h1>
            <p>
              Gestiona tu plataforma de sostenibilidad empresarial desde este panel de control. 
              Monitorea el rendimiento, administra recursos y toma decisiones basadas en datos.
            </p>
            <div className="welcome-actions">
              <Link to="/dashboard/empresas" className="welcome-btn primary">
                Ver Empresas
              </Link>
              <Link to="/admin" className="welcome-btn">
                Panel Admin
              </Link>
            </div>
          </div>

          <div className="dashboard-overview">
            <div className="section-header">
              <h2 className="section-title">Resumen General</h2>
              <Link to="/dashboard/analytics" className="section-link">
                Ver análisis completo →
              </Link>
            </div>
            
            <div className="dashboard-stats">
              {loading ? (
                <div className="loading-stats">Cargando estadísticas...</div>
              ) : (
                statsConfig.map((stat, index) => (
                  <div key={index} className="stat-card">
                    <div className="stat-header">
                      <div className="stat-icon">{stat.icon}</div>
                      <div className={`stat-trend trend-${stat.trendType}`}>
                        {stat.trendType === 'up' ? '↗️' : stat.trendType === 'down' ? '↘️' : '→'}
                        {stat.trend}
                      </div>
                    </div>
                    <div className="stat-number">{stat.number}</div>
                    <div className="stat-label">{stat.label}</div>
                    <div className="stat-description">{stat.description}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="dashboard-grid">
            <div className="dashboard-main-content">
              <div className="activity-card">
                <div className="card-header">
                  <h3 className="card-title">Actividad Reciente</h3>
                </div>
                <div className="card-body">
                  <ul className="activity-list">
                    {recentActivity.map((activity, index) => (
                      <li key={index} className="activity-item">
                        <div className="activity-icon">{activity.icon}</div>
                        <div className="activity-content">
                          <div className="activity-text">{activity.text}</div>
                          <div className="activity-time">{activity.time}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="dashboard-sidebar-content">
              <div className="quick-actions-card">
                <div className="card-header">
                  <h3 className="card-title">Acciones Rápidas</h3>
                </div>
                <div className="card-body">
                  <div className="quick-actions">
                    {quickActions.map((action, index) => (
                      <Link key={index} to={action.link} className="quick-action">
                        <span className="quick-action-icon">{action.icon}</span>
                        <span>{action.text}</span>
                      </Link>
                    ))}
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

export default Dashboard;
