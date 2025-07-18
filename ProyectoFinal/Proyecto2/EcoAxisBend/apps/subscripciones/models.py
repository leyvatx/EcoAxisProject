import uuid
from django.db import models

class Subscripcion(models.Model):
    subscripcion_uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    fecha_pago = models.DateField()
    siguiente_pago = models.DateField()
    estatus_sub = models.BooleanField()
    empresa = models.ForeignKey('empresas.Empresa', on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.empresa.nombre_empresa} - {self.fecha_pago} → {self.siguiente_pago}"

    class Meta:
        db_table = 'subscripcion'
