# users/urls.py
from django.urls import path
from .views import MyTokenObtainPairView, UserInfoView , OverallAdminDashboardView, StadiumAdminDashboardView , CustomerDashboardView

urlpatterns = [
    path('jwt/create/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('users/me/', UserInfoView.as_view(), name='user_info'),
    path('admin/dashboard/', OverallAdminDashboardView.as_view(), name='overall-admin-dashboard'),
    path('stadium/dashboard/', StadiumAdminDashboardView.as_view(), name='stadium-admin-dashboard'),
     path('customer/dashboard/', CustomerDashboardView.as_view(), name='customer-dashboard'),
]
