from rest_framework import serializers
from .models import Charges
from sports_facility.models import Sports_complex

class SlotSerializer(serializers.ModelSerializer):
    uid = serializers.CharField(source= 'sports_complex.uid')
    sports_complex_name = serializers.CharField(source='sports_complex.name')
    facility_type = serializers.CharField(source='sports_complex.facility')
    class Meta:
        model = Charges
        fields = ['uid', 'sports_complex_name', 'facility_type', 'group', 'type', 'rate']
