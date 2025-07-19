// Test del sistema de errores - puedes eliminar este archivo después de probar

import React from 'react';
import { useError, useSuccess } from '../contexts/ErrorContext';

const TestErrores = () => {
  const { showError } = useError();
  const { showSuccess } = useSuccess();

  const probarError = () => {
    showError('Faltan campos obligatorios');
  };

  const probarExito = () => {
    showSuccess('Se guardó correctamente');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h3>Prueba del sistema de errores</h3>
      <button onClick={probarError} style={{ margin: '10px', padding: '10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}>
        Probar Error
      </button>
      <button onClick={probarExito} style={{ margin: '10px', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>
        Probar Éxito
      </button>
    </div>
  );
};

export default TestErrores;
