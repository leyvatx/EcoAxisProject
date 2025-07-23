import React, { useState, useEffect } from 'react';
import Sidebar from '../../../components/dashboard/Sidebar';
import TopBar from '../../../components/dashboard/TopBar';
import { useAuth } from '../../../contexts/AuthContext';
import { tecnicosAPI, empresasAPI, sucursalesAPI, tiposTecnicoAPI } from '../../../services/api';
import './TecnicosPage.css';

const TecnicosPage = () => {
  const { user } = useAuth();
  const [tecnicos, setTecnicos] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [tiposTecnico, setTiposTecnico] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTecnico, setEditingTecnico] = useState(null);
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    email_user: '',
    password: '',
    telefono: '',
    sucursal: '',
    empresa: '',
    tipo_tecnico: ''
  });

  useEffect(() => {
    fetchTecnicos();
    fetchEmpresas();
    fetchTiposTecnico();
  }, []);

  const fetchTecnicos = async () => {
    try {
      setLoading(true);
      const data = await tecnicosAPI.getAll();
      setTecnicos(data);
    } catch (error) {
      console.error('Error fetching tecnicos:', error);
      setError('Error al cargar los técnicos');
    } finally {
      setLoading(false);
    }
  };

  const fetchEmpresas = async () => {
    try {
      const data = await empresasAPI.getAll();
      setEmpresas(data);
    } catch (error) {
      console.error('Error fetching empresas:', error);
    }
  };

  const fetchTiposTecnico = async () => {
    try {
      console.log('Fetching tipos de tecnico...');
      const data = await tiposTecnicoAPI.getAll();
      console.log('Tipos de tecnico received:', data);
      setTiposTecnico(data);
    } catch (error) {
      console.error('Error fetching tipos tecnico:', error);
    }
  };

  const fetchSucursalesByEmpresa = async (empresaId) => {
    try {
      const data = await sucursalesAPI.getAll();
      setSucursales(data.filter(s => s.empresa === parseInt(empresaId)));
    } catch (error) {
      console.error('Error fetching sucursales:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Si cambió la empresa, cargar sus sucursales
    if (name === 'empresa' && value) {
      fetchSucursalesByEmpresa(value);
      setFormData(prev => ({ ...prev, sucursal: '' })); // Reset sucursal
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tecnicoData = { ...formData };
      
      // Si estamos editando y no se proporcionó nueva contraseña, no enviar el campo password
      if (editingTecnico && !tecnicoData.password) {
        delete tecnicoData.password;
      }
      
      if (editingTecnico) {
        await tecnicosAPI.update(editingTecnico.id, tecnicoData);
      } else {
        // Al crear, la contraseña es obligatoria
        if (!tecnicoData.password) {
          setError('La contraseña es obligatoria para nuevos técnicos');
          return;
        }
        await tecnicosAPI.create(tecnicoData);
      }
      await fetchTecnicos();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving tecnico:', error);
      setError('Error al guardar el técnico');
    }
  };

  const handleEdit = (tecnico) => {
    setEditingTecnico(tecnico);
    setFormData({
      nombres: tecnico.nombres,
      apellidos: tecnico.apellidos,
      email_user: tecnico.email_user,
      password: '', // No mostrar la contraseña existente
      telefono: tecnico.telefono,
      sucursal: tecnico.sucursal || '',
      empresa: tecnico.empresa || '',
      tipo_tecnico: tecnico.tipo_tecnico || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este técnico?')) {
      try {
        await tecnicosAPI.delete(id);
        await fetchTecnicos();
      } catch (error) {
        console.error('Error deleting tecnico:', error);
        setError('Error al eliminar el técnico');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTecnico(null);
    setFormData({
      nombres: '',
      apellidos: '',
      email_user: '',
      password: '',
      telefono: '',
      sucursal: '',
      empresa: '',
      tipo_tecnico: ''
    });
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="dashboard-main">
        <TopBar />
        <div className="page-content">
          <div className="tecnicos-page">
            <div className="page-header">
              <div className="header-content">
              </div>
              <button 
                className="btn-primary"
                onClick={() => setShowModal(true)}
              >
                + Nuevo Técnico
              </button>
            </div>

            {error && (
              <div className="alert alert-error">
                {error}
              </div>
            )}

            <div className="tecnicos-stats">
              <div className="stat-card">
                <h3>Total Técnicos</h3>
                <p className="stat-number">{tecnicos.length}</p>
              </div>
              <div className="stat-card">
                <h3>Disponibles</h3>
                <p className="stat-number">{tecnicos.filter(t => t.is_active).length}</p>
              </div>
              <div className="stat-card">
                <h3>Tipos de Técnico</h3>
                <p className="stat-number">{tiposTecnico.length}</p>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3>Lista de Técnicos</h3>
                <div className="card-actions">
                  <input 
                    type="text" 
                    placeholder="Buscar técnicos..."
                    className="search-input"
                  />
                </div>
              </div>
              
              <div className="card-content">
                {loading ? (
                  <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Cargando técnicos...</p>
                  </div>
                ) : tecnicos.length === 0 ? (
                  <div className="empty-state">
                    <h3>No hay técnicos registrados</h3>
                    <p>Agrega el primer técnico para comenzar</p>
                  </div>
                ) : (
                  <div className="tecnicos-table-container">
                    <table className="tecnicos-table">
                      <thead>
                        <tr>
                          <th>Foto</th>
                          <th>Nombre</th>
                          <th>Email</th>
                          <th>Teléfono</th>
                          <th>Tipo</th>
                          <th>Estado</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tecnicos.map(tecnico => (
                          <tr key={tecnico.id}>
                            <td>
                              <div className="tecnico-avatar">
                                <img 
                                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face&auto=format" 
                                  alt={`${tecnico.nombres} ${tecnico.apellidos}`}
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                  }}
                                />
                                <div className="avatar-fallback" style={{display: 'none'}}>
                                  👷‍♂️
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="tecnico-name-cell">
                                <strong>{tecnico.nombres} {tecnico.apellidos}</strong>
                              </div>
                            </td>
                            <td>{tecnico.email_user}</td>
                            <td>{tecnico.telefono}</td>
                            <td>
                              <span className="tipo-badge">
                                {tecnico.tipo_tecnico || 'N/A'}
                              </span>
                            </td>
                            <td>
                              <span className={`status-badge ${tecnico.is_active ? 'active' : 'inactive'}`}>
                                {tecnico.is_active ? 'Disponible' : 'No disponible'}
                              </span>
                            </td>
                            <td>
                              <div className="action-buttons">
                                <button 
                                  className="btn-icon btn-edit"
                                  onClick={() => handleEdit(tecnico)}
                                  title="Editar"
                                >
                                  ✏️
                                </button>
                                <button 
                                  className="btn-icon btn-delete"
                                  onClick={() => handleDelete(tecnico.id)}
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
              <div className="modal-title">
                <div className="title-icon">
                  {editingTecnico ? '✏️' : '👷‍♂️'}
                </div>
                <div>
                  <h3>{editingTecnico ? 'Editar Técnico' : 'Nuevo Técnico'}</h3>
                  <p className="modal-subtitle">
                    {editingTecnico 
                      ? 'Modifica la información del técnico' 
                      : 'Completa los datos para registrar un nuevo técnico'
                    }
                  </p>
                </div>
              </div>
              <button 
                className="btn-close"
                onClick={handleCloseModal}
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-section">
                <h4 className="section-title">📋 Información Personal</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Nombre *</label>
                    <input
                      type="text"
                      name="nombres"
                      value={formData.nombres}
                      onChange={handleInputChange}
                      placeholder="Ej. Juan Carlos"
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
                      placeholder="Ej. García López"
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
                      placeholder="Ej. juan.garcia@empresa.com"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Teléfono *</label>
                    <input
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleInputChange}
                      placeholder="Ej. 664-123-4567"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h4 className="section-title">🔐 Acceso al Sistema</h4>
                <div className="password-section">
                  <div className="form-group">
                    <label>Contraseña {editingTecnico ? '(opcional)' : '*'}</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder={editingTecnico ? "••••••••" : "Mínimo 8 caracteres"}
                      required={!editingTecnico}
                    />
                    <div className="password-help">
                      {editingTecnico ? (
                        <div className="help-text">
                          <span className="help-icon">💡</span>
                          Deja vacío para mantener la contraseña actual
                        </div>
                      ) : (
                        <div className="password-requirements">
                          <div className="help-text">
                            <span className="help-icon">🔒</span>
                            La contraseña debe tener:
                          </div>
                          <ul className="requirements-list">
                            <li>• Mínimo 8 caracteres</li>
                            <li>• Al menos una letra y un número</li>
                            <li>• Evita caracteres especiales complejos</li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h4 className="section-title">🏢 Información Laboral</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Tipo de Técnico *</label>
                    <select
                      name="tipo_tecnico"
                      value={formData.tipo_tecnico}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Seleccionar tipo</option>
                      {tiposTecnico.map(tipo => (
                        <option key={tipo.id} value={tipo.id}>
                          {tipo.rol_tecnico}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Empresa *</label>
                    <select
                      name="empresa"
                      value={formData.empresa}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Seleccionar empresa</option>
                      {empresas.map(empresa => (
                        <option key={empresa.id} value={empresa.id}>
                          {empresa.nombre_empresa}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Sucursal *</label>
                    <select
                      name="sucursal"
                      value={formData.sucursal}
                      onChange={handleInputChange}
                      required
                      disabled={!formData.empresa}
                    >
                      <option value="">
                        {formData.empresa ? 'Seleccionar sucursal' : 'Primero selecciona una empresa'}
                      </option>
                      {sucursales.map(sucursal => (
                        <option key={sucursal.id} value={sucursal.id}>
                          {sucursal.nombre_sucursal}
                        </option>
                      ))}
                    </select>
                    {!formData.empresa && (
                      <div className="help-text">
                        <span className="help-icon">ℹ️</span>
                        Selecciona una empresa para ver las sucursales disponibles
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={handleCloseModal}
                >
                  <span>❌</span>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  <span>{editingTecnico ? '💾' : '✅'}</span>
                  {editingTecnico ? 'Actualizar' : 'Crear'} Técnico
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TecnicosPage;
