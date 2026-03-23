import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Resumeinsights.settings')
django.setup()

from resumedetails.models import Admin

email = "harmonyproject0312@gmail.com"
users = Admin.objects.filter(email=email)
print(f"Total users with email {email}: {users.count()}")
for u in users:
    print(f"ID: {u.id}")
    print(f"Username: {u.username}")
    print(f"Email: {u.email}")
    print(f"Is Active: {u.is_active}")
    print(f"Has usable password: {u.has_usable_password()}")
