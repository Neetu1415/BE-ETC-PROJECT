from django.urls import path

from .views import BookingView , BookingListView , fully_booked_dates ,ChargesListView

urlpatterns = [
    path('charges/',ChargesListView.as_view(), name='charges-list'),  # Map the view to the URL
    
    path('bookings/', BookingView.as_view(), name='booking-create'),  # POST
    path('bookings/list/', BookingListView.as_view(), name='booking-list'),  # GET
     path('bookings/fully-booked/', fully_booked_dates, name='fully-booked-dates'), 
]
