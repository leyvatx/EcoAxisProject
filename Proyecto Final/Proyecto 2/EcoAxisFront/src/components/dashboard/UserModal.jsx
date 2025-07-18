import React from 'react';

const UserModal = ({ user, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{user ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <form>
            <div className="form-group">
              <label>Nombre:</label>
              <input type="text" defaultValue={user?.nombre || ''} />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input type="email" defaultValue={user?.email || ''} />
            </div>
            <div className="form-group">
              <label>Rol:</label>
              <select defaultValue={user?.rol || ''}>
                <option value="">Seleccionar rol</option>
                <option value="Usuario">Usuario</option>
                <option value="Técnico">Técnico</option>
                <option value="Empresa">Empresa</option>
              </select>
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Cancelar</button>
          <button className="btn-primary">Guardar</button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
