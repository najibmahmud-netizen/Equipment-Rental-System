"""
URL patterns for the accounts app.
"""

from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

urlpatterns = [
    # Authentication endpoints
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # User endpoints
    path('me/', views.CurrentUserView.as_view(), name='current_user'),
    path('profile/', views.UserProfileView.as_view(), name='user_profile'),
]