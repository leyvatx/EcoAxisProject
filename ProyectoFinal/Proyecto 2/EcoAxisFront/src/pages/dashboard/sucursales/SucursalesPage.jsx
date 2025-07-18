import React, { useState, useEffect } from 'react';
import Sidebar from '../../../components/dashboard/Sidebar';
import TopBar from '../../../components/dashboard/TopBar';
import { useAuth } from '../../../contexts/AuthContext';
import { sucursalesAPI, empresasAPI } from '../../../services/api';
import './SucursalesPage.css';

const SucursalesPage = () => {
  const { user } = useAuth();
  const [sucursales, setSucursales] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSucursal, setEditingSucursal] = useState(null);
  const [formData, setFormData] = useState({
    nombre_sucursal: '',
    colonia_sucursal: '',
    calle_sucursal: '',
    codigo_postal_sucursal: '',
    num_externo_sucursal: '',
    num_interno_sucursal: '',
    empresa: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [sucursalesData, empresasData] = await Promise.all([
        sucursalesAPI.getAll(),
        empresasAPI.getAll()
      ]);
      setSucursales(sucursalesData);
      setEmpresas(empresasData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error al cargar los datos');
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
      if (editingSucursal) {
        await sucursalesAPI.update(editingSucursal.id, formData);
      } else {
        await sucursalesAPI.create(formData);
      }
      await fetchData();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving sucursal:', error);
      setError('Error al guardar la sucursal');
    }
  };

  const handleEdit = (sucursal) => {
    setEditingSucursal(sucursal);
    setFormData({
      nombre_sucursal: sucursal.nombre_sucursal,
      colonia_sucursal: sucursal.colonia_sucursal,
      calle_sucursal: sucursal.calle_sucursal,
      codigo_postal_sucursal: sucursal.codigo_postal_sucursal,
      num_externo_sucursal: sucursal.num_externo_sucursal,
      num_interno_sucursal: sucursal.num_interno_sucursal || '',
      empresa: sucursal.empresa
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta sucursal?')) {
      try {
        await sucursalesAPI.delete(id);
        await fetchData();
      } catch (error) {
        console.error('Error deleting sucursal:', error);
        setError('Error al eliminar la sucursal');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSucursal(null);
    setFormData({
      nombre_sucursal: '',
      colonia_sucursal: '',
      calle_sucursal: '',
      codigo_postal_sucursal: '',
      num_externo_sucursal: '',
      num_interno_sucursal: '',
      empresa: ''
    });
  };

  const getEmpresaName = (empresaId) => {
    const empresa = empresas.find(e => e.id === empresaId);
    return empresa ? empresa.nombre_empresa : 'N/A';
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="dashboard-main">
        <TopBar />
        <div className="page-content">
          <div className="sucursales-page">
            <div className="page-header">
              <div className="header-content">
                <h1>Gestión de Sucursales</h1>
                <p>Administra las sucursales de las empresas</p>
              </div>
              <button 
                className="btn-primary"
                onClick={() => setShowModal(true)}
              >
                + Nueva Sucursal
              </button>
            </div>

            {error && (
              <div className="alert alert-error">
                {error}
              </div>
            )}

            <div className="sucursales-stats">
              <div className="stat-card">
                <h3>Total Sucursales</h3>
                <p className="stat-number">{sucursales.length}</p>
              </div>
              <div className="stat-card">
                <h3>Empresas</h3>
                <p className="stat-number">{empresas.length}</p>
              </div>
              <div className="stat-card">
                <h3>Ciudades</h3>
                <p className="stat-number">{[...new Set(sucursales.map(s => s.colonia_sucursal))].length}</p>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3>Lista de Sucursales</h3>
                <div className="card-actions">
                  <input 
                    type="text" 
                    placeholder="Buscar sucursales..."
                    className="search-input"
                  />
                </div>
              </div>
              
              <div className="card-content">
                {loading ? (
                  <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Cargando sucursales...</p>
                  </div>
                ) : (
                  <div className="table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Sucursal</th>
                          <th>Empresa</th>
                          <th>Dirección</th>
                          <th>Código Postal</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sucursales.map(sucursal => (
                          <tr key={sucursal.id}>
                            <td>
                              <div className="sucursal-info">
                                <div className="sucursal-name">
                                  {sucursal.nombre_sucursal}
                                </div>
                                <div className="sucursal-id">
                                  ID: {sucursal.id}
                                </div>
                              </div>
                            </td>
                            <td>{getEmpresaName(sucursal.empresa)}</td>
                            <td>
                              <div className="address-info">
                                <div>{sucursal.calle_sucursal} #{sucursal.num_externo_sucursal}</div>
                                <div>{sucursal.colonia_sucursal}</div>
                              </div>
                            </td>
                            <td>{sucursal.codigo_postal_sucursal}</td>
                            <td>
                              <div className="action-buttons">
                                <button 
                                  className="btn-icon btn-edit"
                                  onClick={() => handleEdit(sucursal)}
                                  title="Editar"
                                >
                                  ✏️
                                </button>
                                <button 
                                  className="btn-icon btn-delete"
                                  onClick={() => handleDelete(sucursal.id)}
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
              <h3>{editingSucursal ? 'Editar Sucursal' : 'Nueva Sucursal'}</h3>
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
                  <label>Nombre de Sucursal *</label>
                  <input
                    type="text"
                    name="nombre_sucursal"
                    value={formData.nombre_sucursal}
                    onChange={handleInputChange}
                    required
                  />
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
                  <label>Calle *</label>
                  <input
                    type="text"
                    name="calle_sucursal"
                    value={formData.calle_sucursal}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Colonia *</label>
                  <input
                    type="text"
                    name="colonia_sucursal"
                    value={formData.colonia_sucursal}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Número Exterior *</label>
                  <input
                    type="text"
                    name="num_externo_sucursal"
                    value={formData.num_externo_sucursal}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Número Interior</label>
                  <input
                    type="text"
                    name="num_interno_sucursal"
                    value={formData.num_interno_sucursal}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Código Postal *</label>
                  <input
                    type="text"
                    name="codigo_postal_sucursal"
                    value={formData.codigo_postal_sucursal}
                    onChange={handleInputChange}
                    required
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
                  {editingSucursal ? 'Actualizar' : 'Crear'} Sucursal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SucursalesPage;
