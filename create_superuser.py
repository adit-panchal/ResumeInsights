
import os
import django
from django.contrib.auth import get_user_model

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Resumeinsights.settings')
django.setup()

User = get_user_model()
username = 'admin'
email = 'admin@example.com'
password = 'admin'

if not User.objects.filter(email=email).exists():
    try:
        # Create user using the custom manager method which expects email first
        print(f"Attempting to create superuser: {email}")
        User.objects.create_superuser(email=email, password=password, username=username)
        print(f"Superuser '{email}' created successfully.")
    except Exception as e:
        print(f"Error creating superuser: {e}")
        # Try standard fallback if specific signature failed weirdly
        try:
             User.objects.create_superuser(username, email, password)
             print(f"Superuser '{username}' created successfully (standard signature).")
        except Exception as e2:
             print(f"Fallback failed too: {e2}")

else:
    print(f"Superuser '{email}' already exists.")
