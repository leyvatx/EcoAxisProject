from apps.usuarios.models import Usuario
from apps.empresas.models import Empresa, Sucursal

print("Creando datos de prueba para EcoAxis...")

# 1. Crear usuarios de prueba
usuario1, created = Usuario.objects.get_or_create(
    email_user='juan@ecoaxis.com',
    defaults={
        'nombres': 'Juan Carlos',
        'apellidos': 'González López'
    }
)
if created:
    usuario1.set_password('123456')
    usuario1.save()
    print("Usuario juan@ecoaxis.com creado")
else:
    print("Usuario juan@ecoaxis.com ya existe")

usuario2, created = Usuario.objects.get_or_create(
    email_user='maria@ecoaxis.com',
    defaults={
        'nombres': 'María Elena',
        'apellidos': 'Rodríguez Pérez'
    }
)
if created:
    usuario2.set_password('123456')
    usuario2.save()
    print("Usuario maria@ecoaxis.com creado")
else:
    print("Usuario maria@ecoaxis.com ya existe")

# 2. Crear empresas para usuario1
empresa1, created = Empresa.objects.get_or_create(
    nombre_empresa='EcoTech Solutions SA de CV',
    defaults={
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
    }
)
print(f"Empresa EcoTech Solutions {'creada' if created else 'ya existe'}")

empresa2, created = Empresa.objects.get_or_create(
    nombre_empresa='Green Energy Corp',
    defaults={
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
    }
)
print(f"Empresa Green Energy Corp {'creada' if created else 'ya existe'}")

empresa3, created = Empresa.objects.get_or_create(
    nombre_empresa='Sustentabilidad Mexicali',
    defaults={
        'colonia_empresa': 'Centro Cívico',
        'calle_empresa': 'Av. López Mateos',
        'codigo_postal_empresa': '21000',
        'num_externo_empresa': '1000',
        'rfc': 'SUM123789456',
        'estado_empresa': 'Mexicali',
        'telefono_empresa': '6865551234',
        'giro_empresa': 'Consultoría Ambiental',
        'tamano_empresa': 'Mediana',
        'usuario': usuario2
    }
)
print(f"Empresa Sustentabilidad Mexicali {'creada' if created else 'ya existe'}")

print("\nRESUMEN:")
print("Credenciales de prueba:")
print("- juan@ecoaxis.com / 123456 (2 empresas)")
print("- maria@ecoaxis.com / 123456 (1 empresa)")
print("Sistema dinámico listo para probar!")
