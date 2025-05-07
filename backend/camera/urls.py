from django.urls import path
from .views import alerts_dashboard, get_alerts

# URL patterns for camera app
urlpatterns = [
    path('alerts/', get_alerts, name='get_alerts'),              # Fetch alerts with violation count
    path('dashboard/', alerts_dashboard, name='alerts_dashboard'),  # Admin dashboard view
]


# from django.urls import path
# from .views import alerts_dashboard, get_alerts

# urlpatterns = [
#     path('alerts/', get_alerts, name='get_alerts'),  # Existing endpoint
#     path('dashboard/', alerts_dashboard, name='alerts_dashboard'),  # Added dashboard route
# ]
