import os
import django
from django.test import RequestFactory
from rest_framework.test import APIRequestFactory

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Resumeinsights.settings')
django.setup()

from resumedetails.views import login_api
from resumedetails.models import Admin

def test_login():
    factory = APIRequestFactory()
    email = "harmonyproject0312@gmail.com"
    password = "user123"
    
    request = factory.post('/api/login/', {'email': email, 'password': password}, format='json')
    response = login_api(request)
    
    print(f"Status Code: {response.status_code}")
    print(f"Data: {response.data}")

if __name__ == "__main__":
    test_login()
