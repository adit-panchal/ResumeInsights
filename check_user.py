from resumedetails.models import Admin
from django.contrib.auth import authenticate    
email = "harmonyproject0312@gmail.com"
password = "user123"
user = Admin.objects.filter(email=email).first()
if user:
    print(f"User exists. username: {user.username}")
    auth_user = authenticate(username=email, password=password)
    if auth_user:
        print("Authentication successful!")
    else:
        print("Authentication failed!")
else:
    print("User does not exist!")
