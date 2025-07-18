from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import SubscripcionViewSet, EstadoSubscripcionView, RegistrarPagoView

router = DefaultRouter()
router.register(r'subscripciones', SubscripcionViewSet)

urlpatterns = [
    path('subscripciones/estado/', EstadoSubscripcionView.as_view(), name='estado_subscripcion'),
    path('subscripciones/pago/', RegistrarPagoView.as_view(), name='registrar_pago'),
]

urlpatterns += router.urls
