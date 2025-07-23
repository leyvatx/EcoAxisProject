import React, { useState } from 'react';
import { useTecnicoAuth } from '../../contexts/TecnicoAuthContext';
import { useNavigate } from 'react-router-dom';
import './TecnicoLogin.css';

const TecnicoLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { loginTecnico } = useTecnicoAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Limpiar errores al escribir
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await loginTecnico(formData.email, formData.password);
      
      if (result.success) {
        console.log('✅ Login exitoso, redirigiendo...');
        navigate('/tecnico-dashboard');
      } else {
        setError(result.error || 'Error en el login');
      }
    } catch (error) {
      console.error('Error en login:', error);
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tecnico-login-container">
      <div className="tecnico-login-card">
        <div className="tecnico-login-header">
          <h2>🔧 Login Técnicos</h2>
          <p>Acceso exclusivo para personal técnico</p>
        </div>

        <form onSubmit={handleSubmit} className="tecnico-login-form">
          {error && (
            <div className="error-message">
              <span>⚠️ {error}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tecnico@empresa.com"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className={`login-button ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Iniciando sesión...
              </>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </form>

        <div className="tecnico-login-footer">
          <p>¿No tienes acceso? Contacta al administrador</p>
          <button 
            className="back-button"
            onClick={() => navigate('/')}
          >
            ← Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
};

export default TecnicoLogin;
