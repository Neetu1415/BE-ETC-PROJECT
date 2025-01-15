from rest_framework import serializers
from .models import Charges , Booking
from sports_facility.models import Sports_complex
from django.contrib.auth import get_user_model
from users.models import User

class SlotSerializer(serializers.ModelSerializer):
    uid = serializers.CharField(source= 'sports_complex.uid')
    sports_complex_name = serializers.CharField(source='sports_complex.name')
    facility_type = serializers.CharField(source='sports_complex.facility')
    class Meta:
        model = Charges
        fields = ['uid', 'sports_complex_name', 'facility_type', 'group', 'type', 'rate']

class BookingSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(write_only=True)
    sports_complex_name = serializers.CharField(source='sports_complex.name', write_only=True)
    facility_type = serializers.CharField(source='sports_complex.facility', write_only=True)
    group = serializers.CharField(source='charges.group', write_only=True)
    type = serializers.CharField(source='charges.type', write_only=True)
    rate = serializers.DecimalField(source='charges.rate', max_digits=10, decimal_places=2, write_only=True)

    class Meta:
        model = Booking  # Specify the model associated with this serializer
        fields = [
            'user_email',
            'sports_complex_name',
            'facility_type',
            'group',
            'type',
            'rate',
            'booking_date',
            'booking_time',
        ]

    def validate_user_email(self, value):
        # Validate that the email corresponds to a registered user
        try:
            user = User.objects.get(email=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("No user found with this email.")
        return value

    def create(self, validated_data):
        # Extract user email and resolve the user
        user_email = validated_data.pop("user_email")
        user = User.objects.get(email=user_email)

        # Extract sports_complex data
        sports_complex_data = validated_data.pop("sports_complex")
        sports_complex_name = sports_complex_data.get("name")
        facility_type = sports_complex_data.get("facility")

        # Extract charges data
        charges_data = validated_data.pop("charges")
        group = charges_data.get("group")
        booking_type = charges_data.get("type")

        # Refine the query to identify the correct sports_complex
        sports_complex = Sports_complex.objects.filter(
            name=sports_complex_name,
            facility=facility_type
        ).first()

        if not sports_complex:
            raise serializers.ValidationError("No matching Sports Complex found for the given details.")

        # Refine the query to identify the correct charges
        charges = Charges.objects.filter(
            sports_complex=sports_complex,
            group=group,
            type=booking_type
        ).first()

        if not charges:
            raise serializers.ValidationError("No matching Charges found for the given details.")

        # Check for double booking
        booking_date = validated_data.get("booking_date")
        booking_time = validated_data.get("booking_time")

        existing_booking = Booking.objects.filter(
            sports_complex=sports_complex,
            booking_date=booking_date,
            booking_time=booking_time
        ).exists()

        if existing_booking:
            raise serializers.ValidationError("This time slot is already booked.")

        # Add resolved user, sports_complex, and charges to validated data
        validated_data["user"] = user
        validated_data["sports_complex"] = sports_complex
        validated_data["charges"] = charges

        # Create and return the Booking instance
        return Booking.objects.create(**validated_data)
