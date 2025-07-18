from rest_framework import serializers
from .models import Reporte, Mantenimiento, ReciboCfe, Ticket

class ReporteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reporte
        fields = '__all__'

class MantenimientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mantenimiento
        fields = '__all__'

class ReciboCfeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReciboCfe
        fields = '__all__'

class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = '__all__'