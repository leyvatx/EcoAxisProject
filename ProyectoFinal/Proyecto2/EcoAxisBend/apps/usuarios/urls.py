from rest_framework import routers
from django.urls import path
from .views import (
    UsuarioViewSet, TipoTecnicoViewSet, TecnicoViewSet, RegistroUsuarioView, 
    UserView, CustomTokenObtainPairView, TecnicoLoginView, TecnicoProfileView
)
from rest_framework_simplejwt.views import TokenRefreshView

router = routers.DefaultRouter()
router.register(r'usuarios', UsuarioViewSet)
router.register(r'tipos-tecnico', TipoTecnicoViewSet)
router.register(r'tecnicos', TecnicoViewSet)

urlpatterns = [
    path('registro/', RegistroUsuarioView.as_view(), name='registro_usuario'),
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/me/', UserView.as_view(), name='user_detail'),
    # URLs para técnicos
    path('auth/tecnico/login/', TecnicoLoginView.as_view(), name='tecnico_login'),
    path('auth/tecnico/profile/', TecnicoProfileView.as_view(), name='tecnico_profile'),
    path('auth/tecnico/refresh/', TokenRefreshView.as_view(), name='tecnico_token_refresh'),
]

urlpatterns += router.urls