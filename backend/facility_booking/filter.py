
import django_filters
from .models import Booking

class BookingFilter(django_filters.FilterSet):
    class Meta:
        model = Booking
        fields = {
            'booking_date': ['exact'],
            'sports_complex__name': ['exact'],
            'sports_complex__facility': ['exact'],
        }
