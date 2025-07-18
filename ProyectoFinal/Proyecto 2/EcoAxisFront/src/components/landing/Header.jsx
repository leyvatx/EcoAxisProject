import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="landing-header">
      <div className="header-container">
        <div className="logo">
          <h2>EcoAxis</h2>
        </div>

        <nav className="nav-menu">
          <a href="#features">Características</a>
          <a href="#about">Acerca de</a>
          <a href="#contact">Contacto</a>
        </nav>

        <div className="header-actions">
          <button 
            className="btn-secondary"
            onClick={() => navigate('/login')}
          >
            Iniciar Sesión
          </button>

          <button className="btn-primary">
            Registrarse
          </button>
        
          {/* Botón Admin*/}
            <Link to="/admin" className="btn-admin">
              Panel Admin
            </Link>
            {/* Botón para Tecnico Sup */}
            <Link to="/tecnico-sup" className="btn-tecnico">
              Técnico Superior
            </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
