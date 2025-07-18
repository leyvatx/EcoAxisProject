from rest_framework import routers
from .views import ReporteViewSet, MantenimientoViewSet, ReciboCfeViewSet, TicketViewSet

router = routers.DefaultRouter()
router.register(r'reportes', ReporteViewSet)
router.register(r'mantenimientos', MantenimientoViewSet)
router.register(r'recibos-cfe', ReciboCfeViewSet)
router.register(r'tickets', TicketViewSet)

urlpatterns = router.urls