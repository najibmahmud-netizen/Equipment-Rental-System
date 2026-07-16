"""
URL patterns for the equipment app.
"""

from django.urls import path
from . import views

urlpatterns = [
    # Public endpoints (anyone can view)
    path('', views.EquipmentListView.as_view(), name='equipment-list'),
    path('categories/', views.EquipmentCategoriesView.as_view(), name='equipment-categories'),
    path('<int:id>/', views.EquipmentDetailView.as_view(), name='equipment-detail'),
    path('<int:id>/availability/', views.EquipmentAvailabilityCheckView.as_view(), name='equipment-availability'),
    
    # Admin only endpoints
    path('create/', views.EquipmentCreateView.as_view(), name='equipment-create'),
    path('<int:id>/update/', views.EquipmentUpdateView.as_view(), name='equipment-update'),
    path('<int:id>/delete/', views.EquipmentDeleteView.as_view(), name='equipment-delete'),
]