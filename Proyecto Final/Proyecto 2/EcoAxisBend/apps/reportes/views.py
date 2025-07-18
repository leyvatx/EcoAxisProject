from django.shortcuts import render
from rest_framework import viewsets
from .models import Reporte, Mantenimiento, ReciboCfe, Ticket
from .serializers import ReporteSerializer, MantenimientoSerializer, ReciboCfeSerializer, TicketSerializer

class ReporteViewSet(viewsets.ModelViewSet):
    queryset = Reporte.objects.all()
    serializer_class = ReporteSerializer

class MantenimientoViewSet(viewsets.ModelViewSet):
    queryset = Mantenimiento.objects.all()
    serializer_class = MantenimientoSerializer

class ReciboCfeViewSet(viewsets.ModelViewSet):
    queryset = ReciboCfe.objects.all()
    serializer_class = ReciboCfeSerializer

class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
