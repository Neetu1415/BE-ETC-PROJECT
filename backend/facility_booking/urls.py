from django.urls import path
from .views import slots
from .views import BookingView , BookingListView

urlpatterns = [
    path('charges/', slots, name='charges-list'),  # Map the view to the URL
    
    path('bookings/', BookingView.as_view(), name='booking-create'),  # POST
    path('bookings/list/', BookingListView.as_view(), name='booking-list'),  # GET
    
]
