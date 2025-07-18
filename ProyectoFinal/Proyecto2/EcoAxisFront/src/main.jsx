import { lazy, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import './index.css';
import LandingPage from './pages/landing/LandingPage.jsx';
// Importen las páginas dentro de estas líneas
import AdminPanel from './pages/AdminPanel/AdminPanel';
import EmpresaCrud from './pages/AdminPanel/EmpresaCrud';
import SucursalCrud from './pages/AdminPanel/SucursalCrud';
import TecnicosCrud from './pages/AdminPanel/TecnicosCrud.jsx';
import CatalogoCrud from './pages/AdminPanel/CatalogoCrud.jsx';
import TecnicianPanel from './pages/TecnicoSup/TecnPanel.jsx';
import MantenimientoCrud from './pages/TecnicoSup/MantenimientoCrud.jsx';
import Login from './pages/auth/login.jsx';
import CerrarSesion from './pages/auth/cerrar_sesion.jsx';
import Dashboard from './pages/dashboard/Dashboard.jsx';
import EmpresasPage from './pages/dashboard/empresas/EmpresasPage.jsx';
import UsuariosPage from './pages/dashboard/usuarios/UsuariosPage.jsx';
import TecnicosPage from './pages/dashboard/tecnicos/TecnicosPage.jsx';
import SucursalesPage from './pages/dashboard/sucursales/SucursalesPage.jsx';
import ReportesPage from './pages/dashboard/reportes/ReportesPage.jsx';
import PagosPage from './pages/dashboard/pagos/PagosPage.jsx';
import SubscripcionesPage from './pages/dashboard/subscripciones/SubscripcionesPage.jsx';
import MantenimientosPage from './pages/dashboard/mantenimientos/MantenimientosPage.jsx';
import ProductosPage from './pages/dashboard/productos/ProductosPage.jsx';
// ------------------------------------------------------------------

const App = lazy(() => import('./App.jsx'));

// Agreguen las rutas aquí, "path" es la URL que se muestra en el navegador, "element" es el componente que se renderiza cuando se accede a esa URL.
const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      //Ruta de la pagina principal
      { path: '/', element: <LandingPage /> },
      // Inicio de Sesión
      {path: '/login', element: <Login />},
      {path: '/cerrar-sesion', element: <CerrarSesion />},
      //Rutas del dashboard
      {path: '/dashboard', element: <ProtectedRoute><Dashboard /></ProtectedRoute>},
      {path: '/dashboard/empresas', element: <ProtectedRoute><EmpresasPage /></ProtectedRoute>},
      {path: '/dashboard/sucursales', element: <ProtectedRoute><SucursalesPage /></ProtectedRoute>},
      {path: '/dashboard/usuarios', element: <ProtectedRoute><UsuariosPage /></ProtectedRoute>},
      {path: '/dashboard/tecnicos', element: <ProtectedRoute><TecnicosPage /></ProtectedRoute>},
      {path: '/dashboard/reportes', element: <ProtectedRoute><ReportesPage /></ProtectedRoute>},
      {path: '/dashboard/pagos', element: <ProtectedRoute><PagosPage /></ProtectedRoute>},
      {path: '/dashboard/subscripciones', element: <ProtectedRoute><SubscripcionesPage /></ProtectedRoute>},
      {path: '/dashboard/mantenimientos', element: <ProtectedRoute><MantenimientosPage /></ProtectedRoute>},
      {path: '/dashboard/productos', element: <ProtectedRoute><ProductosPage /></ProtectedRoute>},
      //Rutas de los paneles administrativos
      { path: '/admin', element: <ProtectedRoute><AdminPanel /></ProtectedRoute> },
      { path: '/admin/empresas', element: <ProtectedRoute><EmpresaCrud /></ProtectedRoute> },
      { path: '/admin/sucursales', element: <ProtectedRoute><SucursalCrud /></ProtectedRoute> },
      {path: '/admin/tecnicos', element: <ProtectedRoute><TecnicosCrud /></ProtectedRoute>},
      {path: '/admin/catalogos', element: <ProtectedRoute><CatalogoCrud /></ProtectedRoute>},
      //Rutas del panel de Técnico Superior
      {path: '/tecnico-sup', element: <ProtectedRoute><TecnicianPanel /></ProtectedRoute>},
      {path: '/sup/mantenimiento', element: <ProtectedRoute><MantenimientoCrud /></ProtectedRoute>}
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
