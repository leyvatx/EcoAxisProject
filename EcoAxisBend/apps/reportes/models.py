import uuid
from django.db import models

class Reporte(models.Model):
    reporte_uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    reporte_consumo = models.FloatField()
    fecha_inicio_reporte = models.DateField()
    fecha_final_reporte = models.DateField()
    fecha_generacion_reporte = models.DateField(auto_now_add=True)
    empresa = models.ForeignKey('empresas.Empresa', on_delete=models.CASCADE)
    sucursal = models.ForeignKey('empresas.Sucursal', on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.empresa.nombre_empresa} - {self.reporte_consumo} kWh ({self.fecha_inicio_reporte} → {self.fecha_final_reporte})"

    class Meta:
        db_table = 'reporte'

class Mantenimiento(models.Model):
    mantenimiento_uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    fecha_mantenimiento = models.DateField()
    tipo_mantenimiento = models.CharField(max_length=100)
    estado_equipo = models.CharField(max_length=50, choices=[
        ('Excelente', 'Excelente'), ('Muy buena', 'Muy buena'),
        ('Regular', 'Regular'), ('Mala', 'Mala'), ('Muy mala', 'Muy mala')])
    proximo_mantenimiento = models.DateField()
    producto_empresa = models.ForeignKey('empresas.ProductosEmpresas', on_delete=models.CASCADE)
    tecnico = models.ForeignKey('usuarios.Tecnico', on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.producto_empresa.alias_producto} - {self.tipo_mantenimiento}"

    class Meta:
        db_table = 'mantenimiento'

class ReciboCfe(models.Model):
    recibo_uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    periodo_factura_inicio = models.DateField()
    periodo_factura_final = models.DateField()
    indicador_consumo = models.CharField(max_length=100, choices=[
        ('Muy Bajo', 'Muy Bajo'), ('Bajo', 'Bajo'), ('Medio', 'Medio'),
        ('Alto', 'Alto'), ('Muy alto', 'Muy alto')])
    lectura_anterior = models.FloatField()
    lectura_actual = models.FloatField()
    sucursal = models.ForeignKey('empresas.Sucursal', on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.sucursal.nombre_sucursal} ({self.lectura_anterior} → {self.lectura_actual})"

    class Meta:
        db_table = 'recibo_cfe'

class Ticket(models.Model):
    ticket_uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    nombre_ticket = models.CharField(max_length=100)
    descripcion_ticket = models.CharField(max_length=256, null=True, blank=True)
    estado_ticket = models.BooleanField()
    tecnico = models.ForeignKey('usuarios.Tecnico', on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.nombre_ticket} - Estado: {'Abierto' if self.estado_ticket else 'Cerrado'}"

    class Meta:
        db_table = 'ticket'
