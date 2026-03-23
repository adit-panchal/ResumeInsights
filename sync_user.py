import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Resumeinsights.settings')
django.setup()

from django.conf import settings
from resumedetails.models import Admin

email = "harmonyproject0312@gmail.com"

if settings.MONGO_DB is not None:
    user_in_mongo = settings.MONGO_DB['user_profiles'].find_one({"email": email})
    
    if user_in_mongo:
        print(f"Found in MongoDB: {user_in_mongo}")
        
        # Insert into SQLite if not exists
        if not Admin.objects.filter(email=email).exists():
            user = Admin.objects.create_user(
                username=user_in_mongo.get("name", "harmony_user"),
                email=email,
                password="user123"
            )
            print("Successfully created user in SQLite with password 'user123'.")
    else:
        print("Not found in MongoDB.")
        # Just create the user manually to be safe
        if not Admin.objects.filter(email=email).exists():
            user = Admin.objects.create_user(
                username="harmony_user",
                email=email,
                password="user123"
            )
            print("Successfully manually created user in SQLite with password 'user123'.")
else:
    print("MongoDB not connected.")
