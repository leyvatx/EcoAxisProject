import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'EcoAxisProyecto.settings')
django.setup()

from django.db import connection

def check_tecnico_table():
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'tecnico'
            ORDER BY ordinal_position;
        """)
        columns = cursor.fetchall()
        
        print("Columnas actuales en la tabla 'tecnico':")
        for column_name, data_type in columns:
            print(f"  {column_name}: {data_type}")

if __name__ == '__main__':
    check_tecnico_table()
