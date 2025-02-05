from rest_framework import serializers
from .models import Charges, Booking
from sports_facility.models import Sports_complex
from django.contrib.auth import get_user_model
from users.models import User
from datetime import datetime, timedelta, time

class SlotSerializer(serializers.ModelSerializer):
    uid = serializers.CharField(source='sports_complex.uid')
    sports_complex_name = serializers.CharField(source='sports_complex.name')
    facility_type = serializers.CharField(source='sports_complex.facility')
    
    class Meta:
        model = Charges
        fields = ['uid', 'sports_complex_name', 'facility_type', 'group', 'type', 'rate']

def calculate_end_time(booking_time, booking_type):
    if booking_type == "FD":
        # Full Day: fixed session from 9:00 to 18:00.
        return time(18, 0)
    elif booking_type == "HD":
        # Half Day: allow only two sessions.
        if booking_time == time(9, 0):
            return time(13, 0)
        elif booking_time == time(14, 0):
            return time(18, 0)
        else:
            raise serializers.ValidationError("For Half Day booking, start time must be either 09:00 or 14:00.")
    else:
        # Other types (e.g., hourly pass): assume a 1-hour booking.
        dt = datetime.combine(datetime.today(), booking_time) + timedelta(hours=1)
        return dt.time()

class BookingSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(write_only=True)
    sports_complex_name = serializers.CharField(source='sports_complex.name', write_only=True)
    facility_type = serializers.CharField(source='sports_complex.facility', write_only=True)
    group = serializers.CharField(source='charges.group', write_only=True)
    type = serializers.CharField(source='charges.type', write_only=True)
    rate = serializers.DecimalField(source='charges.rate', max_digits=10, decimal_places=2, write_only=True)
    
    # Add booking_end_time as a read-only field so that it is returned in the response.
    booking_end_time = serializers.TimeField(read_only=True)

    class Meta:
        model = Booking
        fields = [
            'user_email',
            'sports_complex_name',
            'facility_type',
            'group',
            'type',
            'rate',
            'booking_date',
            'booking_time',
            'booking_end_time',
        ]

    def validate_user_email(self, value):
        try:
            User.objects.get(email=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("No user found with this email.")
        return value

    def create(self, validated_data):
        # Resolve the user
        user_email = validated_data.pop("user_email")
        user = User.objects.get(email=user_email)

        # Resolve sports_complex
        sports_complex_data = validated_data.pop("sports_complex")
        sports_complex_name = sports_complex_data.get("name")
        facility_type = sports_complex_data.get("facility")
        sports_complex = Sports_complex.objects.filter(
            name=sports_complex_name,
            facility=facility_type
        ).first()
        if not sports_complex:
            raise serializers.ValidationError("No matching Sports Complex found for the given details.")

        # Resolve charges and booking type
        charges_data = validated_data.pop("charges")
        group = charges_data.get("group")
        booking_type = charges_data.get("type")
        charges = Charges.objects.filter(
            sports_complex=sports_complex,
            group=group,
            type=booking_type
        ).first()
        if not charges:
            raise serializers.ValidationError("No matching Charges found for the given details.")

        # Determine start time and compute end time based on booking type
        booking_time = validated_data.get("booking_time")
        try:
            booking_end_time = calculate_end_time(booking_time, booking_type)
        except serializers.ValidationError as e:
            raise e

        # Check for overlapping bookings:
        booking_date = validated_data.get("booking_date")
        overlapping_booking = Booking.objects.filter(
            sports_complex=sports_complex,
            booking_date=booking_date
        ).filter(
            booking_time__lt=booking_end_time,  # Existing booking starts before new booking ends.
            booking_end_time__gt=booking_time    # Existing booking ends after new booking starts.
        ).exists()

        if overlapping_booking:
            raise serializers.ValidationError("The chosen time slot overlaps with an existing booking.")

        # Add the computed and resolved fields
        validated_data["user"] = user
        validated_data["sports_complex"] = sports_complex
        validated_data["charges"] = charges
        validated_data["booking_end_time"] = booking_end_time

        return Booking.objects.create(**validated_data)
