from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import User
from .serializers import UserSerializer


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            user = request.user
            data = {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'avatar': user.avatar.url if user.avatar else '/media/avatars/default-avatar.png',
                'age': user.age,
                'city': user.city,
                'bio': user.bio,
                'joined_date': user.created_date.strftime('%Y-%m-%d')
            }
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def patch(self, request):
        try:
            user = request.user
            
            if 'username' in request.data:
                user.username = request.data['username']
            if 'email' in request.data:
                user.email = request.data['email']
            if 'age' in request.data:
                user.age = request.data['age']
            if 'city' in request.data:
                user.city = request.data['city']
            if 'bio' in request.data:
                user.bio = request.data['bio']
            
            user.save()
            
            data = {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'avatar': user.avatar.url if user.avatar else '/media/avatars/default-avatar.png',
                'age': user.age,
                'city': user.city,
                'bio': user.bio,
                'joined_date': user.created_date.strftime('%Y-%m-%d')
            }
            
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)


class AvatarUploadView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            if 'avatar' not in request.FILES:
                return Response({
                    'error': 'No avatar file provided'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            user = request.user
            user.avatar = request.FILES['avatar']
            user.save()
            
            return Response({
                'avatar_url': user.avatar.url if user.avatar else None
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)