"""
Serializers for the equipment app.
These convert Equipment models to JSON and validate input data.
"""

from rest_framework import serializers
from .models import Equipment

class EquipmentSerializer(serializers.ModelSerializer):
    """Serializer for equipment data"""
    
    # Add a calculated field for availability status
    availability_status = serializers.SerializerMethodField()
    
    class Meta:
        model = Equipment
        fields = [
            'id', 'name', 'category', 'description', 'daily_price',
            'quantity', 'available', 'image', 'created_at', 'updated_at',
            'availability_status'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_availability_status(self, obj):
        """Get the availability status as a readable string"""
        if obj.available and obj.quantity > 0:
            return "Available"
        elif not obj.available and obj.quantity > 0:
            return "Not Available"
        elif obj.quantity == 0:
            return "Out of Stock"
        return "Unknown"
    
    def validate_daily_price(self, value):
        """Validate that daily price is greater than zero"""
        if value <= 0:
            raise serializers.ValidationError("Daily price must be greater than zero")
        return value
    
    def validate_quantity(self, value):
        """Validate that quantity is greater than zero"""
        if value < 0:
            raise serializers.ValidationError("Quantity cannot be negative")
        return value

class EquipmentCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating and updating equipment"""
    
    class Meta:
        model = Equipment
        fields = [
            'name', 'category', 'description', 'daily_price',
            'quantity', 'available', 'image'
        ]
    
    def validate_daily_price(self, value):
        """Validate that daily price is greater than zero"""
        if value <= 0:
            raise serializers.ValidationError("Daily price must be greater than zero")
        return value
    
    def validate_quantity(self, value):
        """Validate that quantity is greater than zero"""
        if value < 0:
            raise serializers.ValidationError("Quantity cannot be negative")
        return value