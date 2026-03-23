import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Resumeinsights.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()
users = User.objects.all()
print('--- All Users ---')
for u in users:
    print(f'Email: {getattr(u, "email", "N/A")} | Username: {getattr(u, "username", "N/A")} | Superuser: {u.is_superuser}')
print('-----------------')
