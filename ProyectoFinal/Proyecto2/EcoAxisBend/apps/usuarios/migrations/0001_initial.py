# Generated by Django 5.2.4 on 2025-07-12 06:00

import django.db.models.deletion
import django.utils.timezone
import uuid
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
        ('empresas', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='TipoTecnico',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tipo_tecnico_uuid', models.UUIDField(default=uuid.uuid4, editable=False, unique=True)),
                ('rol_tecnico', models.CharField(choices=[('Tecnico Superior', 'Tecnico Superior'), ('Tecnico Mantenimiento', 'Tecnico Mantenimiento')], max_length=50)),
            ],
            options={
                'db_table': 'tipo_tecnico',
            },
        ),
        migrations.CreateModel(
            name='Usuario',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('user_uuid', models.UUIDField(default=uuid.uuid4, editable=False, unique=True)),
                ('nombres', models.CharField(max_length=100)),
                ('apellidos', models.CharField(max_length=100)),
                ('email_user', models.EmailField(max_length=150, unique=True)),
                ('is_active', models.BooleanField(default=True)),
                ('is_staff', models.BooleanField(default=False)),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'db_table': 'usuario',
            },
        ),
        migrations.CreateModel(
            name='Tecnico',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tecnico_uuid', models.UUIDField(default=uuid.uuid4, editable=False, unique=True)),
                ('nombre_tecnico', models.CharField(max_length=50)),
                ('apellido_tecnico', models.CharField(max_length=50)),
                ('correo_tecnico', models.CharField(max_length=150)),
                ('telefono_tecnico', models.CharField(max_length=10)),
                ('creado_por', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tecnicos_creados', to=settings.AUTH_USER_MODEL)),
                ('empresa', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='empresas.empresa')),
                ('sucursal', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='empresas.sucursal')),
                ('tipo_tecnico', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='usuarios.tipotecnico')),
            ],
            options={
                'db_table': 'tecnico',
            },
        ),
    ]
