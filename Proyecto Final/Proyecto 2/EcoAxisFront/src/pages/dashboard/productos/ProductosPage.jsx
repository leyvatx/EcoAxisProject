import React, { useState, useEffect } from 'react';
import { catalogoAPI, productosEmpresasAPI, sucursalesAPI } from '../../../services/api';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import './ProductosPage.css';

const ProductosPage = () => {
  const [productos, setProductos] = useState([]);
  const [catalogo, setCatalogo] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
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
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productosData, catalogoData, sucursalesData] = await Promise.all([
        productosEmpresasAPI.getAll(),
        catalogoAPI.getAll(),
        sucursalesAPI.getAll()
      ]);
      
      setProductos(productosData);
      setCatalogo(catalogoData);
      setSucursales(sucursalesData);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...formData,
        horas_uso_diario: parseFloat(formData.horas_uso_diario),
        dias_uso_mensual: parseFloat(formData.dias_uso_mensual),
        catalogo: parseInt(formData.catalogo),
        sucursal: parseInt(formData.sucursal)
      };

      if (editingProduct) {
        await productosEmpresasAPI.update(editingProduct.id, dataToSubmit);
      } else {
        await productosEmpresasAPI.create(dataToSubmit);
      }
      
      await loadData();
      handleCloseModal();
      alert(editingProduct ? 'Producto actualizado exitosamente' : 'Producto creado exitosamente');
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error al guardar el producto');
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
    if (window.confirm('¿Está seguro de que desea eliminar este producto?')) {
      try {
        await productosEmpresasAPI.delete(id);
        await loadData();
        alert('Producto eliminado exitosamente');
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error al eliminar el producto');
      }
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
    return <div className="productos-loading">Cargando productos...</div>;
  }

  return (
    <DashboardLayout>
      <div className="productos-page">
        <div className="productos-header">
          <h1>Gestión de Productos</h1>
          <button 
            className="btn-primary"
            onClick={() => setShowModal(true)}
          >
            ➕ Nuevo Producto
          </button>
        </div>

      {/* Estadísticas */}
      <div className="productos-stats">
        <div className="stat-card">
          <div className="stat-number">{productos.length}</div>
          <div className="stat-label">Total Productos</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{catalogo.length}</div>
          <div className="stat-label">Equipos en Catálogo</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{sucursales.length}</div>
          <div className="stat-label">Sucursales Activas</div>
        </div>
      </div>

      {/* Tabla de productos */}
      <div className="productos-table-container">
        <table className="productos-table">
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
                        className="btn-edit"
                        onClick={() => handleEdit(producto)}
                      >
                        ✏️
                      </button>
                      <button 
                        className="btn-delete"
                        onClick={() => handleDelete(producto.id)}
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
                <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn-submit">
                  {editingProduct ? 'Actualizar' : 'Crear'} Producto
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

export default ProductosPage;
