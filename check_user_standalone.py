import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Resumeinsights.settings')
django.setup()

from resumedetails.models import Admin
from django.contrib.auth import authenticate    

email = "harmonyproject0312@gmail.com"
password = "user123"

# Check if user exists
user = Admin.objects.filter(email=email).first()
if user:
    print(f"User exists. username: {user.username}, email: {user.email}")
    auth_user = authenticate(username=email, password=password)
    # also try authenticate with email=email (since typical django backend uses username, but maybe they wrote a custom one)
    if auth_user:
        print("Authentication successful!")
    else:
        print("Authentication failed with username=email! Let me check if the login API uses email differently.")
        # Try authenticate with email directly if custom backend
        # The login_api uses: authenticate(request, username=email, password=password)
        print("It failed!")
else:
    print("User does not exist!")
