import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { useAuth } from '../../../contexts/AuthContext';
import { mantenimientosAPI, tecnicosAPI, empresasAPI, productosEmpresasAPI } from '../../../services/api';
import './MantenimientosPage.css';

const MantenimientosPage = () => {
  const { user } = useAuth();
  const [mantenimientos, setMantenimientos] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingMantenimiento, setEditingMantenimiento] = useState(null);
  const [formData, setFormData] = useState({
    fecha_mantenimiento: '',
    tipo_mantenimiento: '',
    estado_equipo: '',
    proximo_mantenimiento: '',
    producto_empresa: '',
    tecnico: ''
  });

  useEffect(() => {
    fetchMantenimientos();
    fetchTecnicos();
    fetchEmpresas();
    fetchProductos();
  }, []);

  const fetchMantenimientos = async () => {
    try {
      setLoading(true);
      const data = await mantenimientosAPI.getAll();
      setMantenimientos(data);
    } catch (error) {
      console.error('Error fetching mantenimientos:', error);
      setError('Error al cargar los mantenimientos');
    } finally {
      setLoading(false);
    }
  };

  const fetchTecnicos = async () => {
    try {
      const data = await tecnicosAPI.getAll();
      setTecnicos(data);
    } catch (error) {
      console.error('Error fetching tecnicos:', error);
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

  const fetchProductos = async () => {
    try {
      const data = await productosEmpresasAPI.getAll();
      setProductos(data);
    } catch (error) {
      console.error('Error fetching productos:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMantenimiento) {
        await mantenimientosAPI.update(editingMantenimiento.id, formData);
      } else {
        await mantenimientosAPI.create(formData);
      }
      await fetchMantenimientos();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving mantenimiento:', error);
      setError('Error al guardar el mantenimiento');
    }
  };

  const handleEdit = (mantenimiento) => {
    setEditingMantenimiento(mantenimiento);
    setFormData({
      fecha_mantenimiento: mantenimiento.fecha_mantenimiento,
      tipo_mantenimiento: mantenimiento.tipo_mantenimiento,
      estado_equipo: mantenimiento.estado_equipo,
      proximo_mantenimiento: mantenimiento.proximo_mantenimiento,
      producto_empresa: mantenimiento.producto_empresa,
      tecnico: mantenimiento.tecnico
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este mantenimiento?')) {
      try {
        await mantenimientosAPI.delete(id);
        await fetchMantenimientos();
      } catch (error) {
        console.error('Error deleting mantenimiento:', error);
        setError('Error al eliminar el mantenimiento');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingMantenimiento(null);
    setFormData({
      fecha_mantenimiento: '',
      tipo_mantenimiento: '',
      estado_equipo: '',
      proximo_mantenimiento: '',
      producto_empresa: '',
      tecnico: ''
    });
  };

  return (
    <DashboardLayout>
      <div className="mantenimientos-page">
        <div className="page-header">
          <div className="header-content">
          </div>
          <button 
            className="btn-primary"
            onClick={() => setShowModal(true)}
          >
            + Nuevo Mantenimiento
          </button>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <div className="mantenimientos-stats">
          <div className="stat-card">
            <h3>Total Mantenimientos</h3>
            <p className="stat-number">{mantenimientos.length}</p>
          </div>
          <div className="stat-card">
            <h3>Equipos Excelentes</h3>
            <p className="stat-number">{mantenimientos.filter(m => m.estado_equipo === 'Excelente').length}</p>
          </div>
          <div className="stat-card">
            <h3>Requieren Atención</h3>
            <p className="stat-number">{mantenimientos.filter(m => ['Regular', 'Mala', 'Muy mala'].includes(m.estado_equipo)).length}</p>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Lista de Mantenimientos</h3>
          </div>
          
          <div className="card-content">
            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Cargando mantenimientos...</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Tipo</th>
                      <th>Estado Equipo</th>
                      <th>Próximo Mant.</th>
                      <th>Producto</th>
                      <th>Técnico</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mantenimientos.map(mantenimiento => (
                      <tr key={mantenimiento.id}>
                        <td>{new Date(mantenimiento.fecha_mantenimiento).toLocaleDateString()}</td>
                        <td>{mantenimiento.tipo_mantenimiento}</td>
                        <td>
                          <span className={`status-badge ${mantenimiento.estado_equipo.toLowerCase().replace(' ', '-')}`}>
                            {mantenimiento.estado_equipo}
                          </span>
                        </td>
                        <td>{new Date(mantenimiento.proximo_mantenimiento).toLocaleDateString()}</td>
                        <td>{productos.find(p => p.id === mantenimiento.producto_empresa)?.alias_producto || 'N/A'}</td>
                        <td>{tecnicos.find(t => t.id === mantenimiento.tecnico)?.nombres || 'N/A'}</td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              className="btn-icon btn-edit"
                              onClick={() => handleEdit(mantenimiento)}
                            >
                              ✏️
                            </button>
                            <button 
                              className="btn-icon btn-delete"
                              onClick={() => handleDelete(mantenimiento.id)}
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

        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3>{editingMantenimiento ? 'Editar Mantenimiento' : 'Nuevo Mantenimiento'}</h3>
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
                    <label>Tipo de Mantenimiento *</label>
                    <input
                      type="text"
                      name="tipo_mantenimiento"
                      value={formData.tipo_mantenimiento}
                      onChange={handleInputChange}
                      placeholder="Ej: Mantenimiento preventivo"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Estado del Equipo *</label>
                    <select
                      name="estado_equipo"
                      value={formData.estado_equipo}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Seleccionar estado</option>
                      <option value="Excelente">Excelente</option>
                      <option value="Muy buena">Muy buena</option>
                      <option value="Regular">Regular</option>
                      <option value="Mala">Mala</option>
                      <option value="Muy mala">Muy mala</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Fecha Mantenimiento *</label>
                    <input
                      type="date"
                      name="fecha_mantenimiento"
                      value={formData.fecha_mantenimiento}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Próximo Mantenimiento *</label>
                    <input
                      type="date"
                      name="proximo_mantenimiento"
                      value={formData.proximo_mantenimiento}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Técnico Asignado *</label>
                    <select
                      name="tecnico"
                      value={formData.tecnico}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Seleccionar técnico</option>
                      {tecnicos.map(tecnico => (
                        <option key={tecnico.id} value={tecnico.id}>
                          {tecnico.nombres} {tecnico.apellidos}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Producto/Equipo *</label>
                    <select
                      name="producto_empresa"
                      value={formData.producto_empresa}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Seleccionar producto</option>
                      {productos.map(producto => (
                        <option key={producto.id} value={producto.id}>
                          {producto.alias_producto} - {producto.catalogo_info?.nombre_producto || 'Sin información de catálogo'}
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
                    {editingMantenimiento ? 'Actualizar' : 'Crear'} Mantenimiento
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MantenimientosPage;
