from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone
from .serializers import UserRegistrationSerializer, UserLoginSerializer, UserSerializer
from .models import User, Book, Genre, Trope
import traceback
from django.core.files.storage import default_storage
import os


class RegisterView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            print("=== Registration Request ===")
            print("Request data:", request.data)
            
            serializer = UserRegistrationSerializer(data=request.data)
            
            if serializer.is_valid():
                print("Serializer is valid, creating user...")
                user = serializer.save()
                print(f"User created: {user.username}")
                
                refresh = RefreshToken.for_user(user)
                
                response_data = {
                    'success': True,
                    'message': 'User registered successfully',
                    'user': UserSerializer(user).data,
                    'token': str(refresh.access_token)
                }
                print("Response:", response_data)
                
                return Response(response_data, status=status.HTTP_201_CREATED)
            
            # Format errors for frontend
            print("Serializer errors:", serializer.errors)
            errors = []
            for field, messages in serializer.errors.items():
                for message in messages:
                    errors.append(f"{field}: {message}")
            
            return Response({
                'success': False,
                'message': ' '.join(errors)
            }, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            print("=== ERROR in RegisterView ===")
            print(f"Error type: {type(e).__name__}")
            print(f"Error message: {str(e)}")
            print("Traceback:")
            traceback.print_exc()
            
            return Response({
                'success': False,
                'message': f'Server error: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class LoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            print("=== Login Request ===")
            print("Request data:", request.data)
            
            # Debug: Check if user exists
            from .models import User
            try:
                user = User.objects.get(email=request.data.get('email'))
                print(f"User found: {user.email}, is_active: {user.is_active}")
                # Test password manually
                if user.check_password(request.data.get('password')):
                    print("Password is CORRECT")
                else:
                    print("Password is WRONG")
            except User.DoesNotExist:
                print("User does not exist with this email")
            
            serializer = UserLoginSerializer(data=request.data)
            
            if serializer.is_valid():
                user = serializer.validated_data['user']
                user.last_login = timezone.now()
                user.save()
                
                refresh = RefreshToken.for_user(user)
                
                response_data = {
                    'success': True,
                    'message': 'Login successful',
                    'user': UserSerializer(user).data,
                    'token': str(refresh.access_token)
                }
                print("Login successful:", response_data)
                
                return Response(response_data, status=status.HTTP_200_OK)
            
            # Format errors for frontend
            print("Login errors:", serializer.errors)
            error_message = 'Invalid email or password'
            if serializer.errors:
                error_list = []
                for field, messages in serializer.errors.items():
                    for message in messages:
                        if isinstance(message, str):
                            error_list.append(message)
                if error_list:
                    error_message = ' '.join(error_list)
            
            return Response({
                'success': False,
                'message': error_message
            }, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            print("=== ERROR in LoginView ===")
            print(f"Error type: {type(e).__name__}")
            print(f"Error message: {str(e)}")
            traceback.print_exc()
            
            return Response({
                'success': False,
                'message': f'Server error: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            
            return Response({
                'success': True,
                'message': 'Logout successful'
            }, status=status.HTTP_200_OK)
        except Exception as e:
            # Even if blacklisting fails, we consider logout successful
            return Response({
                'success': True,
                'message': 'Logout successful'
            }, status=status.HTTP_200_OK)

class UploadAvatarView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if 'avatar' not in request.FILES:
            return Response({'error': 'No file provided'}, status=400)

        avatar_file = request.FILES['avatar']

        #Валидация типа файла
        if not avatar_file.content_type.startswith('image/'):
            return Response({'error': 'File must be an image'}, status=400)

        #Валидация размера
        if avatar_file.size > 5 * 1024 * 1024:
            return Response({'error': 'File size must be less than 5MB'}, status=400)

        user = request.user

        #Удаляем старый аватар
        if user.avatar and 'default-avatar' not in user.avatar.name:
            if os.path.isfile(user.avatar.path):
                os.remove(user.avatar.path)

        #Сохраняем новый аватар
        user.avatar = avatar_file
        user.save()

        #Полный URL аватара
        avatar_url = request.build_absolute_uri(user.avatar.url)

        return Response({'avatar_url': avatar_url}, status=200)

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            serializer = UserSerializer(request.user)
            return Response({
                'success': True,
                'user': serializer.data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            print("=== ERROR in UserProfileView ===")
            print(f"Error: {str(e)}")
            traceback.print_exc()
            
            return Response({
                'success': False,
                'message': f'Server error: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class BookListView(APIView):
    def get(self, request):
        language = request.GET.get('lang', 'ru')
        books = Book.objects.all()

        data = []
        for book in books:
            data.append({
                'id': book.id,
                'title': book.title,
                'author': book.author,
                'description': book.get_description(language),
                'cover_image': request.build_absolute_uri(book.cover_image.url) if book.cover_image else None,
                'country': book.country_ru if language == 'ru' else book.country_en if language == 'en' else book.country_kk,
                'year': book.year,
                'pages': book.pages,
                'rating': book.rating,
                'age_rating': book.age_rating
            })

        return Response({
            'books': data,
            'total': len(data)
        })


class GenreListView(APIView):
    def get(self, request):
        language = request.GET.get('lang', 'ru')
        genres = Genre.objects.all()

        return Response([
            genre.get_name(language) for genre in genres
        ])


class TropeListView(APIView):
    def get(self, request):
        language = request.GET.get('lang', 'ru')
        tropes = Trope.objects.all()

        return Response([
            trope.get_name(language) for trope in tropes
        ])