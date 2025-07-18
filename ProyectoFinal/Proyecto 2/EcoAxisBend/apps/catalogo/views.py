from django.shortcuts import render
from rest_framework import viewsets
from .models import Catalogo
from .serializers import CatalogoSerializer

# Create your views here.

class CatalogoViewSet(viewsets.ModelViewSet):
    queryset = Catalogo.objects.all()
    serializer_class = CatalogoSerializer
