from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Charges , Booking
from .serializers import SlotSerializer
from sports_facility.models import  Sports_complex
from django.contrib.auth import get_user_model
from rest_framework import status

@api_view(['GET'])
def slots(request):
    slots = Charges.objects.all()
    serializer = SlotSerializer(slots, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def create_booking(request):
    """
    API to handle booking creation.
    Expected data: user_id, sports_complex_name, facility, group, type, rate, date, time
    """
    try:
        # Validate the incoming data
        if not isinstance(request.data, dict):
            return Response({"error": "Invalid data format."}, status=status.HTTP_400_BAD_REQUEST)

        # Extract data from the request
        user_id = request.data.get('user_id')
        sports_complex_name = request.data.get('sports_complex')
        facility = request.data.get('facility')
        group = request.data.get('group')
        charge_type = request.data.get('type')
        booking_date = request.data.get('date')
        booking_time = request.data.get('time')

        # Check for missing fields
        if not all([user_id, sports_complex_name, facility, group, charge_type, booking_date, booking_time]):
            return Response({"error": "All fields are required."}, status=status.HTTP_400_BAD_REQUEST)

        # Retrieve user and sports complex instances
        User = get_user_model()
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        try:
            sports_complex = Sports_complex.objects.get(name__iexact=sports_complex_name)
        except Sports_complex.DoesNotExist:
            return Response({"error": "Sports complex not found."}, status=status.HTTP_404_NOT_FOUND)

        # Create booking
        booking = Booking.objects.create(
            user=user,
            sports_complex=sports_complex,
            booking_date=booking_date,
            booking_time=booking_time,
            facility=facility,
            additional_info=f"{group} - {charge_type}" if group and charge_type else None,
        )

        # Return a success response
        return Response({
            "message": "Booking successfully created!",
            "booking_id": booking.id,
            "sports_complex": sports_complex_name,
            "facility": facility,
            "date": booking_date,
            "time": booking_time
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        # Log the error (if a logging system is in place)
        # logger.error(f"Error in create_booking: {str(e)}")
        return Response({"error": "An unexpected error occurred."}, status=status.HTTP_400_BAD_REQUEST)
