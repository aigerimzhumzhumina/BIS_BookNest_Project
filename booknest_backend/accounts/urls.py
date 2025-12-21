from django.urls import path
from .views import RegisterView, LoginView, LogoutView, UploadAvatarView, BookListView, GenreListView, TropeListView
from .profile_views import UserProfileView, AvatarUploadView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('user/profile/', UserProfileView.as_view(), name='profile'),
    path('profile/', UserProfileView.as_view(), name='profile-old'),
    path('user/avatar/', UploadAvatarView.as_view(), name='avatar-upload'),
    path('avatar/', UploadAvatarView.as_view(), name='avatar-old'),
    path('books/', BookListView.as_view(), name='book-list'),
    path('genres/', GenreListView.as_view(), name='genre-list'),
    path('tropes/', TropeListView.as_view(), name='trope-list'),
]