from rest_framework import serializers
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
    class Meta:
        model = Tecnico
        fields = ['id', 'nombres', 'apellidos', 'email_user', 'telefono', 'especialidad', 'sucursal', 'empresa', 'tipo_tecnico', 'is_active']
        
    def create(self, validated_data):
        return Tecnico.objects.create(**validated_data)

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

