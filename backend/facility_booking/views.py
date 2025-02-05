from django.shortcuts import render
from django.db.models import Q
# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Charges , Booking
from .serializers import SlotSerializer , BookingSerializer
from sports_facility.models import  Sports_complex
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.views import APIView
from datetime import date



@api_view(['GET'])
def slots(request):
    slots = Charges.objects.all()
    serializer = SlotSerializer(slots, many=True)
    return Response(serializer.data)


from .serializers import BookingSerializer

class BookingView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = BookingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
def fully_booked_dates(request):
    facility_type = request.query_params.get('facility_type')
    sports_complex = request.query_params.get('sports_complex')
    # Adjust these field lookups as needed.
    if not (facility_type and sports_complex):
        return Response({"fullyBookedDates": []})
    
    # Find all bookings for the given facility/complex that are full day:
    bookings = Booking.objects.filter(
        sports_complex__facility=facility_type,
        sports_complex__name=sports_complex,
        booking_time__hour=9,         # start at 09:00
        booking_end_time__hour=18       # end at 18:00
    )
    
    # Extract unique dates:
    fullyBookedDates = sorted({booking.booking_date.strftime("%Y-%m-%d") for booking in bookings})
    return Response({"fullyBookedDates": fullyBookedDates})
   
class BookingListView(APIView):
    def get(self, request, *args, **kwargs):
         # Read filtering query parameters (if provided)
        facility_type = request.query_params.get('facility_type')  # e.g., 'GY'
        sports_complex = request.query_params.get('sports_complex')  # e.g., 'TM'
        booking_date = request.query_params.get('booking_date')  # e.g., '2025-02-01'

        bookings = Booking.objects.all()
        # Filter on facility_type (assuming your Sports_complex model has a field named 'facility')
        if facility_type:
            bookings = bookings.filter(sports_complex__facility=facility_type)

        # Filter on sports_complex (assuming your Sports_complex model has a field named 'name')
        if sports_complex:
            bookings = bookings.filter(sports_complex__name=sports_complex)

        # Filter on booking_date
        if booking_date:
            bookings = bookings.filter(booking_date=booking_date)


        booking_list = [
            {
                "user_email": booking.user.email,
                "booking_date": booking.booking_date,
                "booking_time": booking.booking_time,
                "booking_end_time": booking.booking_end_time,
                "sports_complex": booking.sports_complex.name,
                "facility_type": booking.sports_complex.facility # Assuming a relationship
            }
            for booking in bookings
        ]
        return Response({"bookings": booking_list}, status=status.HTTP_200_OK)
