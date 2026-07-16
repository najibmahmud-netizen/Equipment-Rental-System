from rest_framework import serializers
from .models import RentalRequest
from equipment.serializers import EquipmentSerializer
from accounts.serializers import UserSerializer

class RentalRequestSerializer(serializers.ModelSerializer):
    customer = UserSerializer(read_only=True)
    equipment = EquipmentSerializer(read_only=True)
    total_cost = serializers.SerializerMethodField()
    rental_days = serializers.SerializerMethodField()
    
    class Meta:
        model = RentalRequest
        fields = [
            'id', 'customer', 'equipment',
            'request_date', 'start_date', 'end_date', 'status',
            'returned_at', 'notes', 'admin_notes',
            'total_cost', 'rental_days', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'request_date', 'status', 'returned_at', 'created_at', 'updated_at']
    
    def get_total_cost(self, obj):
        return obj.get_total_cost()
    
    def get_rental_days(self, obj):
        return obj.get_rental_days()

class RentalRequestCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = RentalRequest
        fields = ['equipment_id', 'start_date', 'end_date', 'notes']
    
    def validate(self, data):
        request = self.context.get('request')
        if request and request.user:
            equipment = data.get('equipment_id')
            if equipment:
                existing = RentalRequest.objects.filter(
                    customer=request.user,
                    equipment=equipment,
                    status__in=['PENDING', 'APPROVED']
                ).exists()
                if existing:
                    raise serializers.ValidationError({
                        'equipment_id': "You already have an active rental request for this equipment."
                    })
                if not equipment.is_available():
                    raise serializers.ValidationError({
                        'equipment_id': "This equipment is currently not available for rent."
                    })
        return data
    
    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['customer'] = request.user
        validated_data['status'] = 'PENDING'
        return super().create(validated_data)
