import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔄 AuthProvider iniciando...');
    
    // Verificar datos almacenados al cargar
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    console.log('📦 Datos en localStorage:', { 
      hasUser: !!storedUser, 
      hasToken: !!storedToken
    });
    
    if (storedToken && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        console.log('👤 Usuario parseado correctamente:', userData);
        setUser(userData);
        setToken(storedToken);
        console.log('✅ Estado actualizado, validando token...');
        validateToken();
      } catch (error) {
        console.error('❌ Error parsing stored user data:', error);
        logout();
      }
    } else {
      console.log('⚠️ No hay datos almacenados completos');
      setLoading(false);
    }
  }, []);

  const validateToken = async () => {
    try {
      console.log('🔍 Validando token con backend...');
      const userData = await authAPI.me();
      console.log('✅ Token válido, datos del usuario actualizados:', userData);
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      setLoading(false);
    } catch (error) {
      console.error('❌ Token validation failed:', error);
      console.log('🧹 Eliminando datos inválidos y cerrando sesión...');
      logout();
    }
  };

  const login = async (email_user, password) => {
    try {
      console.log('🔐 Intentando login...');
      const response = await authAPI.login(email_user, password);
      console.log('📥 Respuesta del login:', response);
      
      // Extraer token y datos del usuario
      const { access, refresh, ...userData } = response;
      
      console.log('💾 Guardando datos en localStorage...', {
        hasAccess: !!access,
        hasRefresh: !!refresh,
        userData: userData
      });
      
      // Almacenar todo en localStorage
      localStorage.setItem('token', access);
      localStorage.setItem('refresh_token', refresh || '');
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Actualizar estado
      setToken(access);
      setUser(userData);
      
      console.log('✅ Login exitoso, usuario logueado');
      return { success: true, user: userData };
    } catch (error) {
      console.error('❌ Login failed:', error);
      return { 
        success: false, 
        error: error.message || 'Error al iniciar sesión' 
      };
    }
  };

  const logout = () => {
    console.log('🚪 Cerrando sesión...');
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setLoading(false);
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
