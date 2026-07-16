
# Register your models here.
"""
Admin configuration for the equipment app.
"""

from django.contrib import admin
from .models import Equipment

@admin.register(Equipment)
class EquipmentAdmin(admin.ModelAdmin):
    """Admin interface for equipment"""
    
    list_display = ['name', 'category', 'daily_price', 'quantity', 'available', 'created_at']
    list_filter = ['category', 'available', 'created_at']
    search_fields = ['name', 'description', 'category']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'category', 'description')
        }),
        ('Pricing & Availability', {
            'fields': ('daily_price', 'quantity', 'available')
        }),
        ('Media', {
            'fields': ('image',)
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )