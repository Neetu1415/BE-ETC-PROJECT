# users/urls.py
from django.urls import path
from .views import MyTokenObtainPairView, UserInfoView

urlpatterns = [
    path('jwt/create/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('users/me/', UserInfoView.as_view(), name='user_info'),
]
