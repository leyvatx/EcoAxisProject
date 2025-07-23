import React, { createContext, useContext, useState, useEffect } from 'react';

const TecnicoAuthContext = createContext();

export { TecnicoAuthContext };

export const useTecnicoAuth = () => {
  const context = useContext(TecnicoAuthContext);
  if (!context) {
    throw new Error('useTecnicoAuth must be used within a TecnicoAuthProvider');
  }
  return context;
};

export const TecnicoAuthProvider = ({ children }) => {
  const [tecnico, setTecnico] = useState(null);
  const [tecnicoToken, setTecnicoToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔄 TecnicoAuthProvider iniciando...');
    
    // Verificar datos almacenados al cargar
    const storedTecnico = localStorage.getItem('tecnico');
    const storedTecnicoToken = localStorage.getItem('tecnicoToken');
    
    console.log('📦 Datos de técnico en localStorage:', { 
      hasTecnico: !!storedTecnico, 
      hasTecnicoToken: !!storedTecnicoToken
    });
    
    if (storedTecnicoToken && storedTecnico) {
      try {
        const tecnicoData = JSON.parse(storedTecnico);
        console.log('👨‍🔧 Técnico parseado correctamente:', tecnicoData);
        setTecnico(tecnicoData);
        setTecnicoToken(storedTecnicoToken);
        console.log('✅ Estado de técnico actualizado');
        // TODO: Validar token con backend
        setLoading(false);
      } catch (error) {
        console.error('❌ Error parsing stored tecnico data:', error);
        logoutTecnico();
      }
    } else {
      console.log('⚠️ No hay datos de técnico almacenados');
      setLoading(false);
    }
  }, []);

  const loginTecnico = async (email, password) => {
    try {
      console.log('🔐 Intentando login de técnico con JWT...');
      
      const response = await fetch('http://localhost:8000/api/auth/tecnico/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email_user: email, password }),
      });

      const data = await response.json();
      console.log('📡 Respuesta de la API:', data);

      if (response.ok) {
        console.log('💾 Guardando datos de técnico con tokens...', {
          hasTecnicoData: !!data.tecnico,
          hasAccessToken: !!data.access,
          hasRefreshToken: !!data.refresh
        });
        
        // Almacenar tokens y datos en localStorage
        localStorage.setItem('tecnicoToken', data.access);
        localStorage.setItem('tecnicoRefreshToken', data.refresh);
        localStorage.setItem('tecnico', JSON.stringify(data.tecnico));
        
        // Actualizar estado
        setTecnicoToken(data.access);
        setTecnico(data.tecnico);
        
        console.log('✅ Login de técnico exitoso con JWT');
        return { success: true, tecnico: data.tecnico };
      } else {
        console.log('❌ Error en login:', data.error);
        return { success: false, error: data.error || 'Credenciales incorrectas' };
      }
    } catch (error) {
      console.error('❌ Login de técnico failed:', error);
      return { 
        success: false, 
        error: error.message || 'Error de conexión con el servidor' 
      };
    }
  };

  const refreshTecnicoToken = async () => {
    try {
      const refreshToken = localStorage.getItem('tecnicoRefreshToken');
      if (!refreshToken) {
        logoutTecnico();
        return { success: false, error: 'No refresh token available' };
      }

      const response = await fetch('http://localhost:8000/api/auth/tecnico/refresh/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('tecnicoToken', data.access);
        setTecnicoToken(data.access);
        console.log('✅ Token de técnico renovado');
        return { success: true, token: data.access };
      } else {
        console.log('❌ Error renovando token:', data);
        logoutTecnico();
        return { success: false, error: 'Token refresh failed' };
      }
    } catch (error) {
      console.error('❌ Error refreshing token:', error);
      logoutTecnico();
      return { success: false, error: error.message };
    }
  };

  const logoutTecnico = () => {
    console.log('🚪 Cerrando sesión de técnico...');
    localStorage.removeItem('tecnicoToken');
    localStorage.removeItem('tecnicoRefreshToken');
    localStorage.removeItem('tecnico');
    setTecnicoToken(null);
    setTecnico(null);
    setLoading(false);
  };

  const value = {
    tecnico,
    tecnicoToken,
    loading,
    loginTecnico,
    logoutTecnico,
    refreshTecnicoToken,
    isTecnicoAuthenticated: !!tecnicoToken,
    isAuthenticated: !!tecnicoToken, // Alias para compatibilidad
  };

  return (
    <TecnicoAuthContext.Provider value={value}>
      {children}
    </TecnicoAuthContext.Provider>
  );
};
