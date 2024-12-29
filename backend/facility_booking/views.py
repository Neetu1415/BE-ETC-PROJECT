from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Charges , Booking
from .serializers import SlotSerializer
from sports_facility.models import  Sports_complex
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.views import APIView

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
    """"
    def get(self, request, *args, **kwargs):
        bookings = Booking.objects.all()
        booking_list = [
            f"{booking.user.email} - {booking.booking_date} {booking.booking_time}"
            for booking in bookings
        ]
        return Response({"bookings": booking_list}, status=status.HTTP_200_OK)
    """
class BookingListView(APIView):
    def get(self, request, *args, **kwargs):
        bookings = Booking.objects.all()
        booking_list = [
            {
                "user_email": booking.user.email,
                "booking_date": booking.booking_date,
                "booking_time": booking.booking_time,
                "sports_complex": booking.sports_complex.name,
                "facility_type": booking.sports_complex.facility # Assuming a relationship
            }
            for booking in bookings
        ]
        return Response({"bookings": booking_list}, status=status.HTTP_200_OK)
