from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    PagoSubscripcionViewSet,
    PagoSubscripcionCreateView,
    PagoSubscripcionListView,
    PagoSubscripcionDetailView,
    PagoSubscripcionUpdateView,
    PagoSubscripcionDeleteView,
)

# Router para ViewSets REST
router = DefaultRouter()
router.register(r'pagos', PagoSubscripcionViewSet)

# URLs adicionales para vistas específicas
urlpatterns = [
    path('pagos/listar/', PagoSubscripcionListView.as_view(), name='listar_pagos'),
    path('pagos/crear/', PagoSubscripcionCreateView.as_view(), name='crear_pago'),
    path('pagos/<uuid:pago_uuid>/', PagoSubscripcionDetailView.as_view(), name='ver_pago'),
    path('pagos/<uuid:pago_uuid>/editar/', PagoSubscripcionUpdateView.as_view(), name='editar_pago'),
    path('pagos/<uuid:pago_uuid>/eliminar/', PagoSubscripcionDeleteView.as_view(), name='eliminar_pago'),
]

urlpatterns += router.urls
