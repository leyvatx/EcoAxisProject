import React from 'react';

const Features = () => (
  <section id="features" style={{padding: '80px 20px', textAlign: 'center'}}>
    <h2>Características Principales</h2>
    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px', marginTop: '40px'}}>
      <div>
        <div style={{fontSize: '3rem'}}>🌱</div>
        <h3>Sostenibilidad</h3>
        <p>Soluciones ecológicas para empresas responsables</p>
      </div>
      <div>
        <div style={{fontSize: '3rem'}}>👥</div>
        <h3>Conexión</h3>
        <p>Red de técnicos especializados y empresas</p>
      </div>
      <div>
        <div style={{fontSize: '3rem'}}>📊</div>
        <h3>Análisis</h3>
        <p>Métricas y reportes detallados</p>
      </div>
    </div>
  </section>
);

export default Features;
