"""
Views for the accounts app.
These handle HTTP requests and return responses.
"""

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from .serializers import UserSerializer, RegisterSerializer, ProfileSerializer
from .models import Profile

class RegisterView(generics.CreateAPIView):
    """View for user registration"""
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

class CurrentUserView(APIView):
    """View to get the current authenticated user"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """Return the current user's data"""
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class UserProfileView(APIView):
    """View to get and update user profile"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """Get the current user's profile"""
        profile, created = Profile.objects.get_or_create(user=request.user)
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)
    
    def patch(self, request):
        """Update the current user's profile"""
        profile, created = Profile.objects.get_or_create(user=request.user)
        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)