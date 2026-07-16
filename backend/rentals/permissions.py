"""
Custom permissions for the rentals app.
"""

from rest_framework.permissions import BasePermission

class IsOwnerOrAdmin(BasePermission):
    """
    Custom permission to only allow owners of an object or admin to view/edit it.
    """
    
    def has_object_permission(self, request, view, obj):
        # Admin can do anything
        if request.user.is_staff:
            return True
        
        # Owner can view their own requests
        if hasattr(obj, 'customer'):
            return obj.customer == request.user
        
        return False