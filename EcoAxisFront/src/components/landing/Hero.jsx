import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <h1>Transforma tu Empresa hacia la Sostenibilidad</h1>
          <p>
            EcoAxis es la plataforma integral que conecta empresas, técnicos especializados 
            y sistemas de gestión para crear un futuro más sostenible y eficiente energéticamente.
            Optimiza tus recursos, reduce costos y cumple con los estándares ambientales.
          </p>
          <div className="hero-actions">
            <button 
              className="btn btn-primary btn-lg"
              onClick={() => navigate('/dashboard')}
            >
              Comenzar Ahora
            </button>
            <button 
              className="btn btn-outline btn-lg"
              onClick={() => navigate('/login')}
            >
              Ver Demo
            </button>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-placeholder">
            <div>
              <img src="/verdealejandro.png" alt="EcoAxis" className="login-logo-icon" />
              <br />
              <span style={{ fontSize: '1rem', opacity: 0.8 }}>
                Gestión Sostenible
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
