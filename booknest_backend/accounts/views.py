from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone
from .serializers import UserRegistrationSerializer, UserLoginSerializer, UserSerializer
from .models import User
import traceback


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