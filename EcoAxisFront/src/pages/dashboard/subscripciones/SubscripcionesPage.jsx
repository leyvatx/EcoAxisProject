import React, { useState, useEffect } from 'react';
import Sidebar from '../../../components/dashboard/Sidebar';
import TopBar from '../../../components/dashboard/TopBar';
import { useAuth } from '../../../contexts/AuthContext';
import { subscripcionesAPI, empresasAPI } from '../../../services/api';
import './SubscripcionesPage.css';

const SubscripcionesPage = () => {
  const { user } = useAuth();
  const [subscripciones, setSubscripciones] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSubscripcion, setEditingSubscripcion] = useState(null);
  const [formData, setFormData] = useState({
    fecha_pago: '',
    siguiente_pago: '',
    estatus_sub: true,
    empresa: ''
  });

  useEffect(() => {
    fetchSubscripciones();
    fetchEmpresas();
  }, []);

  const fetchSubscripciones = async () => {
    try {
      setLoading(true);
      const data = await subscripcionesAPI.getAll();
      setSubscripciones(data);
    } catch (error) {
      console.error('Error fetching subscripciones:', error);
      setError('Error al cargar las suscripciones');
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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSubscripcion) {
        await subscripcionesAPI.update(editingSubscripcion.id, formData);
      } else {
        await subscripcionesAPI.create(formData);
      }
      await fetchSubscripciones();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving subscripcion:', error);
      setError('Error al guardar la suscripción');
    }
  };

  const handleEdit = (subscripcion) => {
    setEditingSubscripcion(subscripcion);
    setFormData({
      fecha_pago: subscripcion.fecha_pago,
      siguiente_pago: subscripcion.siguiente_pago,
      estatus_sub: subscripcion.estatus_sub,
      empresa: subscripcion.empresa
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta suscripción?')) {
      try {
        await subscripcionesAPI.delete(id);
        await fetchSubscripciones();
      } catch (error) {
        console.error('Error deleting subscripcion:', error);
        setError('Error al eliminar la suscripción');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSubscripcion(null);
    setFormData({
      fecha_pago: '',
      siguiente_pago: '',
      estatus_sub: true,
      empresa: ''
    });
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="dashboard-main">
        <TopBar />
        <div className="page-content">
          <div className="subscripciones-page">
            <div className="page-header">
              <div className="header-content">
                <h1>Gestión de Suscripciones</h1>
                <p>Administra las suscripciones de las empresas</p>
              </div>
              <button 
                className="btn-primary"
                onClick={() => setShowModal(true)}
              >
                + Nueva Suscripción
              </button>
            </div>

            {error && (
              <div className="alert alert-error">
                {error}
              </div>
            )}

            <div className="subscripciones-stats">
              <div className="stat-card">
                <h3>Total Suscripciones</h3>
                <p className="stat-number">{subscripciones.length}</p>
              </div>
              <div className="stat-card">
                <h3>Activas</h3>
                <p className="stat-number">{subscripciones.filter(s => s.estatus_sub).length}</p>
              </div>
              <div className="stat-card">
                <h3>Inactivas</h3>
                <p className="stat-number">{subscripciones.filter(s => !s.estatus_sub).length}</p>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3>Lista de Suscripciones</h3>
              </div>
              
              <div className="card-content">
                {loading ? (
                  <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Cargando suscripciones...</p>
                  </div>
                ) : (
                  <div className="table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Empresa</th>
                          <th>Fecha Pago</th>
                          <th>Próximo Pago</th>
                          <th>Estado</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subscripciones.map(subscripcion => (
                          <tr key={subscripcion.id}>
                            <td>{empresas.find(e => e.id === subscripcion.empresa)?.nombre_empresa || 'N/A'}</td>
                            <td>{new Date(subscripcion.fecha_pago).toLocaleDateString()}</td>
                            <td>{new Date(subscripcion.siguiente_pago).toLocaleDateString()}</td>
                            <td>
                              <span className={`status-badge ${subscripcion.estatus_sub ? 'activa' : 'inactiva'}`}>
                                {subscripcion.estatus_sub ? 'Activa' : 'Inactiva'}
                              </span>
                            </td>
                            <td>
                              <div className="action-buttons">
                                <button 
                                  className="btn-icon btn-edit"
                                  onClick={() => handleEdit(subscripcion)}
                                >
                                  ✏️
                                </button>
                                <button 
                                  className="btn-icon btn-delete"
                                  onClick={() => handleDelete(subscripcion.id)}
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
              <h3>{editingSubscripcion ? 'Editar Suscripción' : 'Nueva Suscripción'}</h3>
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
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      name="estatus_sub"
                      checked={formData.estatus_sub}
                      onChange={handleInputChange}
                    />
                    Suscripción Activa
                  </label>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Fecha de Pago *</label>
                  <input
                    type="date"
                    name="fecha_pago"
                    value={formData.fecha_pago}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Próximo Pago *</label>
                  <input
                    type="date"
                    name="siguiente_pago"
                    value={formData.siguiente_pago}
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
                  {editingSubscripcion ? 'Actualizar' : 'Crear'} Suscripción
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscripcionesPage;
