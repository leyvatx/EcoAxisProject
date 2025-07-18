import uuid
from django.db import models

class Catalogo(models.Model):
    producto_uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    nombre_producto = models.CharField(max_length=255, unique=True)
    marca_producto = models.CharField(max_length=50, unique=True)
    modelo_producto = models.CharField(max_length=50, unique=True)
    consumo_kw = models.DecimalField(decimal_places=5, max_digits=8)
    
    def __str__(self):
        return self.nombre_producto

    class Meta:
        db_table = 'catalogo'
