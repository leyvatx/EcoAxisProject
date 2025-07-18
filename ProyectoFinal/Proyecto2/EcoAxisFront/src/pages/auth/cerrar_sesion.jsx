import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CerrarSesion = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = () => {
      // Limpiar datos del localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      
      // También puedes limpiar sessionStorage si usas eso
      sessionStorage.clear();
      
      // Mostrar mensaje de confirmación (opcional)
      console.log('Sesión cerrada exitosamente');
      
      // Redirigir al login o landing page
      navigate('/login');
    };

    // Ejecutar logout inmediatamente cuando se monta el componente
    logout();
  }, [navigate]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        textAlign: 'center',
        padding: '40px',
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h2>Cerrando sesión...</h2>
        <p>Espera un momento mientras te redirigimos</p>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #667eea',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '20px auto'
        }}></div>
      </div>
    </div>
  );
};

export default CerrarSesion;
