#!/usr/bin/env python3
"""
Script para crear datos de prueba en EcoAxis
Ejecutar con: python manage.py shell < crear_datos_prueba.py
O copiar y pegar en: python manage.py shell
"""

from apps.usuarios.models import Usuario
from apps.empresas.models import Empresa, Sucursal
import uuid

print("🚀 Creando datos de prueba para EcoAxis...")

# 1. Crear usuario de prueba
try:
    usuario1 = Usuario.objects.get(email_user='juan@ecoaxis.com')
    print("✅ Usuario juan@ecoaxis.com ya existe")
except Usuario.DoesNotExist:
    usuario1 = Usuario.objects.create_user(
        email_user='juan@ecoaxis.com',
        nombres='Juan Carlos',
        apellidos='González López',
        password='123456'
    )
    print("✅ Usuario juan@ecoaxis.com creado")

# 2. Crear segundo usuario
try:
    usuario2 = Usuario.objects.get(email_user='maria@ecoaxis.com')
    print("✅ Usuario maria@ecoaxis.com ya existe")
except Usuario.DoesNotExist:
    usuario2 = Usuario.objects.create_user(
        email_user='maria@ecoaxis.com',
        nombres='María Elena',
        apellidos='Rodríguez Pérez',
        password='123456'
    )
    print("✅ Usuario maria@ecoaxis.com creado")

# 3. Crear empresas para usuario1
empresas_usuario1 = [
    {
        'nombre_empresa': 'EcoTech Solutions SA de CV',
        'colonia_empresa': 'Zona Centro',
        'calle_empresa': 'Av. Revolución',
        'codigo_postal_empresa': '22000',
        'num_externo_empresa': '1234',
        'num_interno_empresa': 'A',
        'rfc': 'ETS123456789',
        'estado_empresa': 'Tijuana',
        'telefono_empresa': '6641234567',
        'giro_empresa': 'Tecnología Ambiental',
        'tamano_empresa': 'Mediana',
        'usuario': usuario1
    },
    {
        'nombre_empresa': 'Green Energy Corp',
        'colonia_empresa': 'Industrial',
        'calle_empresa': 'Blvd. Industrial',
        'codigo_postal_empresa': '22100',
        'num_externo_empresa': '5678',
        'rfc': 'GEC987654321',
        'estado_empresa': 'Tijuana',
        'telefono_empresa': '6649876543',
        'giro_empresa': 'Energías Renovables',
        'tamano_empresa': 'Grande',
        'usuario': usuario1
    },
    {
        'nombre_empresa': 'Reciclaje Baja California',
        'colonia_empresa': 'La Mesa',
        'calle_empresa': 'Calle Tercera',
        'codigo_postal_empresa': '22105',
        'num_externo_empresa': '9999',
        'num_interno_empresa': 'B',
        'rfc': 'RBC456789123',
        'estado_empresa': 'Tijuana',
        'telefono_empresa': '6645555555',
        'giro_empresa': 'Reciclaje y Gestión de Residuos',
        'tamano_empresa': 'Pequeña',
        'usuario': usuario1
    }
]

for empresa_data in empresas_usuario1:
    try:
        empresa = Empresa.objects.get(nombre_empresa=empresa_data['nombre_empresa'])
        print(f"✅ Empresa {empresa_data['nombre_empresa']} ya existe")
    except Empresa.DoesNotExist:
        empresa = Empresa.objects.create(**empresa_data)
        print(f"✅ Empresa {empresa_data['nombre_empresa']} creada")

# 4. Crear empresa para usuario2
try:
    empresa_usuario2 = Empresa.objects.get(nombre_empresa='Sustentabilidad Mexicali')
    print("✅ Empresa Sustentabilidad Mexicali ya existe")
except Empresa.DoesNotExist:
    empresa_usuario2 = Empresa.objects.create(
        nombre_empresa='Sustentabilidad Mexicali',
        colonia_empresa='Centro Cívico',
        calle_empresa='Av. López Mateos',
        codigo_postal_empresa='21000',
        num_externo_empresa='1000',
        rfc='SUM123789456',
        estado_empresa='Mexicali',
        telefono_empresa='6865551234',
        giro_empresa='Consultoría Ambiental',
        tamano_empresa='Mediana',
        usuario=usuario2
    )
    print("✅ Empresa Sustentabilidad Mexicali creada")

# 5. Crear sucursales
sucursales_data = [
    {
        'nombre_sucursal': 'EcoTech Centro',
        'colonia_sucursal': 'Zona Centro',
        'calle_sucursal': 'Av. Revolución',
        'codigo_postal_sucursal': '22000',
        'num_externo_sucursal': '1234',
        'num_interno_sucursal': 'A',
        'telefono_sucursal': '6641234567',
        'empresa': Empresa.objects.get(nombre_empresa='EcoTech Solutions SA de CV')
    },
    {
        'nombre_sucursal': 'EcoTech Norte',
        'colonia_sucursal': 'Zona Norte',
        'calle_sucursal': 'Blvd. Díaz Ordaz',
        'codigo_postal_sucursal': '22050',
        'num_externo_sucursal': '2468',
        'telefono_sucursal': '6641111111',
        'empresa': Empresa.objects.get(nombre_empresa='EcoTech Solutions SA de CV')
    },
    {
        'nombre_sucursal': 'Green Energy Principal',
        'colonia_sucursal': 'Industrial',
        'calle_sucursal': 'Blvd. Industrial',
        'codigo_postal_sucursal': '22100',
        'num_externo_sucursal': '5678',
        'telefono_sucursal': '6649876543',
        'empresa': Empresa.objects.get(nombre_empresa='Green Energy Corp')
    }
]

for sucursal_data in sucursales_data:
    try:
        sucursal = Sucursal.objects.get(nombre_sucursal=sucursal_data['nombre_sucursal'])
        print(f"✅ Sucursal {sucursal_data['nombre_sucursal']} ya existe")
    except Sucursal.DoesNotExist:
        sucursal = Sucursal.objects.create(**sucursal_data)
        print(f"✅ Sucursal {sucursal_data['nombre_sucursal']} creada")

# 6. Mostrar resumen
print("\n📊 RESUMEN DE DATOS CREADOS:")
print("=" * 50)

for usuario in Usuario.objects.all():
    empresas = Empresa.objects.filter(usuario=usuario)
    print(f"\n👤 Usuario: {usuario.nombres} {usuario.apellidos}")
    print(f"   📧 Email: {usuario.email_user}")
    print(f"   🔑 Contraseña: 123456")
    print(f"   🏢 Empresas ({empresas.count()}):")
    
    for empresa in empresas:
        sucursales = Sucursal.objects.filter(empresa=empresa)
        print(f"      • {empresa.nombre_empresa} ({empresa.estado_empresa})")
        print(f"        RFC: {empresa.rfc}")
        print(f"        Giro: {empresa.giro_empresa}")
        print(f"        Sucursales: {sucursales.count()}")

print("\n✅ ¡Datos de prueba creados exitosamente!")
print("\n🔐 CREDENCIALES DE PRUEBA:")
print("   📧 juan@ecoaxis.com / 🔑 123456 (3 empresas)")
print("   📧 maria@ecoaxis.com / 🔑 123456 (1 empresa)")
print("\n🌐 Ahora puedes probar el sistema dinámico iniciando sesión!")
