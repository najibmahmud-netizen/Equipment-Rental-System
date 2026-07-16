"""
Accounts app models.
We're using Django's built-in User model, so we don't need to create a custom User model.
We'll add any additional profile information using a OneToOneField if needed.
"""

from django.db import models
from django.contrib.auth.models import User

# We can extend the User model with a profile if needed
class Profile(models.Model):
    """Extended user profile information"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.user.username}'s profile"