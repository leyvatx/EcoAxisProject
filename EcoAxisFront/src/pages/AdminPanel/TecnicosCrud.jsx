import { useEffect, useState } from 'react';
import './TecnicosCrud.css';

const TecnicosCrud = () => {
    const [tecnicos, setTecnicos] = useState([]);
    const [sucursales, setSucursales] = useState([]);
    const [tiposTecnico, setTiposTecnico] = useState([]);
    const [form, setForm] = useState({
        nombre_tecnico: '',
        apellido_tecnico: '',
        correo_tecnico: '',
        telefono_tecnico: '',
        sucursal: '',
        empresaId: 1,
        tipo_tecnico: ''
    });
    const [editId, setEditId] = useState(null);
    const API_URL = 'http://localhost:3000/tecnico';

    const getTecnicos = async () => {
        const res = await fetch(API_URL);
        const data = await res.json();
        setTecnicos(data);
    };

    const getSucursales = async () => {
        const res = await fetch('http://localhost:3000/sucursal');
        const data = await res.json();
        setSucursales(data);
    };

    const getTiposTecnico = async () => {
        const res = await fetch('http://localhost:3000/tipo-tecnico');
        const data = await res.json();
        setTiposTecnico(data);
    };

    useEffect(() => {
        getTecnicos();
        getSucursales();
        getTiposTecnico();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        const method = editId ? 'PUT' : 'POST';
        const url = editId ? `${API_URL}/${editId}` : API_URL;

        await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        });

        setForm({
            nombre_tecnico: '',
            apellido_tecnico: '',
            correo_tecnico: '',
            telefono_tecnico: '',
            sucursal: '',
            empresaId: 1,
            tipo_tecnico: ''
        });
        setEditId(null);
        getTecnicos();
    };

    const handleEdit = (tecnico) => {
        setForm(tecnico);
        setEditId(tecnico.id);
    };

    const handleDelete = async (id) => {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        getTecnicos();
    };

    return (
        <div className="tecnicos-crud-container">
            <h2 className="title">Gestión de Técnicos</h2>

            <form className="form">
                <input 
                    name="nombre_tecnico" 
                    placeholder="Nombre" 
                    value={form.nombre_tecnico} 
                    onChange={handleChange} 
                />
                <input 
                    name="apellido_tecnico" 
                    placeholder="Apellido" 
                    value={form.apellido_tecnico} 
                    onChange={handleChange} 
                />
                <input 
                    name="correo_tecnico" 
                    placeholder="Correo" 
                    type="email"
                    value={form.correo_tecnico} 
                    onChange={handleChange} 
                />
                <input 
                    name="telefono_tecnico" 
                    placeholder="Teléfono" 
                    value={form.telefono_tecnico} 
                    onChange={handleChange} 
                />
                <select 
                    name="sucursal" 
                    value={form.sucursal} 
                    onChange={handleChange}
                >
                    <option value="">Seleccione una sucursal</option>
                    {sucursales.map(s => (
                        <option key={s.id} value={s.id}>{s.nombre}</option>
                    ))}
                </select>
                <select 
                    name="tipo_tecnico" 
                    value={form.tipo_tecnico} 
                    onChange={handleChange}
                >
                    <option value="">Seleccione tipo de técnico</option>
                    {tiposTecnico.map(t => (
                        <option key={t.id} value={t.id}>{t.nombre}</option>
                    ))}
                </select>

                <button type="button" className="submit-btn" onClick={handleSubmit}>
                    {editId ? 'Actualizar' : 'Agregar'}
                </button>
            </form>

            <hr />

            <ul className="tecnicos-list">
                {tecnicos.map((t) => (
                    <li key={t.id} className="tecnico-card">
                        <div>
                            <strong>{t.nombre_tecnico} {t.apellido_tecnico}</strong>
                            <p>📧 {t.correo_tecnico}</p>
                            <p>📱 {t.telefono_tecnico}</p>
                            <p>🏢 Sucursal: {t.sucursal.nombre}</p>
                            <p>👨‍🔧 Tipo: {t.tipo_tecnico.nombre}</p>
                        </div>
                        <div className="btn-group">
                            <button className="edit-btn" onClick={() => handleEdit(t)}>Editar</button>
                            <button className="delete-btn" onClick={() => handleDelete(t.id)}>Eliminar</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TecnicosCrud;