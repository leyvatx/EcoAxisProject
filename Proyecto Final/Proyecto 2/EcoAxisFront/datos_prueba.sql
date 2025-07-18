-- Script SQL para crear datos de prueba en EcoAxis
-- Usuario de prueba con empresas asociadas

-- IMPORTANTE: Ejecutar este script después de hacer las migraciones de Django
-- python manage.py makemigrations
-- python manage.py migrate

-- 1. Crear usuario de prueba
-- Nota: La contraseña será "123456" hasheada con Django
INSERT INTO usuario (
    user_uuid,
    nombres,
    apellidos,
    email_user,
    password,
    is_active,
    is_staff,
    is_superuser,
    date_joined,
    last_login
) VALUES (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Juan Carlos',
    'González López',
    'juan@ecoaxis.com',
    'pbkdf2_sha256$600000$randomsalt123$hashedpassword',
    true,
    false,
    false,
    '2025-01-01 10:00:00',
    '2025-01-01 10:00:00'
);

-- 2. Crear empresas asociadas al usuario
INSERT INTO empresas_empresa (
    empresa_uuid,
    nombre_empresa,
    colonia_empresa,
    calle_empresa,
    codigo_postal_empresa,
    num_externo_empresa,
    num_interno_empresa,
    rfc,
    estado_empresa,
    telefono_empresa,
    giro_empresa,
    tamano_empresa,
    usuario_id
) VALUES 
-- Empresa 1
(
    'emp1-1234-5678-9abc-def123456789',
    'EcoTech Solutions SA de CV',
    'Zona Centro',
    'Av. Revolución',
    '22000',
    '1234',
    'A',
    'ETS123456789',
    'Tijuana',
    '6641234567',
    'Tecnología Ambiental',
    'Mediana',
    (SELECT id FROM usuario WHERE email_user = 'juan@ecoaxis.com')
),
-- Empresa 2
(
    'emp2-1234-5678-9abc-def123456789',
    'Green Energy Corp',
    'Industrial',
    'Blvd. Industrial',
    '22100',
    '5678',
    NULL,
    'GEC987654321',
    'Tijuana',
    '6649876543',
    'Energías Renovables',
    'Grande',
    (SELECT id FROM usuario WHERE email_user = 'juan@ecoaxis.com')
),
-- Empresa 3
(
    'emp3-1234-5678-9abc-def123456789',
    'Reciclaje Baja California',
    'La Mesa',
    'Calle Tercera',
    '22105',
    '9999',
    'B',
    'RBC456789123',
    'Tijuana',
    '6645555555',
    'Reciclaje y Gestión de Residuos',
    'Pequeña',
    (SELECT id FROM usuario WHERE email_user = 'juan@ecoaxis.com')
);

-- 3. Crear sucursales para las empresas
INSERT INTO empresas_sucursal (
    sucursal_uuid,
    nombre_sucursal,
    colonia_sucursal,
    calle_sucursal,
    codigo_postal_sucursal,
    num_externo_sucursal,
    num_interno_sucursal,
    telefono_sucursal,
    empresa_id
) VALUES 
-- Sucursales de EcoTech Solutions
(
    'suc1-1234-5678-9abc-def123456789',
    'EcoTech Centro',
    'Zona Centro',
    'Av. Revolución',
    '22000',
    '1234',
    'A',
    '6641234567',
    (SELECT id FROM empresas_empresa WHERE nombre_empresa = 'EcoTech Solutions SA de CV')
),
(
    'suc2-1234-5678-9abc-def123456789',
    'EcoTech Norte',
    'Zona Norte',
    'Blvd. Díaz Ordaz',
    '22050',
    '2468',
    NULL,
    '6641111111',
    (SELECT id FROM empresas_empresa WHERE nombre_empresa = 'EcoTech Solutions SA de CV')
),
-- Sucursal de Green Energy Corp
(
    'suc3-1234-5678-9abc-def123456789',
    'Green Energy Principal',
    'Industrial',
    'Blvd. Industrial',
    '22100',
    '5678',
    NULL,
    '6649876543',
    (SELECT id FROM empresas_empresa WHERE nombre_empresa = 'Green Energy Corp')
);

-- 4. Usuario adicional para probar filtros
INSERT INTO usuario (
    user_uuid,
    nombres,
    apellidos,
    email_user,
    password,
    is_active,
    is_staff,
    is_superuser,
    date_joined,
    last_login
) VALUES (
    'b2c3d4e5-f6g7-8901-bcde-f23456789012',
    'María Elena',
    'Rodríguez Pérez',
    'maria@ecoaxis.com',
    'pbkdf2_sha256$600000$randomsalt456$hashedpassword2',
    true,
    false,
    false,
    '2025-01-02 09:00:00',
    '2025-01-02 09:00:00'
);

-- 5. Empresa para el segundo usuario
INSERT INTO empresas_empresa (
    empresa_uuid,
    nombre_empresa,
    colonia_empresa,
    calle_empresa,
    codigo_postal_empresa,
    num_externo_empresa,
    num_interno_empresa,
    rfc,
    estado_empresa,
    telefono_empresa,
    giro_empresa,
    tamano_empresa,
    usuario_id
) VALUES (
    'emp4-1234-5678-9abc-def123456789',
    'Sustentabilidad Mexicali',
    'Centro Cívico',
    'Av. López Mateos',
    '21000',
    '1000',
    NULL,
    'SUM123789456',
    'Mexicali',
    '6865551234',
    'Consultoría Ambiental',
    'Mediana',
    (SELECT id FROM usuario WHERE email_user = 'maria@ecoaxis.com')
);

-- 6. Verificar los datos insertados
SELECT 
    u.nombres,
    u.apellidos,
    u.email_user,
    COUNT(e.id) as total_empresas
FROM usuario u
LEFT JOIN empresas_empresa e ON u.id = e.usuario_id
GROUP BY u.id, u.nombres, u.apellidos, u.email_user;

-- 7. Mostrar empresas con sus usuarios
SELECT 
    e.nombre_empresa,
    e.rfc,
    e.estado_empresa,
    e.giro_empresa,
    u.nombres + ' ' + u.apellidos as propietario,
    u.email_user
FROM empresas_empresa e
INNER JOIN usuario u ON e.usuario_id = u.id
ORDER BY u.nombres, e.nombre_empresa;

-- NOTA IMPORTANTE:
-- Para usar estos datos de prueba con login real, necesitas crear las contraseñas usando Django:
-- 
-- python manage.py shell
-- from django.contrib.auth.hashers import make_password
-- from apps.usuarios.models import Usuario
-- 
-- # Crear usuario con contraseña real
-- usuario = Usuario.objects.create(
--     nombres='Juan Carlos',
--     apellidos='González López',
--     email_user='juan@ecoaxis.com',
--     password=make_password('123456')
-- )
-- 
-- # O actualizar contraseña de usuario existente
-- usuario = Usuario.objects.get(email_user='juan@ecoaxis.com')
-- usuario.set_password('123456')
-- usuario.save()
