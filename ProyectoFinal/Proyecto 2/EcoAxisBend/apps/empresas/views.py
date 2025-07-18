from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Empresa, Sucursal, ProductosEmpresas, SucursalProductosEmpresas
from .serializers import EmpresaSerializer, SucursalSerializer, ProductosEmpresasSerializer, SucursalProductosEmpresasSerializer

class EmpresaViewSet(viewsets.ModelViewSet):
    queryset = Empresa.objects.all()
    serializer_class = EmpresaSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Filtrar empresas por el usuario autenticado
        return Empresa.objects.filter(usuario=self.request.user)
    
    def perform_create(self, serializer):
        # Asignar el usuario autenticado al crear una nueva empresa
        serializer.save(usuario=self.request.user)
    
    def perform_update(self, serializer):
        # Asignar el usuario autenticado al actualizar una empresa
        serializer.save(usuario=self.request.user)

class SucursalViewSet(viewsets.ModelViewSet):
    queryset = Sucursal.objects.all()
    serializer_class = SucursalSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Filtrar sucursales por empresas del usuario autenticado
        return Sucursal.objects.filter(empresa__usuario=self.request.user)

class ProductosEmpresasViewSet(viewsets.ModelViewSet):
    queryset = ProductosEmpresas.objects.all()
    serializer_class = ProductosEmpresasSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Filtrar productos por empresas del usuario autenticado a través de sucursal
        return ProductosEmpresas.objects.filter(sucursal__empresa__usuario=self.request.user)

class SucursalProductosEmpresasViewSet(viewsets.ModelViewSet):
    queryset = SucursalProductosEmpresas.objects.all()
    serializer_class = SucursalProductosEmpresasSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Filtrar productos de sucursal por empresas del usuario autenticado
        return SucursalProductosEmpresas.objects.filter(sucursal__empresa__usuario=self.request.user)
