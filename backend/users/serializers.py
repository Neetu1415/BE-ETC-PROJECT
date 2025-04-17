# users/serializers.py
from djoser.serializers import UserSerializer
from django.contrib.auth import get_user_model
from rest_framework import serializers
from sports_facility.models import Sports_complex, COMPLEX_class
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

class SportsComplexSerializer(serializers.ModelSerializer):
    # You can customize the fields you want to include.
    # For example, we'll include id and the human-readable name.
    name_display = serializers.SerializerMethodField()
    code = serializers.CharField(source="name", read_only=True)
    class Meta:
        model = Sports_complex
        fields = ['id','code' ,'name_display']

    def get_name_display(self, obj):
        # Return a friendly name using COMPLEX_class if available
        if obj.name and obj.name in COMPLEX_class.__members__:
            return COMPLEX_class[obj.name].value
        return obj.name or "Unknown Complex"

class CustomUserSerializer(UserSerializer):
    role = serializers.CharField(read_only=True)
    # Include the stadium details. This field will be null for users without a stadium.
    stadium = SportsComplexSerializer(read_only=True)

    class Meta(UserSerializer.Meta):
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'role', 'stadium']


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # include extra fields
        token["role"]    = user.role
        if user.stadium:
            token["stadium_id"]   = user.stadium.id
            token["stadium_code"] = user.stadium.name
        return token
