import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { user, loading, token } = useAuth();

  console.log('🛡️ ProtectedRoute - Estado actual:', { 
    hasUser: !!user, 
    hasToken: !!token, 
    loading,
    userPreview: user ? `${user.first_name} ${user.last_name}` : null
  });

  if (loading) {
    console.log('⏳ ProtectedRoute - Cargando...');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!user || !token) {
    console.log('🚫 ProtectedRoute - Sin usuario/token, redirigiendo a login');
    return <Navigate to="/login" replace />;
  }

  console.log('✅ ProtectedRoute - Usuario autorizado, mostrando contenido');
  return children;
};

export default ProtectedRoute;
