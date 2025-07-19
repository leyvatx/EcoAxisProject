import { useEffect, useState } from 'react';
import { useError } from '../../contexts/ErrorContext';
import { handleApiResponse, validateForm } from '../../utils/errorHandling';
import './EmpresaCrud.css';

const EmpresaCrud = () => {
const [empresas, setEmpresas] = useState([]);
const [form, setForm] = useState({
    nombre: '',
    colonia: '',
    calle: '',
    cp: '',
    num_ext: '',
    num_int: '',
    rfc: '',
    estado: 'Tijuana',
    telefono: '',
    giro: '',
    tamano: 'Mediana',
    userId: 1
});
const [editId, setEditId] = useState(null);
const [loading, setLoading] = useState(false);
const { showError } = useError();
const API_URL = 'http://localhost:3000/empresa';

    const getEmpresas = async () => {
        try {
            const res = await fetch(API_URL);
            const data = await handleApiResponse(res);
            setEmpresas(data);
        } catch (error) {
            showError('No se pudieron cargar las empresas');
        }
    };useEffect(() => {
    getEmpresas();
}, []);

const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
};

const handleSubmit = async () => {
    if (loading) return;
    
    try {
        setLoading(true);
        
        // Validar campos requeridos
        validateForm(form, ['nombre', 'colonia', 'calle', 'cp', 'rfc', 'telefono', 'giro']);
        
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
            rfc: '',
            estado: 'Tijuana',
            telefono: '',
            giro: '',
            tamano: 'Mediana',
            userId: 1
        });
        setEditId(null);
        await getEmpresas();
    } catch (error) {
        showError(error.message || (editId ? 'No se pudo actualizar la empresa' : 'No se pudo crear la empresa'));
    } finally {
        setLoading(false);
    }
};

const handleEdit = (empresa) => {
    setForm(empresa);
    setEditId(empresa.id);
};

const handleDelete = async (id) => {
    if (loading) return;
    
    try {
        setLoading(true);
        const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        await handleApiResponse(res);
        await getEmpresas();
    } catch (error) {
        showError('No se pudo eliminar la empresa');
    } finally {
        setLoading(false);
    }
};

return (
    <div className="empresa-crud-container">
    <h2 className="title">Gestión de Empresas</h2>

    <form className="form">
        <input name="nombre" placeholder="Nombre empresa" value={form.nombre} onChange={handleChange} />
        <input name="colonia" placeholder="Colonia" value={form.colonia} onChange={handleChange} />
        <input name="calle" placeholder="Calle" value={form.calle} onChange={handleChange} />
        <input name="cp" placeholder="Código Postal" value={form.cp} onChange={handleChange} />
        <input name="num_ext" placeholder="Número externo" value={form.num_ext} onChange={handleChange} />
        <input name="num_int" placeholder="Número interno" value={form.num_int} onChange={handleChange} />
        <input name="rfc" placeholder="RFC" value={form.rfc} onChange={handleChange} />
        <select name="estado" value={form.estado} onChange={handleChange}>
            <option value="Mexicali">Mexicali</option>
            <option value="Tijuana">Tijuana</option>
            <option value="Ensenada">Ensenada</option>
            <option value="Tecate">Tecate</option>
            <option value="Playas de Rosarito">Playas de Rosarito</option>
        </select>
        <input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} />
        <input name="giro" placeholder="Giro de la empresa" value={form.giro} onChange={handleChange} />
        <select name="tamano" value={form.tamano} onChange={handleChange}>
            <option value="Pequeña">Pequeña</option>
            <option value="Mediana">Mediana</option>
            <option value="Grande">Grande</option>
        </select>

        <button type="button" className="submit-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Procesando...' : (editId ? 'Actualizar' : 'Agregar')}
        </button>
    </form>

    <hr />

    <ul className="empresa-list">
        {empresas.map((e) => (
            <li key={e.id} className="empresa-card">
            <div>
                <strong>{e.nombre}</strong>
                <p>📍 {e.colonia}, {e.calle} | RFC: {e.rfc}</p>
                <p>📞 {e.telefono} | Estado: {e.estado} | Tamaño: {e.tamano}</p>
            </div>
            <div className="btn-group">
                <button className="edit-btn" onClick={() => handleEdit(e)} disabled={loading}>Editar</button>
                <button className="delete-btn" onClick={() => handleDelete(e.id)} disabled={loading}>
                    {loading ? '...' : 'Eliminar'}
                </button>
            </div>
        </li>
        ))}
    </ul>
    </div>
);
};

export default EmpresaCrud;
