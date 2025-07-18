from rest_framework import routers
from .views import EmpresaViewSet, SucursalViewSet, ProductosEmpresasViewSet, SucursalProductosEmpresasViewSet

router = routers.DefaultRouter()
router.register(r'empresas', EmpresaViewSet)
router.register(r'sucursales', SucursalViewSet)
router.register(r'productos-empresas', ProductosEmpresasViewSet)
router.register(r'sucursal-productos-empresas', SucursalProductosEmpresasViewSet)

urlpatterns = router.urls