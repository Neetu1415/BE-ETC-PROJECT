from django.urls import path
from .views import slots
from .views import create_booking

urlpatterns = [
    path('charges/', slots, name='charges-list'),  # Map the view to the URL
    path('create/', create_booking, name='create_booking'),
]