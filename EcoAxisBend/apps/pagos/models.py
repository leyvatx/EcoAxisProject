import uuid
from django.db import models

class PagoSubscripcion(models.Model):
    pago_uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    fecha_pago = models.DateTimeField(auto_now_add=True)
    monto_pagado = models.DecimalField(max_digits=10, decimal_places=2)
    metodo_pago = models.CharField(max_length=50, choices=[
        ('Tarjeta', 'Tarjeta'),
        ('Transferencia', 'Transferencia'),
        ('PayPal', 'PayPal')
    ])
    estado_pago = models.CharField(max_length=20, choices=[
        ('Exitoso', 'Exitoso'),
        ('Pendiente', 'Pendiente'),
        ('Fallido', 'Fallido')],
        default='Pendiente'
    )
    empresa = models.ForeignKey('empresas.Empresa', on_delete=models.CASCADE)
    subscripcion = models.ForeignKey('subscripciones.Subscripcion', on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.empresa.nombre_empresa} - ${self.monto_pagado} ({self.estado_pago})"

    class Meta:
        db_table = 'pago_subscripcion'
