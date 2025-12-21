from django.urls import path
from .views import RegisterView, LoginView, LogoutView
from .profile_views import UserProfileView, AvatarUploadView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('user/profile/', UserProfileView.as_view(), name='profile'),
    path('profile/', UserProfileView.as_view(), name='profile-old'),
    path('user/avatar/', AvatarUploadView.as_view(), name='avatar-upload'),
    path('avatar/', AvatarUploadView.as_view(), name='avatar-old'),
]