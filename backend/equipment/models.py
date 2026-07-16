"""
Equipment app models.
These define the structure of our equipment items in the database.
"""

from django.db import models

class Equipment(models.Model):
    """Model representing a rentable equipment item"""
    
    # Basic information
    name = models.CharField(max_length=200, help_text="Name of the equipment")
    category = models.CharField(max_length=100, help_text="Category like Laptop, Camera, etc.")
    description = models.TextField(help_text="Detailed description of the equipment")
    
    # Pricing and availability
    daily_price = models.DecimalField(max_digits=10, decimal_places=2, help_text="Rental price per day")
    quantity = models.PositiveIntegerField(default=1, help_text="Number of items available")
    available = models.BooleanField(default=True, help_text="Is this equipment currently available for rent?")
    
    # Media and metadata
    image = models.ImageField(upload_to='equipment_images/', blank=True, null=True, help_text="Photo of the equipment")
    created_at = models.DateTimeField(auto_now_add=True, help_text="Date when this equipment was added")
    updated_at = models.DateTimeField(auto_now=True, help_text="Last updated date")
    
    class Meta:
        ordering = ['-created_at']  # Show newest first
        verbose_name_plural = "Equipment"
    
    def __str__(self):
        """String representation of the equipment"""
        return f"{self.name} ({self.category})"
    
    def is_available(self):
        """Check if equipment is available for rental"""
        # Equipment is available if it has quantity > 0 and available flag is True
        return self.available and self.quantity > 0
    
    def reduce_quantity(self, amount=1):
        """Reduce the quantity when rented"""
        if self.quantity >= amount:
            self.quantity -= amount
            if self.quantity == 0:
                self.available = False
            self.save()
            return True
        return False
    
    def increase_quantity(self, amount=1):
        """Increase the quantity when returned"""
        self.quantity += amount
        if self.quantity > 0:
            self.available = True
        self.save()
        return True