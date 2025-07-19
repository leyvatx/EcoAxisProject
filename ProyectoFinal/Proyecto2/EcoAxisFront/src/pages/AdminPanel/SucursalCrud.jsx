import { useEffect, useState } from 'react';
import { useError } from '../../contexts/ErrorContext';
import { handleApiResponse, validateForm } from '../../utils/errorHandling';
import './SucursalCrud.css';

const SucursalCrud = () => {
const [sucursales, setSucursales] = useState([]);
const [form, setForm] = useState({
    nombre: '',
    colonia: '',
    calle: '',
    cp: '',
    num_ext: '',
    num_int: '',
    empresaId: 1
});
const [editId, setEditId] = useState(null);
const [loading, setLoading] = useState(false);
const { showError } = useError();
const API_URL = 'http://localhost:3000/sucursal';

const getSucursales = async () => {
    try {
        const res = await fetch(API_URL);
        const data = await handleApiResponse(res);
        setSucursales(data);
    } catch (error) {
        showError('No se pudieron cargar las sucursales');
    }
};

useEffect(() => {
    getSucursales();
}, []);

const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
};

const handleSubmit = async () => {
    if (loading) return;
    
    try {
        setLoading(true);
        
        // Validar campos requeridos
        validateForm(form, ['nombre', 'colonia', 'calle', 'cp']);
        
        const method = editId ? 'PUT' : 'POST';
        const url = editId ? `${API_URL}/${editId}` : API_URL;

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        });

        await handleApiResponse(res);

        setForm({
            nombre: '',
            colonia: '',
            calle: '',
            cp: '',
            num_ext: '',
            num_int: '',
            empresaId: 1
        });
        setEditId(null);
        await getSucursales();
    } catch (error) {
        showError(error.message || (editId ? 'No se pudo actualizar la sucursal' : 'No se pudo crear la sucursal'));
    } finally {
        setLoading(false);
    }
};

const handleEdit = (sucursal) => {
    setForm(sucursal);
    setEditId(sucursal.id);
};

const handleDelete = async (id) => {
    if (loading) return;
    
    try {
        setLoading(true);
        const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        await handleApiResponse(res);
        await getSucursales();
    } catch (error) {
        showError('No se pudo eliminar la sucursal');
    } finally {
        setLoading(false);
    }
};

return (
    <div className="sucursal-crud-container">
        <h2 className="title">Gestión de Sucursales</h2>

        <form className="form">
            <input name="nombre" placeholder="Nombre sucursal" value={form.nombre} onChange={handleChange} />
            <input name="colonia" placeholder="Colonia" value={form.colonia} onChange={handleChange} />
            <input name="calle" placeholder="Calle" value={form.calle} onChange={handleChange} />
            <input name="cp" placeholder="Código Postal" value={form.cp} onChange={handleChange} />
            <input name="num_ext" placeholder="Número externo" value={form.num_ext} onChange={handleChange} />
            <input name="num_int" placeholder="Número interno" value={form.num_int} onChange={handleChange} />

            <button type="button" className="submit-btn" onClick={handleSubmit} disabled={loading}>
                {loading ? 'Procesando...' : (editId ? 'Actualizar' : 'Agregar')}
            </button>
        </form>

    <hr />

        <ul className="sucursal-list">
        {sucursales.map((s) => (
            <li key={s.id} className="sucursal-card">
            <div>
                <strong>{s.nombre}</strong>
                <p>📍 {s.colonia}, {s.calle} #{s.num_ext}</p>
                <p>CP: {s.cp} | Int: {s.num_int ?? 'N/A'}</p>
            </div>
            <div className="btn-group">
                <button className="edit-btn" onClick={() => handleEdit(s)} disabled={loading}>Editar</button>
                <button className="delete-btn" onClick={() => handleDelete(s.id)} disabled={loading}>
                    {loading ? '...' : 'Eliminar'}
                </button>
            </div>
            </li>
        ))}
        </ul>
    </div>
);
};

export default SucursalCrud;
