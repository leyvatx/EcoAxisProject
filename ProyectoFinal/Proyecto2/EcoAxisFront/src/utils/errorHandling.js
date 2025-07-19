export const handleApiResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    
    switch (response.status) {
      case 400:
        throw new Error('Por favor revisa los datos ingresados');
      case 401:
        throw new Error('Necesitas iniciar sesión');
      case 403:
        throw new Error('No tienes permisos para hacer esto');
      case 404:
        throw new Error('No se encontró lo que buscas');
      case 409:
        throw new Error('Ya existe un registro igual');
      case 422:
        throw new Error('Faltan datos obligatorios');
      case 500:
        throw new Error('Problema del servidor, intenta más tarde');
      default:
        throw new Error('Algo salió mal, intenta de nuevo');
    }
  }
  
  return response.json();
};

export const validateForm = (form, requiredFields) => {
  const missing = [];
  
  requiredFields.forEach(field => {
    if (!form[field] || form[field].toString().trim() === '') {
      missing.push(field);
    }
  });
  
  if (missing.length > 0) {
    throw new Error('Faltan campos obligatorios');
  }
};
