from rest_framework import serializers
from .models import Charges

class SlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = Charges
        fields = '__all__' 
