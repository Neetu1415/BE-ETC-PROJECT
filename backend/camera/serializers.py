from rest_framework import serializers
from .models import FacilityPeopleCount, FacilityAlert

# Serializer for FacilityPeopleCount model
class FacilityPeopleCountSerializer(serializers.ModelSerializer):
    class Meta:
        model = FacilityPeopleCount
        fields = '__all__'  # Corrected syntax (double underscores)

# Serializer for FacilityAlert model with violation count
class FacilityAlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = FacilityAlert
        fields = ['id', 'sports_complex', 'camera', 'message', 'violation_count', 'last_violation']




# from rest_framework import serializers
# from .models import FacilityPeopleCount, FacilityAlert

# class FacilityPeopleCountSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = FacilityPeopleCount
#         fields = '_all_'

# class FacilityAlertSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = FacilityAlert
#         fields = '_all_'