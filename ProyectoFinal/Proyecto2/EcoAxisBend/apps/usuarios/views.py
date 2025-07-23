from django.shortcuts import render
from rest_framework import viewsets
from rest_framework import permissions
from .models import Usuario, TipoTecnico, Tecnico
from .serializers import UsuarioSerializer, TipoTecnicoSerializer, TecnicoSerializer, RegistroUsuarioSerializer, UsuarioPerfilSerializer, TecnicoTokenObtainPairSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth import authenticate


class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

class TipoTecnicoViewSet(viewsets.ModelViewSet):
    queryset = TipoTecnico.objects.all()
    serializer_class = TipoTecnicoSerializer

class TecnicoViewSet(viewsets.ModelViewSet):
    queryset = Tecnico.objects.all()
    serializer_class = TecnicoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Evita error cuando no hay usuario autenticado (Swagger, etc.)
        if getattr(self, 'swagger_fake_view', False) or not self.request.user.is_authenticated:
            return Tecnico.objects.none()
        
        # Si el usuario es staff (admin), puede ver todos los técnicos
        if self.request.user.is_staff:
            return Tecnico.objects.all()
        
        # Si no es admin, solo ve los técnicos que él creó
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


class TecnicoLoginView(APIView):
    """Vista de login específica para técnicos con JWT"""
    permission_classes = []  # Permitir acceso público

    def post(self, request):
        serializer = TecnicoTokenObtainPairSerializer(data=request.data)
        
        try:
            if serializer.is_valid():
                return Response(serializer.validated_data, status=status.HTTP_200_OK)
            else:
                return Response({
                    'error': 'Credenciales incorrectas',
                    'details': serializer.errors
                }, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            return Response({
                'error': f'Error de autenticación: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class TecnicoProfileView(APIView):
    """Vista del perfil del técnico autenticado con JWT"""
    authentication_classes = [JWTAuthentication]
    permission_classes = []  # Implementaremos validación manual

    def get(self, request):
        # Extraer información del token JWT
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        if not auth_header or not auth_header.startswith('Bearer '):
            return Response({
                'error': 'Token de acceso requerido'
            }, status=status.HTTP_401_UNAUTHORIZED)

        try:
            # Decodificar token para obtener información del técnico
            from rest_framework_simplejwt.tokens import UntypedToken
            from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
            from jwt import decode as jwt_decode
            from django.conf import settings
            
            token = auth_header.split(' ')[1]
            
            # Validar token
            UntypedToken(token)
            
            # Decodificar payload
            payload = jwt_decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            
            # Verificar que es un token de técnico
            if payload.get('user_type') != 'tecnico':
                return Response({
                    'error': 'Token no válido para técnicos'
                }, status=status.HTTP_401_UNAUTHORIZED)
            
            # Obtener datos del técnico
            tecnico_id = payload.get('tecnico_id')
            tecnico = Tecnico.objects.get(id=tecnico_id, is_active=True)
            
            return Response({
                'tecnico': {
                    'id': tecnico.id,
                    'uuid': str(tecnico.tecnico_uuid),
                    'nombres': tecnico.nombres,
                    'apellidos': tecnico.apellidos,
                    'email': tecnico.email_user,
                    'telefono': tecnico.telefono,
                    'tipo_tecnico': tecnico.tipo_tecnico.rol_tecnico if tecnico.tipo_tecnico else None,
                    'empresa': tecnico.empresa.nombre_empresa if tecnico.empresa else None,
                    'sucursal': tecnico.sucursal.nombre_sucursal if tecnico.sucursal else None,
                },
                'permissions': {
                    'tipo_tecnico': payload.get('tipo_tecnico'),
                    'empresa_id': payload.get('empresa_id'),
                    'sucursal_id': payload.get('sucursal_id'),
                }
            }, status=status.HTTP_200_OK)
            
        except (InvalidToken, TokenError):
            return Response({
                'error': 'Token inválido o expirado'
            }, status=status.HTTP_401_UNAUTHORIZED)
        except Tecnico.DoesNotExist:
            return Response({
                'error': 'Técnico no encontrado'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'error': f'Error al obtener perfil: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        try:
            tecnico = Tecnico.objects.get(id=tecnico_id, is_active=True)
            return Response({
                'id': tecnico.id,
                'uuid': str(tecnico.tecnico_uuid),
                'nombres': tecnico.nombres,
                'apellidos': tecnico.apellidos,
                'email': tecnico.email_user,
                'telefono': tecnico.telefono,
                'tipo_tecnico': tecnico.tipo_tecnico.nombre if tecnico.tipo_tecnico else None,
                'empresa': tecnico.empresa.nombre_empresa if tecnico.empresa else None,
                'sucursal': tecnico.sucursal.nombre_sucursal if tecnico.sucursal else None,
            }, status=status.HTTP_200_OK)
            
        except Tecnico.DoesNotExist:
            return Response({
                'error': 'Técnico no encontrado'
            }, status=status.HTTP_404_NOT_FOUND)
