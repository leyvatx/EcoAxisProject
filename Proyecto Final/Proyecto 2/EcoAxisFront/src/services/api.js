// Configuración centralizada de API para EcoAxis
const API_BASE_URL = 'http://localhost:8000/api';

// Función helper para hacer peticiones HTTP
async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method: 'GET',
    headers: defaultHeaders,
    ...options,
    headers: { ...defaultHeaders, ...options.headers },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
    }
    
    // Si la respuesta está vacía (como en DELETE), no intentar parsear JSON
    const contentType = response.headers.get('content-type');
    if (response.status === 204 || !contentType || !contentType.includes('application/json')) {
      return {}; // Retornar objeto vacío para respuestas sin contenido
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
}

// API de Autenticación
export const authAPI = {
  login: async (email_user, password) => {
    return apiRequest('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ email_user, password }),
    });
  },

  me: async () => {
    return apiRequest('/auth/me/');
  },

  register: async (userData) => {
    return apiRequest('/registro/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
};

// API de Usuarios
export const usuariosAPI = {
  getAll: async () => {
    return apiRequest('/usuarios/');
  },

  get: async (id) => {
    return apiRequest(`/usuarios/${id}/`);
  },

  create: async (userData) => {
    return apiRequest('/usuarios/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  update: async (id, userData) => {
    return apiRequest(`/usuarios/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  delete: async (id) => {
    return apiRequest(`/usuarios/${id}/`, {
      method: 'DELETE',
    });
  },
};

// API de Empresas
export const empresasAPI = {
  getAll: async () => {
    return apiRequest('/empresas/');
  },

  get: async (id) => {
    return apiRequest(`/empresas/${id}/`);
  },

  create: async (empresaData) => {
    return apiRequest('/empresas/', {
      method: 'POST',
      body: JSON.stringify(empresaData),
    });
  },

  update: async (id, empresaData) => {
    return apiRequest(`/empresas/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(empresaData),
    });
  },

  delete: async (id) => {
    return apiRequest(`/empresas/${id}/`, {
      method: 'DELETE',
    });
  },
};

// API de Sucursales
export const sucursalesAPI = {
  getAll: async () => {
    return apiRequest('/sucursales/');
  },

  get: async (id) => {
    return apiRequest(`/sucursales/${id}/`);
  },

  create: async (sucursalData) => {
    return apiRequest('/sucursales/', {
      method: 'POST',
      body: JSON.stringify(sucursalData),
    });
  },

  update: async (id, sucursalData) => {
    return apiRequest(`/sucursales/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(sucursalData),
    });
  },

  delete: async (id) => {
    return apiRequest(`/sucursales/${id}/`, {
      method: 'DELETE',
    });
  },
};

// API de Técnicos
export const tecnicosAPI = {
  getAll: async () => {
    return apiRequest('/tecnicos/');
  },

  get: async (id) => {
    return apiRequest(`/tecnicos/${id}/`);
  },

  create: async (tecnicoData) => {
    return apiRequest('/tecnicos/', {
      method: 'POST',
      body: JSON.stringify(tecnicoData),
    });
  },

  update: async (id, tecnicoData) => {
    return apiRequest(`/tecnicos/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(tecnicoData),
    });
  },

  delete: async (id) => {
    return apiRequest(`/tecnicos/${id}/`, {
      method: 'DELETE',
    });
  },
};

// API de Tipos de Técnico
export const tiposTecnicoAPI = {
  getAll: async () => {
    return apiRequest('/tipos-tecnico/');
  },
};

// API de Catálogo
export const catalogoAPI = {
  getAll: async () => {
    return apiRequest('/catalogos/');
  },

  get: async (id) => {
    return apiRequest(`/catalogos/${id}/`);
  },

  create: async (catalogoData) => {
    return apiRequest('/catalogos/', {
      method: 'POST',
      body: JSON.stringify(catalogoData),
    });
  },

  update: async (id, catalogoData) => {
    return apiRequest(`/catalogos/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(catalogoData),
    });
  },

  delete: async (id) => {
    return apiRequest(`/catalogos/${id}/`, {
      method: 'DELETE',
    });
  },
};

// API de Productos de Empresas
export const productosEmpresasAPI = {
  getAll: async () => {
    return apiRequest('/productos-empresas/');
  },

  get: async (id) => {
    return apiRequest(`/productos-empresas/${id}/`);
  },

  create: async (productoData) => {
    return apiRequest('/productos-empresas/', {
      method: 'POST',
      body: JSON.stringify(productoData),
    });
  },

  update: async (id, productoData) => {
    return apiRequest(`/productos-empresas/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(productoData),
    });
  },

  delete: async (id) => {
    return apiRequest(`/productos-empresas/${id}/`, {
      method: 'DELETE',
    });
  },
};

