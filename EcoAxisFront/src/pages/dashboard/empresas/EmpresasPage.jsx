import React, { useState, useEffect } from 'react';
import Sidebar from '../../../components/dashboard/Sidebar';
import TopBar from '../../../components/dashboard/TopBar';
import { useAuth } from '../../../contexts/AuthContext';
import { empresasAPI } from '../../../services/api';
import './EmpresasPage.css';

const EmpresasPage = () => {
  const { user } = useAuth();
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingEmpresa, setEditingEmpresa] = useState(null);
  const [formData, setFormData] = useState({
    nombre_empresa: '',
    rfc: '',
    giro_empresa: '',
    tamano_empresa: 'Mediana',
    telefono_empresa: '',
    estado_empresa: 'Tijuana',
    colonia_empresa: '',
    calle_empresa: '',
    codigo_postal_empresa: '',
    num_externo_empresa: '',
    num_interno_empresa: ''
  });

  useEffect(() => {
    fetchEmpresas();
  }, []);

  const fetchEmpresas = async () => {
    try {
      setLoading(true);
      console.log('Intentando obtener empresas...');
      const response = await empresasAPI.getAll();
      console.log('Respuesta de la API:', response);
      // Si la respuesta es un array directamente, usarlo, sino usar response.data
      setEmpresas(Array.isArray(response) ? response : response.data || []);
      setError('');
    } catch (error) {
      console.error('Error al obtener empresas:', error);
      setError(`Error al cargar las empresas: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.nombre_empresa.trim()) {
      setError('El nombre de la empresa es requerido');
      return false;
    }
    if (!formData.rfc.trim()) {
      setError('El RFC es requerido');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    try {
      if (editingEmpresa) {
        await empresasAPI.update(editingEmpresa.id, formData);
      } else {
        await empresasAPI.create(formData);
      }
      
      setShowModal(false);
      setEditingEmpresa(null);
      setFormData({
        nombre_empresa: '',
        rfc: '',
        giro_empresa: '',
        tamano_empresa: 'Mediana',
        telefono_empresa: '',
        estado_empresa: 'Tijuana',
        colonia_empresa: '',
        calle_empresa: '',
        codigo_postal_empresa: '',
        num_externo_empresa: '',
        num_interno_empresa: ''
      });
      fetchEmpresas();
    } catch (error) {
      console.error('Error al guardar empresa:', error);
      setError('Error al guardar la empresa');
    }
  };

  const handleEdit = (empresa) => {
    setEditingEmpresa(empresa);
    setFormData({
      nombre_empresa: empresa.nombre_empresa || '',
      rfc: empresa.rfc || '',
      giro_empresa: empresa.giro_empresa || '',
      tamano_empresa: empresa.tamano_empresa || 'Mediana',
      telefono_empresa: empresa.telefono_empresa || '',
      estado_empresa: empresa.estado_empresa || 'Tijuana',
      colonia_empresa: empresa.colonia_empresa || '',
      calle_empresa: empresa.calle_empresa || '',
      codigo_postal_empresa: empresa.codigo_postal_empresa || '',
      num_externo_empresa: empresa.num_externo_empresa || '',
      num_interno_empresa: empresa.num_interno_empresa || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (empresaId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta empresa?')) {
      try {
        console.log('Intentando eliminar empresa con ID:', empresaId);
        await empresasAPI.delete(empresaId);
        console.log('Empresa eliminada exitosamente');
        fetchEmpresas();
        setError(''); // Limpiar cualquier error previo
      } catch (error) {
        console.error('Error al eliminar empresa:', error);
        setError(`Error al eliminar la empresa: ${error.message}`);
      }
    }
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="dashboard-main">
        <TopBar />
        <div className="empresas-content">
          <div className="empresas-header">
            <div>
              <h1>Gestión de Empresas</h1>
              <p>Administra las empresas del sistema</p>
            </div>
            <button 
              className="btn-primary"
              onClick={() => setShowModal(true)}
            >
              <span>🏢</span>
              Nueva Empresa
            </button>
          </div>

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <div className="empresas-stats">
            <div className="stat-card">
              <h3>Total Empresas</h3>
              <p className="stat-number">{empresas.length}</p>
            </div>
            <div className="stat-card">
              <h3>Empresas Activas</h3>
              <p className="stat-number">{empresas.filter(e => e.estado_empresa).length}</p>
            </div>
            <div className="stat-card">
              <h3>Estados</h3>
              <p className="stat-number">{[...new Set(empresas.map(e => e.estado_empresa))].length}</p>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3>Lista de Empresas</h3>
              <div className="card-actions">
                <input 
                  type="text" 
                  placeholder="Buscar empresas..."
                  className="search-input"
                />
              </div>
            </div>
            
            <div className="card-content">
              {loading ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>Cargando empresas...</p>
                </div>
              ) : (
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Empresa</th>
                        <th>RFC</th>
                        <th>Giro</th>
                        <th>Tamaño</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {empresas.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="text-center">
                            No hay empresas registradas
                          </td>
                        </tr>
                      ) : (
                        empresas.map(empresa => (
                          <tr key={empresa.id}>
                            <td>
                              <div>
                                <div className="font-semibold text-gray-800">{empresa.nombre_empresa}</div>
                                <div className="text-sm text-gray-500">{empresa.estado_empresa}</div>
                              </div>
                            </td>
                            <td>
                              <span className="font-medium">{empresa.rfc}</span>
                            </td>
                            <td>
                              <span className="badge badge-blue">{empresa.giro_empresa}</span>
                            </td>
                            <td>
                              <span className={`badge ${empresa.tamano_empresa === 'Grande' ? 'badge-green' : 
                                              empresa.tamano_empresa === 'Mediana' ? 'badge-yellow' : 'badge-gray'}`}>
                                {empresa.tamano_empresa}
                              </span>
                            </td>
                            <td>
                              <span className="text-gray-600">{empresa.estado_empresa}</span>
                            </td>
                            <td>
                              <div className="action-buttons">
                                <button 
                                  onClick={() => handleEdit(empresa)}
                                  className="btn-action btn-edit"
                                  title="Editar"
                                >
                                  ✏️
                                </button>
                                <button 
                                  onClick={() => handleDelete(empresa.id)}
                                  className="btn-action btn-delete"
                                  title="Eliminar"
                                >
                                  🗑️
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editingEmpresa ? 'Editar Empresa' : 'Nueva Empresa'}</h3>
              <button 
                className="btn-close"
                onClick={() => {
                  setShowModal(false);
                  setEditingEmpresa(null);
                  setFormData({
                    nombre_empresa: '',
                    rfc: '',
                    giro_empresa: '',
                    tamano_empresa: 'Mediana',
                    telefono_empresa: '',
                    estado_empresa: 'Tijuana',
                    colonia_empresa: '',
                    calle_empresa: '',
                    codigo_postal_empresa: '',
                    num_externo_empresa: '',
                    num_interno_empresa: ''
                  });
                }}
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Nombre de la Empresa *</label>
                    <input
                      type="text"
                      name="nombre_empresa"
                      value={formData.nombre_empresa}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>RFC *</label>
                    <input
                      type="text"
                      name="rfc"
                      value={formData.rfc}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Giro Empresarial</label>
                    <input
                      type="text"
                      name="giro_empresa"
                      value={formData.giro_empresa}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Tamaño de Empresa</label>
                    <select
                      name="tamano_empresa"
                      value={formData.tamano_empresa}
                      onChange={handleInputChange}
                    >
                      <option value="Pequeña">Pequeña</option>
                      <option value="Mediana">Mediana</option>
                      <option value="Grande">Grande</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Teléfono</label>
                    <input
                      type="tel"
                      name="telefono_empresa"
                      value={formData.telefono_empresa}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Estado</label>
                    <select
                      name="estado_empresa"
                      value={formData.estado_empresa}
                      onChange={handleInputChange}
                    >
                      <option value="Tijuana">Tijuana</option>
                      <option value="Mexicali">Mexicali</option>
                      <option value="Ensenada">Ensenada</option>
                      <option value="Tecate">Tecate</option>
                      <option value="Playas de rosarito">Playas de Rosarito</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Colonia</label>
                    <input
                      type="text"
                      name="colonia_empresa"
                      value={formData.colonia_empresa}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Calle</label>
                    <input
                      type="text"
                      name="calle_empresa"
                      value={formData.calle_empresa}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Código Postal</label>
                    <input
                      type="text"
                      name="codigo_postal_empresa"
                      value={formData.codigo_postal_empresa}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Número Exterior</label>
                    <input
                      type="text"
                      name="num_externo_empresa"
                      value={formData.num_externo_empresa}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Número Interior</label>
                    <input
                      type="text"
                      name="num_interno_empresa"
                      value={formData.num_interno_empresa}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
              
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowModal(false);
                    setEditingEmpresa(null);
                  }}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingEmpresa ? 'Actualizar' : 'Crear'} Empresa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmpresasPage;
