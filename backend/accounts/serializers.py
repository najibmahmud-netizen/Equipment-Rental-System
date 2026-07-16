"""
Serializers for the accounts app.
These convert model instances to JSON and validate incoming data.
"""

from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from .models import Profile

class UserSerializer(serializers.ModelSerializer):
    """Serializer for user data"""
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = ['id']

class RegisterSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2', 'first_name', 'last_name']
    
    def validate(self, attrs):
        """Check that passwords match"""
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs
    
    def create(self, validated_data):
        """Create a new user with the validated data"""
        # Remove password2 from validated data
        validated_data.pop('password2')
        
        # Create the user with hashed password
        user = User.objects.create_user(**validated_data)
        
        # Create an empty profile for the user
        Profile.objects.create(user=user)
        
        return user

class ProfileSerializer(serializers.ModelSerializer):
    """Serializer for user profile"""
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Profile
        fields = ['user', 'phone', 'address']
