import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../../../components/dashboard/Sidebar';
import TopBar from '../../../components/dashboard/TopBar';
import { catalogoAPI, productosEmpresasAPI, sucursalesAPI } from '../../../services/api';
import { useError, useSuccess } from '../../../contexts/ErrorContext';
import { validateForm } from '../../../utils/errorHandling';
import ConfirmModal from '../../../components/UI/ConfirmModal';
import './ProductosPage.css';

const ProductosPage = () => {
  const [productos, setProductos] = useState([]);
  const [catalogo, setCatalogo] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const { showError } = useError();
  const { showSuccess } = useSuccess();
  const [formData, setFormData] = useState({
    alias_producto: '',
    horas_uso_diario: '',
    dias_uso_mensual: '',
    ubicacion: '',
    catalogo: '',
    sucursal: ''
  });

  // Cargar datos iniciales
  useEffect(() => {
    let isMounted = true;
    
    const loadInitialData = async () => {
      try {
        // Pequeño delay para suavizar la carga
        await new Promise(resolve => setTimeout(resolve, 100));
        
        if (!isMounted) return;
        
        setLoading(true);
        const [productosData, catalogoData, sucursalesData] = await Promise.all([
          productosEmpresasAPI.getAll(),
          catalogoAPI.getAll(),
          sucursalesAPI.getAll()
        ]);
        
        if (isMounted) {
          setProductos(productosData);
          setCatalogo(catalogoData);
          setSucursales(sucursalesData);
        }
      } catch (error) {
        if (isMounted) {
          showError('No se pudieron cargar los productos');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadInitialData();
    
    return () => {
      isMounted = false;
    };
  }, [showError]);

  const loadData = useCallback(async () => {
    try {
      const [productosData, catalogoData, sucursalesData] = await Promise.all([
        productosEmpresasAPI.getAll(),
        catalogoAPI.getAll(),
        sucursalesAPI.getAll()
      ]);
      
      setProductos(productosData);
      setCatalogo(catalogoData);
      setSucursales(sucursalesData);
    } catch (error) {
      showError('No se pudieron cargar los productos');
    }
  }, [showError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    
    try {
      setLoading(true);
      
      // Validar campos requeridos
      validateForm(formData, ['alias_producto', 'horas_uso_diario', 'dias_uso_mensual', 'ubicacion', 'catalogo', 'sucursal']);
      
      const dataToSubmit = {
        ...formData,
        horas_uso_diario: parseFloat(formData.horas_uso_diario),
        dias_uso_mensual: parseFloat(formData.dias_uso_mensual),
        catalogo: parseInt(formData.catalogo),
        sucursal: parseInt(formData.sucursal)
      };

      if (editingProduct) {
        await productosEmpresasAPI.update(editingProduct.id, dataToSubmit);
        showSuccess('Producto actualizado correctamente');
      } else {
        await productosEmpresasAPI.create(dataToSubmit);
        showSuccess('Producto creado correctamente');
      }
      
      await loadData();
      handleCloseModal();
    } catch (error) {
      showError(error.message || (editingProduct ? 'No se pudo actualizar el producto' : 'No se pudo crear el producto'));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      alias_producto: product.alias_producto,
      horas_uso_diario: product.horas_uso_diario.toString(),
      dias_uso_mensual: product.dias_uso_mensual.toString(),
      ubicacion: product.ubicacion,
      catalogo: product.catalogo.toString(),
      sucursal: product.sucursal.toString()
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    setProductToDelete(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (loading) return;
    
    try {
      setLoading(true);
      await productosEmpresasAPI.delete(productToDelete);
      await loadData();
      showSuccess('Producto eliminado correctamente');
    } catch (error) {
      showError('No se pudo eliminar el producto');
    } finally {
      setLoading(false);
      setShowConfirm(false);
      setProductToDelete(null);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      alias_producto: '',
      horas_uso_diario: '',
      dias_uso_mensual: '',
      ubicacion: '',
      catalogo: '',
      sucursal: ''
    });
  };

  const getCatalogoInfo = (producto) => {
    if (producto.catalogo_info) {
      return `${producto.catalogo_info.nombre_producto} - ${producto.catalogo_info.marca_producto} ${producto.catalogo_info.modelo_producto}`;
    }
    const item = catalogo.find(c => c.id === producto.catalogo);
    return item ? `${item.nombre_producto} - ${item.marca_producto} ${item.modelo_producto}` : 'N/A';
  };

  const getSucursalInfo = (producto) => {
    if (producto.sucursal_info) {
      return producto.sucursal_info.nombre_sucursal;
    }
    const sucursal = sucursales.find(s => s.id === producto.sucursal);
    return sucursal ? sucursal.nombre_sucursal : 'N/A';
  };

  if (loading) {
    return (
      <div className="dashboard">
        <Sidebar />
        <div className="dashboard-main">
          <TopBar />
          <div className="page-content">
            <div className="productos-page">
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Cargando productos...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="dashboard-main">
        <TopBar />
        <div className="page-content">
          <div className="productos-page">
            <div className="page-header">
              <div className="header-content">
              </div>
              <button 
                className="btn-primary"
                onClick={() => setShowModal(true)}
                disabled={loading}
              >
                + Nuevo Producto
              </button>
            </div>

            {/* Estadísticas */}
            <div className="productos-stats">
              <div className="stat-card">
                <h3>Total Productos</h3>
                <p className="stat-number">{productos.length}</p>
              </div>
              <div className="stat-card">
                <h3>Equipos en Catálogo</h3>
                <p className="stat-number">{catalogo.length}</p>
              </div>
              <div className="stat-card">
                <h3>Sucursales Activas</h3>
                <p className="stat-number">{sucursales.length}</p>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3>Lista de Productos</h3>
                <div className="card-actions">
                  <input 
                    type="text" 
                    placeholder="Buscar productos..."
                    className="search-input"
                  />
                </div>
              </div>
              
              <div className="card-content">
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Alias del Producto</th>
                        <th>Equipo del Catálogo</th>
                        <th>Sucursal</th>
                        <th>Ubicación</th>
                        <th>Horas/Día</th>
                        <th>Días/Mes</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productos.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="no-data">
                            No hay productos registrados
                          </td>
                        </tr>
                      ) : (
                        productos.map((producto) => (
                          <tr key={producto.id}>
                            <td>{producto.alias_producto}</td>
                            <td>{getCatalogoInfo(producto)}</td>
                            <td>{getSucursalInfo(producto)}</td>
                            <td>{producto.ubicacion}</td>
                            <td>{producto.horas_uso_diario}h</td>
                            <td>{producto.dias_uso_mensual} días</td>
                            <td>
                              <div className="action-buttons">
                                <button 
                                  className="btn-icon btn-edit"
                                  onClick={() => handleEdit(producto)}
                                  disabled={loading}
                                  title="Editar"
                                >
                                  ✏️
                                </button>
                                <button 
                                  className="btn-icon btn-delete"
                                  onClick={() => handleDelete(producto.id)}
                                  disabled={loading}
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
              </div>
            </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h2>
              <button className="modal-close" onClick={handleCloseModal}>×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="producto-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Alias del Producto *</label>
                  <input
                    type="text"
                    value={formData.alias_producto}
                    onChange={(e) => setFormData({...formData, alias_producto: e.target.value})}
                    required
                    placeholder="Ej: Refrigerador Principal"
                  />
                </div>
                
                <div className="form-group">
                  <label>Equipo del Catálogo *</label>
                  <select
                    value={formData.catalogo}
                    onChange={(e) => setFormData({...formData, catalogo: e.target.value})}
                    required
                  >
                    <option value="">Seleccionar equipo...</option>
                    {catalogo.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.nombre_producto} - {item.marca_producto} {item.modelo_producto}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Sucursal *</label>
                  <select
                    value={formData.sucursal}
                    onChange={(e) => setFormData({...formData, sucursal: e.target.value})}
                    required
                  >
                    <option value="">Seleccionar sucursal...</option>
                    {sucursales.map((sucursal) => (
                      <option key={sucursal.id} value={sucursal.id}>
                        {sucursal.nombre_sucursal}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Ubicación *</label>
                  <input
                    type="text"
                    value={formData.ubicacion}
                    onChange={(e) => setFormData({...formData, ubicacion: e.target.value})}
                    required
                    placeholder="Ej: Cocina, Oficina Principal"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Horas de Uso Diario *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="24"
                    value={formData.horas_uso_diario}
                    onChange={(e) => setFormData({...formData, horas_uso_diario: e.target.value})}
                    required
                    placeholder="8.5"
                  />
                </div>
                
                <div className="form-group">
                  <label>Días de Uso Mensual *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="31"
                    value={formData.dias_uso_mensual}
                    onChange={(e) => setFormData({...formData, dias_uso_mensual: e.target.value})}
                    required
                    placeholder="30"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={handleCloseModal} disabled={loading}>
                  Cancelar
                </button>
                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? 'Procesando...' : (editingProduct ? 'Actualizar' : 'Crear')} Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

            <ConfirmModal
              isOpen={showConfirm}
              message="¿Estás seguro de eliminar este producto?"
              onConfirm={confirmDelete}
              onCancel={() => {
                setShowConfirm(false);
                setProductToDelete(null);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductosPage;
