"""
Rentals app models.
These define the structure of rental requests in the database.
"""

from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from equipment.models import Equipment
from datetime import date

class RentalRequest(models.Model):
    """Model representing a rental request"""
    
    # Status choices for the rental request
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
        ('RETURNED', 'Returned'),
    ]
    
    # Relationships
    customer = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='rental_requests',
        help_text="Customer who made the rental request"
    )
    equipment = models.ForeignKey(
        Equipment, 
        on_delete=models.CASCADE, 
        related_name='rental_requests',
        help_text="Equipment being requested"
    )
    
    # Date fields
    request_date = models.DateTimeField(
        auto_now_add=True,
        help_text="Date and time when the request was made"
    )
    start_date = models.DateField(
        help_text="Date when the rental should start"
    )
    end_date = models.DateField(
        help_text="Date when the rental should end"
    )
    returned_at = models.DateField(
        null=True, 
        blank=True,
        help_text="Date when the equipment was actually returned"
    )
    
    # Status
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='PENDING',
        help_text="Current status of the rental request"
    )
    
    # Additional fields
    notes = models.TextField(
        blank=True,
        null=True,
        help_text="Additional notes about the rental request"
    )
    admin_notes = models.TextField(
        blank=True,
        null=True,
        help_text="Admin notes (reasons for rejection, etc.)"
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-request_date']  # Show newest requests first
        verbose_name = "Rental Request"
        verbose_name_plural = "Rental Requests"
        
        # Prevent duplicate active requests for same equipment by same customer
        constraints = [
            models.UniqueConstraint(
                fields=['customer', 'equipment'],
                condition=models.Q(status__in=['PENDING', 'APPROVED']),
                name='unique_active_rental_request'
            )
        ]
    
    def __str__(self):
        """String representation of the rental request"""
        return f"{self.customer.username} - {self.equipment.name} ({self.status})"
    
    def clean(self):
        """Validate the rental request data"""
        # Check that start date is not in the past (for new requests)
        if self.start_date and self.start_date < date.today():
            raise ValidationError({
                'start_date': "Start date cannot be in the past."
            })
        
        # Check that end date is after start date
        if self.start_date and self.end_date and self.end_date <= self.start_date:
            raise ValidationError({
                'end_date': "End date must be after start date."
            })
        
        # Check minimum rental period (at least 1 day)
        if self.start_date and self.end_date:
            days = (self.end_date - self.start_date).days
            if days < 1:
                raise ValidationError({
                    'end_date': "Minimum rental period is 1 day."
                })
    
    def save(self, *args, **kwargs):
        """Override save to perform validation"""
        self.full_clean()  # Run validation
        super().save(*args, **kwargs)
    
    def get_total_cost(self):
        """Calculate total cost for the rental"""
        if self.start_date and self.end_date and self.status in ['APPROVED', 'RETURNED']:
            days = (self.end_date - self.start_date).days
            return days * self.equipment.daily_price
        return 0
    
    def get_rental_days(self):
        """Calculate number of rental days"""
        if self.start_date and self.end_date:
            return (self.end_date - self.start_date).days
        return 0
    
    def approve(self):
        """Approve the rental request"""
        if self.status == 'PENDING':
            # Check if equipment is available
            if self.equipment.is_available():
                # Reduce equipment quantity
                if self.equipment.reduce_quantity():
                    self.status = 'APPROVED'
                    self.save()
                    return True
            else:
                raise ValidationError("Equipment is not available for rental.")
        return False
    
    def reject(self, reason=None):
        """Reject the rental request"""
        if self.status == 'PENDING':
            self.status = 'REJECTED'
            if reason:
                self.admin_notes = reason
            self.save()
            return True
        return False
    
    def mark_returned(self):
        """Mark the rental as returned"""
        if self.status == 'APPROVED':
            self.status = 'RETURNED'
            self.returned_at = date.today()
            self.save()
            # Increase equipment quantity back
            self.equipment.increase_quantity()
            return True
        return False