import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Resumeinsights.settings')
django.setup()

from django.contrib.auth import get_user_model
try:
    User = get_user_model()
    email = 'admin2@example.com'
    password = 'password123'
    username = 'admin2'

    if not User.objects.filter(email=email).exists():
        User.objects.create_superuser(username=username, email=email, password=password)
        print(f"Created new login! Email: {email} | Password: {password}")
    else:
        u = User.objects.get(email=email)
        u.set_password(password)
        u.save()
        print(f"Updated existing login password! Email: {email} | Password: {password}")
except Exception as e:
    print("Error:", e)
