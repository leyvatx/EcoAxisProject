import uuid
from django.db import models
from apps.usuarios.models import Usuario

class Empresa(models.Model):
    empresa_uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    nombre_empresa = models.CharField(max_length=150, unique=True)
    colonia_empresa = models.CharField(max_length=100)
    calle_empresa = models.CharField(max_length=100)
    codigo_postal_empresa = models.CharField(max_length=10)
    num_externo_empresa = models.CharField(max_length=5)
    num_interno_empresa = models.CharField(max_length=5, blank=True, null=True)
    rfc = models.CharField(max_length=13, unique=True)
    estado_empresa = models.CharField(max_length=25, choices=[
        ('Mexicali', 'Mexicali'),
        ('Tijuana', 'Tijuana'),
        ('Ensenada', 'Ensenada'),
        ('Tecate', 'Tecate'),
        ('Playas de rosarito', 'Playas de rosarito')],
        default='Tijuana')
    telefono_empresa = models.CharField(max_length=10, unique=True)
    giro_empresa = models.CharField(max_length=100)
    tamano_empresa = models.CharField(max_length=25, choices=[
        ('Grande', 'Grande'),
        ('Mediana', 'Mediana')],
        default='Mediana')
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)

    def __str__(self):
        return self.nombre_empresa

    class Meta:
        db_table = 'empresa'

class Sucursal(models.Model):
    sucursal_uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    nombre_sucursal = models.CharField(max_length=100, unique=True)
    colonia_sucursal = models.CharField(max_length=100)
    calle_sucursal = models.CharField(max_length=100)
    codigo_postal_sucursal = models.CharField(max_length=10)
    num_externo_sucursal = models.CharField(max_length=5)
    num_interno_sucursal = models.CharField(max_length=5, blank=True, null=True)
    empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE)

    def __str__(self):
        return self.nombre_sucursal

    class Meta:
        db_table = 'sucursal'

# Relación con catálogo (importa como string para evitar dependencias circulares)
class ProductosEmpresas(models.Model):
    prod_empresa_uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    alias_producto = models.CharField(max_length=100)
    horas_uso_diario = models.FloatField()
    dias_uso_mensual = models.FloatField()
    ubicacion = models.CharField(max_length=100)
    catalogo = models.ForeignKey('catalogo.Catalogo', on_delete=models.CASCADE)
    sucursal = models.ForeignKey(Sucursal, on_delete=models.CASCADE, related_name='productos_empresariales')

    def __str__(self):
        return self.alias_producto

    class Meta:
        db_table = 'productos_empresas'

class SucursalProductosEmpresas(models.Model):
    sucursal = models.ForeignKey(Sucursal, on_delete=models.CASCADE)
    producto_empresa = models.ForeignKey(ProductosEmpresas, on_delete=models.CASCADE)

    class Meta:
        db_table = 'sucursal_productos_empresas'
