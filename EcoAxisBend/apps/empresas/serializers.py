from rest_framework import serializers
from .models import Empresa, Sucursal, ProductosEmpresas, SucursalProductosEmpresas
from apps.catalogo.models import Catalogo

class EmpresaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Empresa
        fields = '__all__'
        read_only_fields = ['usuario', 'empresa_uuid']

class SucursalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sucursal
        fields = '__all__'

class ProductosEmpresasSerializer(serializers.ModelSerializer):
    catalogo_info = serializers.SerializerMethodField()
    sucursal_info = serializers.SerializerMethodField()
    
    class Meta:
        model = ProductosEmpresas
        fields = '__all__'
    
    def get_catalogo_info(self, obj):
        if obj.catalogo:
            return {
                'id': obj.catalogo.id,
                'nombre_producto': obj.catalogo.nombre_producto,
                'marca_producto': obj.catalogo.marca_producto,
                'modelo_producto': obj.catalogo.modelo_producto,
                'consumo_kw': str(obj.catalogo.consumo_kw)
            }
        return None
    
    def get_sucursal_info(self, obj):
        if obj.sucursal:
            return {
                'id': obj.sucursal.id,
                'nombre_sucursal': obj.sucursal.nombre_sucursal,
                'empresa_id': obj.sucursal.empresa.id if obj.sucursal.empresa else None
            }
        return None

class SucursalProductosEmpresasSerializer(serializers.ModelSerializer):
    class Meta:
        model = SucursalProductosEmpresas
        fields = '__all__'