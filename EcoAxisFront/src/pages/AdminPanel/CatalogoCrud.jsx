import { useEffect, useState } from 'react';
import './CatalogoCrud.css';

const CatalogoCrud = () => {
    const [productos, setProductos] = useState([]);
    const [form, setForm] = useState({
        nombre_producto: '',
        marca_producto: '',
        modelo_producto: '',
        consumo_kw: ''
    });
    const [editId, setEditId] = useState(null);
    const API_URL = 'http://localhost:3000/catalogo';

    const getProductos = async () => {
        const res = await fetch(API_URL);
        const data = await res.json();
        setProductos(data);
    };

    useEffect(() => {
        getProductos();
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
            nombre_producto: '',
            marca_producto: '',
            modelo_producto: '',
            consumo_kw: ''
        });
        setEditId(null);
        getProductos();
    };

    const handleEdit = (producto) => {
        setForm(producto);
        setEditId(producto.id);
    };

    const handleDelete = async (id) => {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        getProductos();
    };

    return (
        <div className="catalogo-crud-container">
            <h2 className="title">Gestión de Catálogo de Productos</h2>

            <form className="form">
                <input 
                    name="nombre_producto" 
                    placeholder="Nombre del producto" 
                    value={form.nombre_producto} 
                    onChange={handleChange} 
                />
                <input 
                    name="marca_producto" 
                    placeholder="Marca" 
                    value={form.marca_producto} 
                    onChange={handleChange} 
                />
                <input 
                    name="modelo_producto" 
                    placeholder="Modelo" 
                    value={form.modelo_producto} 
                    onChange={handleChange} 
                />
                <input 
                    name="consumo_kw" 
                    placeholder="Consumo KW" 
                    type="number"
                    step="0.00001"
                    value={form.consumo_kw} 
                    onChange={handleChange} 
                />

                <button type="button" className="submit-btn" onClick={handleSubmit}>
                    {editId ? 'Actualizar' : 'Agregar'}
                </button>
            </form>

            <hr />

            <ul className="catalogo-list">
                {productos.map((p) => (
                    <li key={p.id} className="producto-card">
                        <div>
                            <strong>{p.nombre_producto}</strong>
                            <p>🏢 Marca: {p.marca_producto}</p>
                            <p>📦 Modelo: {p.modelo_producto}</p>
                            <p>⚡ Consumo: {p.consumo_kw} KW</p>
                        </div>
                        <div className="btn-group">
                            <button className="edit-btn" onClick={() => handleEdit(p)}>Editar</button>
                            <button className="delete-btn" onClick={() => handleDelete(p.id)}>Eliminar</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CatalogoCrud;