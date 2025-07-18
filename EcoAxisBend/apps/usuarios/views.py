from django.shortcuts import render
from rest_framework import viewsets
from rest_framework import permissions
from .models import Usuario, TipoTecnico, Tecnico
from .serializers import UsuarioSerializer, TipoTecnicoSerializer, TecnicoSerializer, RegistroUsuarioSerializer, UsuarioPerfilSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

class TipoTecnicoViewSet(viewsets.ModelViewSet):
    queryset = TipoTecnico.objects.all()
    serializer_class = TipoTecnicoSerializer

class TecnicoViewSet(viewsets.ModelViewSet):
    queryset = Tecnico.objects.none()
    serializer_class = TecnicoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Evita error cuando no hay usuario autenticado (Swagger, etc.)
        if getattr(self, 'swagger_fake_view', False) or not self.request.user.is_authenticated:
            return Tecnico.objects.none()
        return Tecnico.objects.filter(creado_por=self.request.user)

    def perform_create(self, serializer):
        serializer.save(creado_por=self.request.user)

class RegistroUsuarioView(APIView):
    permission_classes = []  # Permitir acceso público

    def post(self, request):
        serializer = RegistroUsuarioSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UsuarioPerfilSerializer(request.user)
        return Response(serializer.data)

class CustomTokenObtainPairView(TokenObtainPairView):
    """Vista personalizada de login que devuelve tokens + datos del usuario"""
    
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        
        if response.status_code == 200:
            # Obtener el usuario autenticado
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.user
            
            # Agregar datos del usuario a la respuesta
            user_serializer = UsuarioPerfilSerializer(user)
            response.data.update(user_serializer.data)
            
        return response
