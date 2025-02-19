# users/serializers.py
from djoser.serializers import UserSerializer
from django.contrib.auth import get_user_model
from rest_framework import serializers
User = get_user_model()

class CustomUserSerializer(UserSerializer):
    role = serializers.CharField(read_only=True)
    class Meta(UserSerializer.Meta):
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'role']
