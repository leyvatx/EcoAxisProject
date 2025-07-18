import React, { useState, useEffect } from 'react';
import Sidebar from '../../../components/dashboard/Sidebar';
import TopBar from '../../../components/dashboard/TopBar';
import { useAuth } from '../../../contexts/AuthContext';
import { pagosAPI, empresasAPI, subscripcionesAPI } from '../../../services/api';
import './PagosPage.css';

const PagosPage = () => {
  const { user } = useAuth();
  const [pagos, setPagos] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [subscripciones, setSubscripciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPago, setEditingPago] = useState(null);
  const [formData, setFormData] = useState({
    monto_pagado: '',
    metodo_pago: '',
    estado_pago: 'Pendiente',
    empresa: '',
    subscripcion: ''
  });

  useEffect(() => {
    fetchPagos();
    fetchEmpresas();
    fetchSubscripciones();
  }, []);

  const fetchPagos = async () => {
    try {
      setLoading(true);
      const data = await pagosAPI.getAll();
      setPagos(data);
    } catch (error) {
      console.error('Error fetching pagos:', error);
      setError('Error al cargar los pagos');
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

  const fetchSubscripciones = async () => {
    try {
      const data = await subscripcionesAPI.getAll();
      setSubscripciones(data);
    } catch (error) {
      console.error('Error fetching subscripciones:', error);
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
      if (editingPago) {
        await pagosAPI.update(editingPago.id, formData);
      } else {
        await pagosAPI.create(formData);
      }
      await fetchPagos();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving pago:', error);
      setError('Error al guardar el pago');
    }
  };

  const handleEdit = (pago) => {
    setEditingPago(pago);
    setFormData({
      monto_pagado: pago.monto_pagado,
      metodo_pago: pago.metodo_pago,
      estado_pago: pago.estado_pago,
      empresa: pago.empresa,
      subscripcion: pago.subscripcion
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este pago?')) {
      try {
        await pagosAPI.delete(id);
        await fetchPagos();
      } catch (error) {
        console.error('Error deleting pago:', error);
        setError('Error al eliminar el pago');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPago(null);
    setFormData({
      monto_pagado: '',
      metodo_pago: '',
      estado_pago: 'Pendiente',
      empresa: '',
      subscripcion: ''
    });
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="dashboard-main">
        <TopBar />
        <div className="page-content">
          <div className="pagos-page">
            <div className="page-header">
              <div className="header-content">
                <h1>Gestión de Pagos</h1>
                <p>Administra los pagos de suscripciones</p>
              </div>
              <button 
                className="btn-primary"
                onClick={() => setShowModal(true)}
              >
                + Nuevo Pago
              </button>
            </div>

            {error && (
              <div className="alert alert-error">
                {error}
              </div>
            )}

            <div className="pagos-stats">
              <div className="stat-card">
                <h3>Total Pagos</h3>
                <p className="stat-number">{pagos.length}</p>
              </div>
              <div className="stat-card">
                <h3>Pagos Exitosos</h3>
                <p className="stat-number">{pagos.filter(p => p.estado_pago === 'Exitoso').length}</p>
              </div>
              <div className="stat-card">
                <h3>Ingresos Totales</h3>
                <p className="stat-number">
                  ${pagos.filter(p => p.estado_pago === 'Exitoso')
                         .reduce((sum, p) => sum + parseFloat(p.monto_pagado || 0), 0)
                         .toFixed(2)}
                </p>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3>Lista de Pagos</h3>
              </div>
              
              <div className="card-content">
                {loading ? (
                  <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Cargando pagos...</p>
                  </div>
                ) : (
                  <div className="table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Fecha</th>
                          <th>Monto</th>
                          <th>Método</th>
                          <th>Estado</th>
                          <th>Empresa</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pagos.map(pago => (
                          <tr key={pago.id}>
                            <td>{new Date(pago.fecha_pago).toLocaleDateString()}</td>
                            <td>${pago.monto_pagado}</td>
                            <td>{pago.metodo_pago}</td>
                            <td>
                              <span className={`status-badge ${pago.estado_pago.toLowerCase()}`}>
                                {pago.estado_pago}
                              </span>
                            </td>
                            <td>{empresas.find(e => e.id === pago.empresa)?.nombre_empresa || 'N/A'}</td>
                            <td>
                              <div className="action-buttons">
                                <button 
                                  className="btn-icon btn-edit"
                                  onClick={() => handleEdit(pago)}
                                >
                                  ✏️
                                </button>
                                <button 
                                  className="btn-icon btn-delete"
                                  onClick={() => handleDelete(pago.id)}
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
              <h3>{editingPago ? 'Editar Pago' : 'Nuevo Pago'}</h3>
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
                  <label>Monto *</label>
                  <input
                    type="number"
                    step="0.01"
                    name="monto_pagado"
                    value={formData.monto_pagado}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Método de Pago *</label>
                  <select
                    name="metodo_pago"
                    value={formData.metodo_pago}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccionar método</option>
                    <option value="Tarjeta">Tarjeta</option>
                    <option value="Transferencia">Transferencia</option>
                    <option value="PayPal">PayPal</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Estado *</label>
                  <select
                    name="estado_pago"
                    value={formData.estado_pago}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="Exitoso">Exitoso</option>
                    <option value="Fallido">Fallido</option>
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
                  <label>Suscripción *</label>
                  <select
                    name="subscripcion"
                    value={formData.subscripcion}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccionar suscripción</option>
                    {subscripciones.map(sub => (
                      <option key={sub.id} value={sub.id}>
                        Suscripción #{sub.id} - {empresas.find(e => e.id === sub.empresa)?.nombre_empresa}
                      </option>
                    ))}
                  </select>
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
                  {editingPago ? 'Actualizar' : 'Crear'} Pago
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PagosPage;
