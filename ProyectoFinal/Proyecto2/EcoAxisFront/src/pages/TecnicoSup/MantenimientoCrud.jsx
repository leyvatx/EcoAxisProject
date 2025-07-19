import { useEffect, useState } from "react";
import { useError } from '../../contexts/ErrorContext';
import { handleApiResponse, validateForm } from '../../utils/errorHandling';
import './Mantenimiento.css';

const MantenimientoCrud = () => {
    const [mantenimientos, setMantenimientos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        fecha_mantenimiento: '',
        tipo_mantenimiento: '',
        estado_equipo: '',
        proximo_mantenimiento: '',
        producto_empresa: '',
        tecnico: '',
    });
    const [editId, setEditId] = useState(null);
    const { showError } = useError();
    const API_URL = 'http://127.0.0.1:8000/api/mantenimientos/';

    const getMantenimientos = async () => {
        try {
            setLoading(true);
            const res = await fetch(API_URL);
            const data = await handleApiResponse(res);
            setMantenimientos(data);
        } catch (error) {
            showError('No se pudieron cargar los mantenimientos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getMantenimientos();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (loading) return;
        
        try {
            setLoading(true);
            
            // Validar campos requeridos
            validateForm(form, ['fecha_mantenimiento', 'tipo_mantenimiento', 'estado_equipo', 'proximo_mantenimiento', 'producto_empresa', 'tecnico']);
            
            const method = editId ? 'PUT' : 'POST';
            const url = editId ? `${API_URL}${editId}/` : API_URL;

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });

            await handleApiResponse(response);

            setForm({
                fecha_mantenimiento: '',
                tipo_mantenimiento: '',
                estado_equipo: '',
                proximo_mantenimiento: '',
                producto_empresa: '',
                tecnico: '',
            });
            setEditId(null);
            
            await getMantenimientos();
        } catch (error) {
            showError(error.message || (editId ? 'No se pudo actualizar el mantenimiento' : 'No se pudo crear el mantenimiento'));
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (mantenimiento) => {
        setForm(mantenimiento);
        setEditId(mantenimiento.id);
    };

    const handleDelete = async (id) => {
        if (loading) return;
        
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}${id}/`, { method: 'DELETE' });
            await handleApiResponse(response);
            await getMantenimientos();
        } catch (error) {
            showError('No se pudo eliminar el mantenimiento');
        } finally {
            setLoading(false);
        }
    };

    return(
        <div className="mantenimiento-container">
            <h2>Gestión de Mantenimientos</h2>

            <form>
                
                <div>
                    <label>Fecha de Mantenimiento:</label>
                    <input
                        type="date"
                        name="fecha_mantenimiento"
                        value={form.fecha_mantenimiento}
                        onChange={handleChange}
                    />
                </div>
                
                <div>
                    <label>Tipo de Mantenimiento:</label>
                    <input
                        type="text"
                        name="tipo_mantenimiento"
                        value={form.tipo_mantenimiento}
                        onChange={handleChange}
                        placeholder="Descripción del tipo de Mantenimiento"
                    />
                </div>
                
                <div>
                    <label>Estado del Equipo:</label>
                    <select name="estado_equipo" value={form.estado_equipo} onChange={handleChange}>
                        <option value="">Seleccione un estado</option>
                        <option value="Excelente">Excelente</option>
                        <option value="Muy buena">Muy buena</option>
                        <option value="Regular">Regular</option>
                        <option value="Mala">Mala</option>
                        <option value="Muy Mala">Muy Mala</option>
                    </select>
                </div>
                
                <div>
                    <label>Próximo Mantenimiento:</label>
                    <input
                        type="date"
                        name="proximo_mantenimiento"
                        value={form.proximo_mantenimiento}
                        onChange={handleChange}
                    />
                </div>
                
                <div>
                    <label>Producto Empresa:</label>
                    <input
                        type="text"
                        name="producto_empresa"
                        value={form.producto_empresa}
                        onChange={handleChange}
                        placeholder="Producto Empresa"
                    />
                </div>
                
                <div>
                    <label>Técnico Asignado:</label>
                    <input
                        type="number"
                        name="tecnico"
                        value={form.tecnico}
                        onChange={handleChange}
                        placeholder="ID del Técnico"
                    />
                </div>
                
                <button type="button" onClick={handleSubmit} disabled={loading}>
                    {loading ? 'Guardando...' : (editId ? 'Actualizar' : 'Agregar')}
                </button>
            </form>

            {/* Tabla de mantenimientos */}
            <div className="table-section">
                <h3>Lista de Mantenimientos ({mantenimientos.length})</h3>
                
                {mantenimientos.length === 0 ? (
                    <p className="no-data">No hay mantenimientos registrados</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Fecha Mant.</th>
                                <th>Tipo</th>
                                <th>Estado</th>
                                <th>Próximo</th>
                                <th>Producto</th>
                                <th>Técnico</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mantenimientos.map((mant) => (
                                <tr key={mant.id}>
                                    <td>{mant.id}</td>
                                    <td>{mant.fecha_mantenimiento}</td>
                                    <td>{mant.tipo_mantenimiento}</td>
                                    <td>{mant.estado_equipo}</td>
                                    <td>{mant.proximo_mantenimiento}</td>
                                    <td>{mant.producto_empresa}</td>
                                    <td>{mant.tecnico}</td>
                                    <td>
                                        <button 
                                            className="btn-edit" 
                                            onClick={() => handleEdit(mant)}
                                            disabled={loading}
                                        >
                                            Editar
                                        </button>
                                        <button 
                                            className="btn-delete" 
                                            onClick={() => handleDelete(mant.id)}
                                            disabled={loading}
                                        >
                                            {loading ? '...' : 'Eliminar'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default MantenimientoCrud;