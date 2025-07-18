from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apps.empresas.models import Empresa
from apps.pagos.models import PagoSubscripcion
from apps.pagos.serializers import PagoSubscripcionSerializer
from .models import Subscripcion
from .serializers import SubscripcionSerializer
from datetime import date
from dateutil.relativedelta import relativedelta

# 🔄 ViewSet estándar para CRUD
class SubscripcionViewSet(viewsets.ModelViewSet):
    queryset = Subscripcion.objects.all()
    serializer_class = SubscripcionSerializer

# 🔍 Endpoint para consultar estado de membresía
class EstadoSubscripcionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        empresa = Empresa.objects.filter(usuario=request.user).first()
        if not empresa:
            return Response({'error': 'No tienes empresa asociada.'}, status=400)

        subscripcion = Subscripcion.objects.filter(empresa=empresa).first()
        if not subscripcion:
            return Response({'estado': 'Sin suscripción registrada'}, status=200)

        vencida = subscripcion.siguiente_pago < date.today()
        estado = 'Activa' if subscripcion.estatus_sub and not vencida else 'Inactiva'

        return Response({
            'estado': estado,
            'fecha_pago': subscripcion.fecha_pago,
            'siguiente_pago': subscripcion.siguiente_pago,
            'vencida': vencida
        })

# 💳 Endpoint para registrar un nuevo pago y activar suscripción
class RegistrarPagoView(CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PagoSubscripcionSerializer

    def perform_create(self, serializer):
        empresa = Empresa.objects.filter(usuario=self.request.user).first()
        if not empresa:
            raise ValueError("No se encontró la empresa asociada al usuario.")

        subscripcion = Subscripcion.objects.filter(empresa=empresa).first()
        pago = serializer.save(empresa=empresa, subscripcion=subscripcion)

        if pago.estado_pago == 'Exitoso':
            if not subscripcion:
                subscripcion = Subscripcion.objects.create(
                    empresa=empresa,
                    fecha_pago=date.today(),
                    siguiente_pago=date.today() + relativedelta(months=1),
                    estatus_sub=True
                )
                pago.subscripcion = subscripcion
                pago.save(update_fields=['subscripcion'])
            else:
                subscripcion.estatus_sub = True
                subscripcion.fecha_pago = date.today()
                subscripcion.siguiente_pago = date.today() + relativedelta(months=1)
                subscripcion.save()
