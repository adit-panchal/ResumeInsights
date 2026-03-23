from django.contrib import admin
from django.urls import path
from resumedetails.views import register_api, login_api, logout_api, upload_resume_api, update_profile_api

urlpatterns = [
    path('admin/', admin.site.urls),
    # APIs
    path('api/register/', register_api, name='register_api'),
    path('api/login/', login_api, name='login_api'),
    path('api/logout/', logout_api, name='logout_api'),
    path('api/upload/', upload_resume_api, name='upload_resume_api'),
    path('api/update_profile/', update_profile_api, name='update_profile_api'),
]
