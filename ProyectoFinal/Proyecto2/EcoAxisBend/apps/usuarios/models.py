import uuid
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.contrib.auth.hashers import make_password, check_password
from .managers import UserManager
from django.utils import timezone

class Usuario(AbstractBaseUser, PermissionsMixin):
    user_uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    nombres = models.CharField(max_length=100)
    apellidos = models.CharField(max_length=100)
    email_user = models.EmailField(max_length=150, unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)

    USERNAME_FIELD = 'email_user'
    REQUIRED_FIELDS = ['nombres', 'apellidos']

    objects = UserManager()

    def __str__(self):
        return f"{self.nombres} {self.apellidos}"

    class Meta:
        db_table = 'usuario'

class TipoTecnico(models.Model):
    tipo_tecnico_uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    rol_tecnico = models.CharField(max_length=50, choices=[
        ('Tecnico Superior', 'Tecnico Superior')])

    def __str__(self):
        return self.rol_tecnico

    class Meta:
        db_table = 'tipo_tecnico'

class Tecnico(models.Model):
    tecnico_uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    nombres = models.CharField(max_length=50)
    apellidos = models.CharField(max_length=50)
    email_user = models.CharField(max_length=150, unique=True)
    password = models.CharField(max_length=128)  # Campo para contraseña hasheada
    telefono = models.CharField(max_length=15, default='')
    sucursal = models.ForeignKey('empresas.Sucursal', on_delete=models.CASCADE)
    empresa = models.ForeignKey('empresas.Empresa', on_delete=models.CASCADE)
    tipo_tecnico = models.ForeignKey(TipoTecnico, on_delete=models.CASCADE)
    creado_por = models.ForeignKey('usuarios.Usuario', on_delete=models.CASCADE, related_name='tecnicos_creados')
    is_active = models.BooleanField(default=True)

    def set_password(self, raw_password):
        """Hashea y guarda la contraseña"""
        self.password = make_password(raw_password)
    
    def check_password(self, raw_password):
        """Verifica si la contraseña es correcta"""
        return check_password(raw_password, self.password)

    def __str__(self):
        return f"{self.nombres} {self.apellidos}"

    class Meta:
        db_table = 'tecnico'

