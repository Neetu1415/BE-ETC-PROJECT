
from django.contrib import admin
from .models import Charges, Booking
from sports_facility.models import Sports_complex

class ChargesAdmin(admin.ModelAdmin):
    list_display = ('sports_complex', 'group', 'type', 'rate')
    list_filter = ('sports_complex', 'group', 'type')
    search_fields = ('group', 'type')
    ordering = ('sports_complex', 'group', 'type')

class BookingAdmin(admin.ModelAdmin):
    list_display = ('user', 'sports_complex', 'booking_date', 'booking_time', 'charges')
    list_filter = ('sports_complex', 'booking_date')
    search_fields = ('user__email', 'sports_complex__name')
    ordering = ('-booking_date', '-booking_time')

# Registering models in the admin site
admin.site.register(Charges, ChargesAdmin)
admin.site.register(Booking, BookingAdmin)
