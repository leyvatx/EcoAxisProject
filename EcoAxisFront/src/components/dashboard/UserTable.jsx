import React from 'react';

const UserTable = ({ onEditUser }) => {
  const users = [
    { id: 1, nombre: 'Juan Pérez', email: 'juan@example.com', rol: 'Usuario', estado: 'Activo' },
    { id: 2, nombre: 'María García', email: 'maria@example.com', rol: 'Técnico', estado: 'Activo' },
    { id: 3, nombre: 'Carlos López', email: 'carlos@example.com', rol: 'Empresa', estado: 'Pendiente' },
  ];

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.nombre}</td>
              <td>{user.email}</td>
              <td>{user.rol}</td>
              <td>
                <span className={`status ${user.estado.toLowerCase()}`}>
                  {user.estado}
                </span>
              </td>
              <td>
                <button className="btn-edit" onClick={() => onEditUser(user)}>
                  Editar
                </button>
                <button className="btn-view">Ver</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
