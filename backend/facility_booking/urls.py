from django.urls import path
from .views import slots

urlpatterns = [
    path('charges/', slots, name='charges-list'),  # Map the view to the URL
]