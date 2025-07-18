from rest_framework import serializers
from .models import PagoSubscripcion
from apps.subscripciones.models import Subscripcion
from django.utils import timezone
from dateutil.relativedelta import relativedelta

class PagoSubscripcionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PagoSubscripcion
        fields = '__all__'

    def validate_metodo_pago(self, value):
        if value != 'PayPal':
            raise serializers.ValidationError("Solo se permite pago por PayPal.")
        return value

    def create(self, validated_data):
        pago = super().create(validated_data)

        # Activar suscripción si el pago fue exitoso
        if pago.estado_pago == 'Exitoso':
            subscripcion = pago.subscripcion
            subscripcion.estatus_sub = True
            subscripcion.siguiente_pago = timezone.now().date() + relativedelta(months=1)
            subscripcion.save()

        return pago
