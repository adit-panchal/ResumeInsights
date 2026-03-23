import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Resumeinsights.settings')
django.setup()

from resumedetails.models import Admin

print("--- User List ---")
for u in Admin.objects.all():
    print(f"ID: {u.id} | Email: '{u.email}' | Username: '{u.username}' | Active: {u.is_active}")
print("--- End ---")
