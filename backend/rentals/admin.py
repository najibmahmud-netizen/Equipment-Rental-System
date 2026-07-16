"""
Admin configuration for the rentals app.
"""

from django.contrib import admin
from .models import RentalRequest

@admin.register(RentalRequest)
class RentalRequestAdmin(admin.ModelAdmin):
    """Admin interface for rental requests"""
    
    list_display = ['id', 'customer', 'equipment', 'status', 'start_date', 'end_date', 'request_date']
    list_filter = ['status', 'request_date', 'start_date', 'end_date']
    search_fields = ['customer__username', 'customer__email', 'equipment__name']
    readonly_fields = ['request_date', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Customer & Equipment', {
            'fields': ('customer', 'equipment')
        }),
        ('Rental Period', {
            'fields': ('start_date', 'end_date', 'returned_at')
        }),
        ('Status', {
            'fields': ('status', 'notes', 'admin_notes')
        }),
        ('Metadata', {
            'fields': ('request_date', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['approve_requests', 'reject_requests']
    
    def approve_requests(self, request, queryset):
        """Admin action to approve selected requests"""
        for rental in queryset.filter(status='PENDING'):
            try:
                rental.approve()
            except:
                pass
        self.message_user(request, f"Approved {queryset.filter(status='APPROVED').count()} requests.")
    approve_requests.short_description = "Approve selected rental requests"
    
    def reject_requests(self, request, queryset):
        """Admin action to reject selected requests"""
        for rental in queryset.filter(status='PENDING'):
            rental.reject()
        self.message_user(request, f"Rejected {queryset.filter(status='REJECTED').count()} requests.")
    reject_requests.short_description = "Reject selected rental requests"