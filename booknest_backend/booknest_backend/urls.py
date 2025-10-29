from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def api_root(request):
    return JsonResponse({
        "message": "Welcome to BookNest API",
        "version": "1.0",
        "endpoints": {
            "admin": "/admin/",
            "auth": "/api/auth/",
            "register": "/api/auth/register/",
            "login": "/api/auth/login/",
            "logout": "/api/auth/logout/",
            "profile": "/api/auth/profile/"
        }
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('', api_root, name='api-root'),
]