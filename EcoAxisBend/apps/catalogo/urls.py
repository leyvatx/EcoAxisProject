from rest_framework import routers
from .views import CatalogoViewSet

router = routers.DefaultRouter()
router.register(r'catalogos', CatalogoViewSet)

urlpatterns = router.urls