// API de Pagos
export const pagosAPI = {
  getAll: async () => {
    return apiRequest('/pagos/');
  },

  getById: async (id) => {
    return apiRequest(`/pagos/${id}/`);
  },

  create: async (pagoData) => {
    return apiRequest('/pagos/', {
      method: 'POST',
      body: JSON.stringify(pagoData),
    });
  },

  update: async (id, pagoData) => {
    return apiRequest(`/pagos/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(pagoData),
    });
  },

  delete: async (id) => {
    return apiRequest(`/pagos/${id}/`, {
      method: 'DELETE',
    });
  },
};

// API de Suscripciones
export const subscripcionesAPI = {
  getAll: async () => {
    return apiRequest('/subscripciones/');
  },

  getById: async (id) => {
    return apiRequest(`/subscripciones/${id}/`);
  },

  create: async (subscripcionData) => {
    return apiRequest('/subscripciones/', {
      method: 'POST',
      body: JSON.stringify(subscripcionData),
    });
  },

  update: async (id, subscripcionData) => {
    return apiRequest(`/subscripciones/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(subscripcionData),
    });
  },

  delete: async (id) => {
    return apiRequest(`/subscripciones/${id}/`, {
      method: 'DELETE',
    });
  },
};

// API de Reportes
export const reportesAPI = {
  getAll: async () => {
    return apiRequest('/reportes/');
  },

  getById: async (id) => {
    return apiRequest(`/reportes/${id}/`);
  },

  create: async (reporteData) => {
    return apiRequest('/reportes/', {
      method: 'POST',
      body: JSON.stringify(reporteData),
    });
  },

  update: async (id, reporteData) => {
    return apiRequest(`/reportes/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(reporteData),
    });
  },

  delete: async (id) => {
    return apiRequest(`/reportes/${id}/`, {
      method: 'DELETE',
    });
  },
};

// API de Mantenimientos
export const mantenimientosAPI = {
  getAll: async () => {
    return apiRequest('/mantenimientos/');
  },

  getById: async (id) => {
    return apiRequest(`/mantenimientos/${id}/`);
  },

  create: async (mantenimientoData) => {
    return apiRequest('/mantenimientos/', {
      method: 'POST',
      body: JSON.stringify(mantenimientoData),
    });
  },

  update: async (id, mantenimientoData) => {
    return apiRequest(`/mantenimientos/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(mantenimientoData),
    });
  },

  delete: async (id) => {
    return apiRequest(`/mantenimientos/${id}/`, {
      method: 'DELETE',
    });
  },
};

// API de Recibos CFE
export const recibosCfeAPI = {
  getAll: async () => {
    return apiRequest('/recibos-cfe/');
  },

  getById: async (id) => {
    return apiRequest(`/recibos-cfe/${id}/`);
  },

  create: async (reciboData) => {
    return apiRequest('/recibos-cfe/', {
      method: 'POST',
      body: JSON.stringify(reciboData),
    });
  },

  update: async (id, reciboData) => {
    return apiRequest(`/recibos-cfe/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(reciboData),
    });
  },

  delete: async (id) => {
    return apiRequest(`/recibos-cfe/${id}/`, {
      method: 'DELETE',
    });
  },
};

// Función para obtener estadísticas del dashboard
export const dashboardAPI = {
  getStats: async () => {
    try {
      const [usuarios, empresas, tecnicos] = await Promise.all([
        usuariosAPI.getAll(),
        empresasAPI.getAll(),
        tecnicosAPI.getAll(),
      ]);

      return {
        usuariosActivos: usuarios.length || 0,
        empresasRegistradas: empresas.length || 0,
        tecnicosDisponibles: tecnicos.length || 0,
        equiposMonitoreados: 0, // Esto se puede calcular cuando tengamos la API de equipos
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        usuariosActivos: 0,
        empresasRegistradas: 0,
        tecnicosDisponibles: 0,
        equiposMonitoreados: 0,
      };
    }
  },
};

export default {
  auth: authAPI,
  usuarios: usuariosAPI,
  empresas: empresasAPI,
  sucursales: sucursalesAPI,
  tecnicos: tecnicosAPI,
  tiposTecnico: tiposTecnicoAPI,
  catalogo: catalogoAPI,
  productosEmpresas: productosEmpresasAPI,
  pagos: pagosAPI,
  subscripciones: subscripcionesAPI,
  reportes: reportesAPI,
  mantenimientos: mantenimientosAPI,
  recibosCfe: recibosCfeAPI,
  dashboard: dashboardAPI,
};
