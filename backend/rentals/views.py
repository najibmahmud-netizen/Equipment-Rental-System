from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import RentalRequest
from .serializers import RentalRequestSerializer, RentalRequestCreateSerializer
from equipment.models import Equipment
from rest_framework.permissions import BasePermission

class IsAdminUser(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_staff

class RentalRequestListView(generics.ListAPIView):
    serializer_class = RentalRequestSerializer
    
    def get_permissions(self):
        if self.request.user.is_staff:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAuthenticated()]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return RentalRequest.objects.all()
        return RentalRequest.objects.filter(customer=user)

class RentalRequestDetailView(generics.RetrieveAPIView):
    queryset = RentalRequest.objects.all()
    serializer_class = RentalRequestSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'

class RentalRequestCreateView(generics.CreateAPIView):
    serializer_class = RentalRequestCreateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)

class RentalRequestApproveView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]
    
    def post(self, request, id):
        rental_request = get_object_or_404(RentalRequest, id=id)
        if rental_request.status != 'PENDING':
            return Response({'error': 'Request already processed.'}, status=400)
        try:
            if rental_request.approve():
                serializer = RentalRequestSerializer(rental_request)
                return Response({'message': 'Approved', 'data': serializer.data})
            return Response({'error': 'Equipment not available.'}, status=400)
        except Exception as e:
            return Response({'error': str(e)}, status=400)

class RentalRequestRejectView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]
    
    def post(self, request, id):
        rental_request = get_object_or_404(RentalRequest, id=id)
        if rental_request.status != 'PENDING':
            return Response({'error': 'Request already processed.'}, status=400)
        reason = request.data.get('reason', None)
        if rental_request.reject(reason):
            serializer = RentalRequestSerializer(rental_request)
            return Response({'message': 'Rejected', 'data': serializer.data})
        return Response({'error': 'Failed to reject.'}, status=400)

class RentalRequestReturnView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]
    
    def post(self, request, id):
        rental_request = get_object_or_404(RentalRequest, id=id)
        if rental_request.status != 'APPROVED':
            return Response({'error': 'Only approved rentals can be returned.'}, status=400)
        if rental_request.mark_returned():
            serializer = RentalRequestSerializer(rental_request)
            return Response({'message': 'Returned', 'data': serializer.data})
        return Response({'error': 'Failed to mark returned.'}, status=400)

class AdminRentalDashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]
    
    def get(self, request):
        return Response({
            'statistics': {
                'pending': RentalRequest.objects.filter(status='PENDING').count(),
                'approved': RentalRequest.objects.filter(status='APPROVED').count(),
                'rejected': RentalRequest.objects.filter(status='REJECTED').count(),
                'returned': RentalRequest.objects.filter(status='RETURNED').count(),
                'total': RentalRequest.objects.count(),
            },
            'equipment_stats': {
                'total': Equipment.objects.count(),
                'available': Equipment.objects.filter(available=True, quantity__gt=0).count(),
            }
        })
