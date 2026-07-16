from django.urls import path
from . import views

urlpatterns = [
    path('', views.RentalRequestListView.as_view(), name='rental-list'),
    path('create/', views.RentalRequestCreateView.as_view(), name='rental-create'),
    path('<int:id>/', views.RentalRequestDetailView.as_view(), name='rental-detail'),
    path('dashboard/', views.AdminRentalDashboardView.as_view(), name='rental-dashboard'),
    path('<int:id>/approve/', views.RentalRequestApproveView.as_view(), name='rental-approve'),
    path('<int:id>/reject/', views.RentalRequestRejectView.as_view(), name='rental-reject'),
    path('<int:id>/return/', views.RentalRequestReturnView.as_view(), name='rental-return'),
]
