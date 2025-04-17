from django.shortcuts import render

# Create your views here.
# users/views.py (or another appropriate view file)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .permissions import IsOverallAdmin, IsStadiumAdmin
from .serializers import MyTokenObtainPairSerializer, CustomUserSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
class OverallAdminDashboardView(APIView):
    permission_classes = [IsAuthenticated, IsOverallAdmin]
    
    def get(self, request, *args, **kwargs):
        # Only overall_admin users can access this endpoint.
        data = {"message": "Welcome to the overall admin dashboard."}
        return Response(data, status=status.HTTP_200_OK)


class StadiumAdminDashboardView(APIView):
    permission_classes = [IsAuthenticated, IsStadiumAdmin]
    
    def get(self, request, *args, **kwargs):
        # For stadium admins only.
        stadium = request.user.stadium
        if not stadium:
            return Response({"detail": "No stadium associated with user."},
                            status=status.HTTP_400_BAD_REQUEST)
        # Return filtered data for this stadium
        data = {"message": f"Welcome to the stadium dashboard for {stadium}."}
        return Response(data, status=status.HTTP_200_OK)


class CustomerDashboardView(APIView):
    permission_classes = [IsAuthenticated]  # only logged‑in users

    def get(self, request):
        return Response(
            {"message": f"Welcome to your dashboard, {request.user.first_name}!"},
            status=200
        )

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class UserInfoView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        serializer = CustomUserSerializer(request.user)
        return Response(serializer.data)