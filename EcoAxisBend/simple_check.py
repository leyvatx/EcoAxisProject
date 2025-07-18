from apps.usuarios.models import Usuario
from apps.empresas.models import Empresa

print("USUARIOS EXISTENTES:")
for u in Usuario.objects.all():
    print(f"Email: {u.email_user}, Nombre: {u.nombres} {u.apellidos}")

print("\nEMPRESAS EXISTENTES:")
for e in Empresa.objects.all():
    print(f"Empresa: {e.nombre_empresa}, Usuario: {e.usuario.email_user}")

# Configurar contraseña para testing
try:
    usuario = Usuario.objects.first()
    if usuario:
        usuario.set_password('123456')
        usuario.save()
        print(f"\nContraseña '123456' configurada para: {usuario.email_user}")
except Exception as e:
    print(f"Error: {e}")
