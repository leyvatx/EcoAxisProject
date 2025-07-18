import { Link } from 'react-router-dom';
import './AdminPanel.css';

const AdminPanel = () => {
  const crudModules = [
    {
      title: 'Gestión de Empresas',
      description: 'Administra todas las empresas registradas en la plataforma',
      icon: '🏢',
      link: '/admin/empresas',
      features: ['Crear empresas', 'Editar información', 'Gestionar sucursales', 'Ver estadísticas']
    },
    {
      title: 'Gestión de Sucursales',
      description: 'Control completo de sucursales y ubicaciones empresariales',
      icon: '🏪',
      link: '/admin/sucursales',
      features: ['Agregar sucursales', 'Asignar técnicos', 'Gestionar equipos', 'Monitorear actividad']
    },
    {
      title: 'Gestión de Técnicos',
      description: 'Administra el personal técnico y sus especializaciones',
      icon: '👨‍🔧',
      link: '/admin/tecnicos',
      features: ['Registrar técnicos', 'Asignar especialidades', 'Gestionar horarios', 'Seguimiento de trabajo']
    },
    {
      title: 'Catálogo de Equipos',
      description: 'Mantén el inventario de equipos y especificaciones técnicas',
      icon: '⚙️',
      link: '/admin/catalogos',
      features: ['Agregar equipos', 'Especificaciones técnicas', 'Control de stock', 'Mantenimientos programados']
    }
  ];

  const stats = [
    { icon: '🏢', number: '24', label: 'Empresas Activas' },
    { icon: '🏪', number: '156', label: 'Sucursales' },
    { icon: '👨‍🔧', number: '42', label: 'Técnicos' },
    { icon: '⚙️', number: '1,205', label: 'Equipos' }
  ];

  return (
    <div className="admin-panel">
      <div className="admin-container">
        <div className="admin-header">
          <h1>Panel de Administración</h1>
          <p className="admin-subtitle">
            Centro de control para la gestión integral de la plataforma EcoAxis. 
            Administra empresas, técnicos, equipos y todos los aspectos del sistema.
          </p>
        </div>

        <div className="admin-stats">
          {stats.map((stat, index) => (
            <div key={index} className="admin-stat-card">
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="crud-section">
          <div className="crud-section-header">
            <h2 className="crud-section-title">Módulos de Gestión</h2>
            <p className="crud-section-description">
              Accede a los diferentes módulos para administrar todos los aspectos de la plataforma
            </p>
          </div>

          <div className="crud-grid">
            {crudModules.map((module, index) => (
              <Link key={index} to={module.link} className="crud-card">
                <div className="crud-card-header">
                  <div className="crud-icon">{module.icon}</div>
                  <div className="crud-card-content">
                    <h3>{module.title}</h3>
                    <p>{module.description}</p>
                  </div>
                </div>
                
                <ul className="crud-features">
                  {module.features.map((feature, featureIndex) => (
                    <li key={featureIndex}>{feature}</li>
                  ))}
                </ul>

                <div className="crud-footer">
                  <span className="crud-action">Acceder →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="back-navigation">
          <Link to="/dashboard" className="back-link">
            ← Volver al Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
