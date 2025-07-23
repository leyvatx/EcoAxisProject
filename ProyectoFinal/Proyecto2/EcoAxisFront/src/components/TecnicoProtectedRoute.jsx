import React from 'react';
import { Navigate } from 'react-router-dom';
import { useTecnicoAuth } from '../contexts/TecnicoAuthContext';

const TecnicoProtectedRoute = ({ children }) => {
  const { tecnico, tecnicoToken, loading } = useTecnicoAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          border: '3px solid #f3f3f3',
          borderTop: '3px solid #1e3c72',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p>Verificando autenticación...</p>
      </div>
    );
  }

  // Si no hay técnico autenticado, redirigir al login
  if (!tecnico || !tecnicoToken) {
    return <Navigate to="/tecnico/login" replace />;
  }

  // Si está autenticado, mostrar el contenido protegido
  return children;
};

export default TecnicoProtectedRoute;
