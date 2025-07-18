import React from 'react';
import { useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();
  
  // Lista de rutas donde no mostrar el footer
  const hideFooterRoutes = ['/login', '/cerrar-sesion'];
  
  // No mostrar footer solo en rutas del dashboard (que tienen su propio layout)
  const isDashboardRoute = location.pathname.startsWith('/dashboard');
  
  if (hideFooterRoutes.includes(location.pathname) || isDashboardRoute) {
    return null;
  }

  return (
    <footer style={{backgroundColor: '#333', color: 'white', padding: '40px 20px', textAlign: 'center'}}>
      <div>
        <h3>EcoAxis</h3>
        <p>© 2025 EcoAxis. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
