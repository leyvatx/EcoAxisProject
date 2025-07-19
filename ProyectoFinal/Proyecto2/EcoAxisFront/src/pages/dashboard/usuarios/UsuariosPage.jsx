import React, { useState, useEffect } from 'react';
import Sidebar from '../../../components/dashboard/Sidebar';
import TopBar from '../../../components/dashboard/TopBar';
import { useAuth } from '../../../contexts/AuthContext';
import { usuariosAPI } from '../../../services/api';
import './UsuariosPage.css';

const UsuariosPage = () => {
  const { user } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState(null);
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    email_user: '',
    password: ''
  });

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const data = await usuariosAPI.getAll();
      setUsuarios(data);
    } catch (error) {
      console.error('Error fetching usuarios:', error);
      setError('Error al cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUsuario) {
        // Para edición, crear una copia del formData
        const updateData = { ...formData };
        
        // Si la contraseña está vacía, no la incluir en la actualización
        if (!formData.password || formData.password.trim() === '') {
          delete updateData.password;
        }
        
        console.log('Datos a enviar para actualización:', updateData);
        await usuariosAPI.update(editingUsuario.id, updateData);
      } else {
        // Para creación, verificar que todos los campos requeridos estén presentes
        if (!formData.password || formData.password.trim() === '') {
          setError('La contraseña es requerida para crear un nuevo usuario');
          return;
        }
        console.log('Datos a enviar para creación:', formData);
        await usuariosAPI.create(formData);
      }
      await fetchUsuarios();
      handleCloseModal();
      setError(''); // Limpiar errores previos
    } catch (error) {
      console.error('Error saving usuario:', error);
      setError('Error al guardar el usuario: ' + (error.message || 'Error desconocido'));
    }
  };

  const handleEdit = (usuario) => {
    setEditingUsuario(usuario);
    setFormData({
      nombres: usuario.nombres,
      apellidos: usuario.apellidos,
      email_user: usuario.email_user,
      password: ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este usuario?')) {
      try {
        await usuariosAPI.delete(id);
        await fetchUsuarios();
      } catch (error) {
        console.error('Error deleting usuario:', error);
        setError('Error al eliminar el usuario');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUsuario(null);
    setFormData({
      nombres: '',
      apellidos: '',
      email_user: '',
      password: ''
    });
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="dashboard-main">
        <TopBar />
        <div className="page-content">
          <div className="usuarios-page">
            <div className="page-header">
              <div className="header-content">
                <h2>Gestión de Usuarios</h2>
                <p>Administra los usuarios del sistema</p>
              </div>
              <button 
                className="btn-primary"
                onClick={() => setShowModal(true)}
              >
                + Nuevo Usuario
              </button>
            </div>

            {error && (
              <div className="alert alert-error">
                {error}
              </div>
            )}

            <div className="usuarios-stats">
              <div className="stat-card">
                <h3>Total Usuarios</h3>
                <p className="stat-number">{usuarios.length}</p>
              </div>
              <div className="stat-card">
                <h3>Activos</h3>
                <p className="stat-number">{usuarios.filter(u => u.is_active).length}</p>
              </div>
              <div className="stat-card">
                <h3>Administradores</h3>
                <p className="stat-number">{usuarios.filter(u => u.is_staff).length}</p>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3>Lista de Usuarios</h3>
                <div className="card-actions">
                  <input 
                    type="text" 
                    placeholder="Buscar usuarios..."
                    className="search-input"
                  />
                </div>
              </div>
              
              <div className="card-content">
                {loading ? (
                  <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Cargando usuarios...</p>
                  </div>
                ) : usuarios.length === 0 ? (
                  <div className="empty-state">
                    <h3>No hay usuarios registrados</h3>
                    <p>Agrega el primer usuario para comenzar</p>
                  </div>
                ) : (
                  <div className="usuarios-table-container">
                    <table className="usuarios-table">
                      <thead>
                        <tr>
                          <th>Foto</th>
                          <th>Nombre</th>
                          <th>Email</th>
                          <th>Rol</th>
                          <th>Estado</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {usuarios.map(usuario => (
                          <tr key={usuario.id}>
                            <td>
                              <div className="usuario-avatar">
                                <img 
                                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face&auto=format" 
                                  alt={`${usuario.nombres} ${usuario.apellidos}`}
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                  }}
                                />
                                <div className="avatar-fallback" style={{display: 'none'}}>
                                  👤
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="usuario-name-cell">
                                <strong>{usuario.nombres} {usuario.apellidos}</strong>
                                <div className="user-id">
                                  ID: {usuario.user_uuid?.slice(0, 8)}...
                                </div>
                              </div>
                            </td>
                            <td>{usuario.email_user}</td>
                            <td>
                              <span className={`role-badge ${usuario.is_superuser ? 'superuser' : usuario.is_staff ? 'staff' : 'user'}`}>
                                {usuario.is_superuser ? 'Super Admin' : usuario.is_staff ? 'Staff' : 'Usuario'}
                              </span>
                            </td>
                            <td>
                              <span className={`status-badge ${usuario.is_active ? 'active' : 'inactive'}`}>
                                {usuario.is_active ? 'Activo' : 'Inactivo'}
                              </span>
                            </td>
                            <td>
                              <div className="action-buttons">
                                <button 
                                  className="btn-icon btn-edit"
                                  onClick={() => handleEdit(usuario)}
                                  title="Editar"
                                >
                                  ✏️
                                </button>
                                <button 
                                  className="btn-icon btn-delete"
                                  onClick={() => handleDelete(usuario.id)}
                                  title="Eliminar"
                                >
                                  🗑️
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editingUsuario ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>
              <button 
                className="btn-close"
                onClick={handleCloseModal}
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Nombre *</label>
                  <input
                    type="text"
                    name="nombres"
                    value={formData.nombres}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Apellido *</label>
                  <input
                    type="text"
                    name="apellidos"
                    value={formData.apellidos}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email_user"
                    value={formData.email_user}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>{editingUsuario ? 'Nueva Contraseña (opcional)' : 'Contraseña *'}</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder={editingUsuario ? 'Dejar vacío para mantener la actual' : 'Ingrese la contraseña'}
                    required={!editingUsuario}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={handleCloseModal}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editingUsuario ? 'Actualizar' : 'Crear'} Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsuariosPage;
