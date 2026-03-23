from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from .models import Admin
from django.core.mail import send_mail
from django.conf import settings
from django.core.files.storage import FileSystemStorage
import os
import re
import PyPDF2
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

from datetime import datetime

@api_view(['POST'])
@permission_classes([AllowAny])
def register_api(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    birth_date = request.data.get('birth_date')

    if not username or not email or not password:
        return Response({'success': False, 'message': 'Missing fields'}, status=400)

    try:
        user = Admin.objects.get(email=email)
        return Response({'success': False, 'message': 'Email already exists'}, status=400)
    except Admin.DoesNotExist:
        user = Admin.objects.create_user(
            username=username,
            email=email,
            password=password,
            birth_date=birth_date
        )
        login(request, user)
        
        # Save to MongoDB user_profiles collection
        try:
            if settings.MONGO_DB is not None:
                user_profiles = settings.MONGO_DB['user_profiles']
                user_profiles.insert_one({
                    "email": email,
                    "name": username,
                    "phone": "",
                    "address": "",
                    "plan": "free",
                    "created_at": datetime.now(),
                    "preferences": {
                        "accentColor": "#00e7ed",
                        "fontSize": "medium"
                    }
                })
        except Exception as e:
            print(f"Error saving to MongoDB: {e}")

        return Response({
            'success': True, 
            'message': 'Account created successfully',
            'user': {
                'username': user.username,
                'email': user.email
            }
        })

@api_view(['POST'])
@permission_classes([AllowAny])
def login_api(request):
    email = request.data.get('email', '').strip().lower()
    password = request.data.get('password')
    
    print(f"Login attempt for email: {email}") # Debug log

    user = authenticate(request, username=email, password=password)
    
    if user is not None:
        print(f"Login successful for user: {user.email}") # Debug log
        login(request, user)
        return Response({
            'success': True, 
            'user': {
                'username': user.username,
                'email': user.email
            }
        })
    else:
        print(f"Login failed for email: {email}. User not found or incorrect password.") # Debug log
        return Response({'success': False, 'message': 'Invalid credentials'}, status=400)

@api_view(['POST'])
def logout_api(request):
    logout(request)
    return Response({'success': True, 'message': 'Logged out successfully'})


def get_file_extension(file_name):
    return os.path.splitext(file_name)[1].lower()

def extract_email(text):
    email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
    match = re.search(email_pattern, text)
    return match.group(0) if match else None

def extract_phone_number(text):
    phone_pattern = r'\+?\d[\d -]{8,}\d'
    match = re.search(phone_pattern, text)
    return match.group(0) if match else None

def is_ats_friendly(absolute_url):
    keyword = ['skills', 'education', 'certifications', 'experience', 'projects', 'awards', 'linkedin', 'languages', 'courses', 'portfolio']
    missing = []
    rating = 0
    text_content = ""

    try:
        with open(absolute_url, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            for page_num in range(len(pdf_reader.pages)):
                page = pdf_reader.pages[page_num]
                text_content += page.extract_text()
    except Exception as e:
        return 0, [], None, None

    text_content = text_content.lower()

    for i in keyword:
        if i in text_content:
            rating += 10
        else:
            missing.append(i)

    email_address = extract_email(text_content)
    phone_number = extract_phone_number(text_content)

    return rating, missing, email_address, phone_number


@api_view(['POST'])
# @permission_classes([IsAuthenticated]) # removed auth requirement to make it easier to test for now
def upload_resume_api(request):
    if 'file' in request.FILES:
        uploaded_file = request.FILES['file']
        
        fs = FileSystemStorage(location=os.path.join(settings.BASE_DIR, 'uploads'))
        name = fs.save(uploaded_file.name, uploaded_file)
        absolute_url = os.path.join(settings.BASE_DIR, 'uploads', name)

        rating, missing, email_address, phone_number = is_ats_friendly(absolute_url)

        return Response({
            'success': True, 
            'rating': rating,
            'missing': missing,
            'email': email_address,
            'phone': phone_number
        })
    return Response({'success': False, 'message': 'No file uploaded'}, status=400)


@api_view(['POST'])
@permission_classes([AllowAny])
def update_profile_api(request):
    try:
        email = request.data.get('email')
        if not email:
            return Response({'success': False, 'message': 'No email provided to identify user'}, status=400)
            
        new_name = request.data.get('newName')
        new_phone = request.data.get('newPhone')
        new_address = request.data.get('newAddress')
        new_email = request.data.get('newEmail')
        new_password = request.data.get('newPassword')
        accent_color = request.data.get('accentColor')

        # Connect to MongoDB and update profile
        if settings.MONGO_DB is not None:
            user_profiles = settings.MONGO_DB['user_profiles']
            update_data = {}
            if new_name:
                update_data['name'] = new_name
            if new_phone is not None:
                update_data['phone'] = new_phone
            if new_address is not None:
                update_data['address'] = new_address
            if new_email:
                update_data['email'] = new_email
            if accent_color:
                update_data['preferences.accentColor'] = accent_color
            
            if update_data:
                user_profiles.update_one({'email': email}, {'$set': update_data})
        
        # Also update Django regular database if applicable
        try:
            user = Admin.objects.get(email=email)
            modified = False
            if new_name:
                user.username = new_name
                modified = True
            if new_password:
                user.set_password(new_password)
                modified = True
            if new_email:
                user.email = new_email
                modified = True
            if modified:
                user.save()
        except Admin.DoesNotExist:
            pass # Not found in sqlite, fine, we have it in MongoDB

        return Response({'success': True, 'message': 'Profile updated successfully'})
    except Exception as e:
        import traceback
        traceback.print_exc()
        return Response({'success': False, 'message': str(e)}, status=500)