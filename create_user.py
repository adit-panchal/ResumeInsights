import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Resumeinsights.settings')
django.setup()

from resumedetails.models import Admin

email = "harmonyproject0312@gmail.com"

# Just create the user manually to be safe
if not Admin.objects.filter(email=email).exists():
    user = Admin.objects.create_user(
        username="harmony_user",
        email=email,
        password="user123"
    )
    print("Successfully created harmonyproject0312 in SQLite with password 'user123'.")
else:
    user = Admin.objects.get(email=email)
    user.set_password("user123")
    user.save()
    print("User existed. Reset password to 'user123'.")
