"""
Views for the equipment app.
These handle API requests for equipment management.
"""

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.db.models import Q
from .models import Equipment
from .serializers import EquipmentSerializer, EquipmentCreateUpdateSerializer

# Custom permission for admin only actions
from rest_framework.permissions import BasePermission

class IsAdminUser(BasePermission):
    """Custom permission to allow only admin users"""
    def has_permission(self, request, view):
        return request.user and request.user.is_staff

class EquipmentListView(generics.ListAPIView):
    """View to list all equipment - anyone can view this"""
    queryset = Equipment.objects.all()
    serializer_class = EquipmentSerializer
    permission_classes = [permissions.AllowAny]  # Anyone can browse equipment
    
    def get_queryset(self):
        """Override to add search functionality"""
        queryset = Equipment.objects.all()
        
        # Get search parameter from request
        search_query = self.request.query_params.get('search', None)
        category_filter = self.request.query_params.get('category', None)
        
        # Apply search filter if provided
        if search_query:
            queryset = queryset.filter(
                Q(name__icontains=search_query) |
                Q(description__icontains=search_query) |
                Q(category__icontains=search_query)
            )
        
        # Apply category filter if provided
        if category_filter:
            queryset = queryset.filter(category__iexact=category_filter)
        
        return queryset

class EquipmentDetailView(generics.RetrieveAPIView):
    """View to get details of a specific equipment item"""
    queryset = Equipment.objects.all()
    serializer_class = EquipmentSerializer
    permission_classes = [permissions.AllowAny]  # Anyone can view equipment details
    lookup_field = 'id'

class EquipmentCreateView(generics.CreateAPIView):
    """View to create new equipment - Admin only"""
    queryset = Equipment.objects.all()
    serializer_class = EquipmentCreateUpdateSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]
    
    def perform_create(self, serializer):
        """Save the equipment with created_by field if we had one"""
        serializer.save()

class EquipmentUpdateView(generics.UpdateAPIView):
    """View to update equipment - Admin only"""
    queryset = Equipment.objects.all()
    serializer_class = EquipmentCreateUpdateSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]
    lookup_field = 'id'
    
    def perform_update(self, serializer):
        """Update the equipment with the validated data"""
        serializer.save()

class EquipmentDeleteView(generics.DestroyAPIView):
    """View to delete equipment - Admin only"""
    queryset = Equipment.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]
    lookup_field = 'id'

class EquipmentCategoriesView(APIView):
    """View to get all unique categories"""
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        """Return list of all unique categories"""
        categories = Equipment.objects.values_list('category', flat=True).distinct()
        return Response({'categories': list(categories)})

class EquipmentAvailabilityCheckView(APIView):
    """View to check if equipment is available for specific dates"""
    permission_classes = [permissions.AllowAny]
    
    def get(self, request, id):
        """Check availability for a specific equipment item"""
        equipment = get_object_or_404(Equipment, id=id)
        
        # Basic availability check
        is_available = equipment.is_available()
        
        # For now, just return basic availability
        # We'll add date range checking when we build the rentals app
        return Response({
            'available': is_available,
            'quantity_available': equipment.quantity,
            'total_quantity': equipment.quantity
        })