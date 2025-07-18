from apps.usuarios.models import Usuario
from apps.empresas.models import Empresa

print("=== DATOS EXISTENTES EN LA BASE DE DATOS ===")

# Mostrar usuarios existentes
usuarios = Usuario.objects.all()
print(f"\nUsuarios ({usuarios.count()}):")
for usuario in usuarios:
    print(f"  - {usuario.nombres} {usuario.apellidos} ({usuario.email_user})")

# Mostrar empresas existentes
empresas = Empresa.objects.all()
print(f"\nEmpresas ({empresas.count()}):")
for empresa in empresas:
    print(f"  - {empresa.nombre_empresa} (RFC: {empresa.rfc})")
    print(f"    Teléfono: {empresa.telefono_empresa}")
    print(f"    Usuario: {empresa.usuario.email_user}")

# Verificar si podemos usar las credenciales de prueba
print("\n=== CREDENCIALES DISPONIBLES ===")
try:
    juan = Usuario.objects.get(email_user='juan@ecoaxis.com')
    empresas_juan = Empresa.objects.filter(usuario=juan)
    print(f"✅ juan@ecoaxis.com - {empresas_juan.count()} empresas")
except Usuario.DoesNotExist:
    print("❌ juan@ecoaxis.com - No existe")

try:
    maria = Usuario.objects.get(email_user='maria@ecoaxis.com')
    empresas_maria = Empresa.objects.filter(usuario=maria)
    print(f"✅ maria@ecoaxis.com - {empresas_maria.count()} empresas")
except Usuario.DoesNotExist:
    print("❌ maria@ecoaxis.com - No existe")

print("\n=== INSTRUCCIONES ===")
print("Puedes usar cualquiera de los usuarios existentes para probar.")
print("Si no conoces las contraseñas, puedes cambiarlas:")
print("  usuario = Usuario.objects.get(email_user='EMAIL_AQUÍ')")
print("  usuario.set_password('123456')")
print("  usuario.save()")
