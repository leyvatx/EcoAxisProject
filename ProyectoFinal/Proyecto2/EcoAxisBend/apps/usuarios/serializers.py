from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Usuario, TipoTecnico, Tecnico

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'nombres', 'apellidos', 'email_user', 'is_active', 'is_staff', 'is_superuser', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = Usuario(**validated_data)
        user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        # Extraer la contraseña si está presente
        password = validated_data.pop('password', None)
        
        # Actualizar los otros campos
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        # Solo actualizar la contraseña si se proporcionó una nueva
        if password:
            instance.set_password(password)
        
        instance.save()
        return instance

class UsuarioPerfilSerializer(serializers.ModelSerializer):
    """Serializer para devolver datos del usuario sin password"""
    class Meta:
        model = Usuario
        fields = ['id', 'nombres', 'apellidos', 'email_user', 'is_active', 'is_staff', 'is_superuser']

class TipoTecnicoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoTecnico
        fields = '__all__'

class TecnicoSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    tipo_tecnico_detalle = TipoTecnicoSerializer(source='tipo_tecnico', read_only=True)
    empresa_nombre = serializers.CharField(source='empresa.nombre_empresa', read_only=True)
    sucursal_nombre = serializers.CharField(source='sucursal.nombre_sucursal', read_only=True)
    
    class Meta:
        model = Tecnico
        fields = ['id', 'nombres', 'apellidos', 'email_user', 'password', 'telefono', 'sucursal', 'empresa', 'tipo_tecnico', 'tipo_tecnico_detalle', 'empresa_nombre', 'sucursal_nombre', 'is_active']
        extra_kwargs = {
            'password': {'write_only': True}
        }
        
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        tecnico = Tecnico.objects.create(**validated_data)
        
        # Si se proporciona una contraseña, la hasheamos
        if password:
            tecnico.set_password(password)
            tecnico.save()
        else:
            # Contraseña por defecto basada en el email
            default_password = f"tecnico{tecnico.id}123"
            tecnico.set_password(default_password)
            tecnico.save()
            
        return tecnico
    
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        
        # Actualizar otros campos
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        # Si se proporciona nueva contraseña, la hasheamos
        if password:
            instance.set_password(password)
            
        instance.save()
        return instance

class RegistroUsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['nombres', 'apellidos', 'email_user', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = Usuario(**validated_data)
        if password is not None:
            user.set_password(password)
        user.save()
        return user


class TecnicoTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Serializer personalizado para tokens JWT de técnicos"""
    
    def validate(self, attrs):
        # Obtener credenciales
        email = attrs.get('email_user') or attrs.get('email')
        password = attrs.get('password')
        
        if not email or not password:
            raise serializers.ValidationError('Email y contraseña son requeridos')
        
        try:
            # Buscar técnico por email
            tecnico = Tecnico.objects.get(email_user=email, is_active=True)
            
            # Verificar contraseña
            if not tecnico.check_password(password):
                raise serializers.ValidationError('Credenciales incorrectas')
            
            # Crear token personalizado
            refresh = RefreshToken()
            refresh['tecnico_id'] = tecnico.id
            refresh['tecnico_uuid'] = str(tecnico.tecnico_uuid)
            refresh['email'] = tecnico.email_user
            refresh['user_type'] = 'tecnico'
            refresh['tipo_tecnico'] = tecnico.tipo_tecnico.rol_tecnico if tecnico.tipo_tecnico else None
            refresh['empresa_id'] = tecnico.empresa.id if tecnico.empresa else None
            refresh['sucursal_id'] = tecnico.sucursal.id if tecnico.sucursal else None
            
            return {
                'access': str(refresh.access_token),
                'refresh': str(refresh),
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
                }
            }
            
        except Tecnico.DoesNotExist:
            raise serializers.ValidationError('Técnico no encontrado o inactivo')
        except Exception as e:
            raise serializers.ValidationError(f'Error de autenticación: {str(e)}')

