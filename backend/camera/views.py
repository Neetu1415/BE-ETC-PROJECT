from django.shortcuts import render
from django.http import JsonResponse
from django.utils import timezone
from datetime import timedelta
from .models import FacilityAlert, FacilityPeopleCount

def alerts_dashboard(request):
    """ Render the dashboard with recent alerts and detections. """
    now = timezone.now()  # Store current timestamp for consistency
    
    # Get recent alerts (last 24 hours)
    recent_alerts = FacilityAlert.objects.filter(
        last_violation__gte=now - timedelta(hours=24)
    ).order_by('-last_violation')

    # Get recent detections (last hour)
    recent_detections = FacilityPeopleCount.objects.filter(
        timestamp__gte=now - timedelta(hours=1)
    ).order_by('-timestamp')

    context = {
        'alerts': recent_alerts,
        'detections': recent_detections,
    }

    return render(request, 'camera/dashboard.html', context)


def get_alerts(request):
    """ API view to return the latest alerts with violation counts. """
    now = timezone.now()
    
    alerts = FacilityAlert.objects.filter(
        last_violation__gte=now - timedelta(hours=24)
    ).order_by('-last_violation').values(
        'id', 'message', 'violation_count', 'last_violation'
    )

    if not alerts:
        return JsonResponse({'error': 'No alerts found'}, status=404)

    return JsonResponse(list(alerts), safe=False)






# from django.shortcuts import render
# from django.http import JsonResponse
# from django.utils import timezone
# from datetime import timedelta
# from .models import FacilityAlert, FacilityPeopleCount

# def alerts_dashboard(request):
#     now = timezone.now()  # Store current timestamp to ensure consistency
    
#     # Get recent alerts (last 24 hours)
#     recent_alerts = FacilityAlert.objects.filter(
#         last_violation__gte=now - timedelta(hours=24)
#     ).order_by('-last_violation')

#     # Get recent detections (last hour)
#     recent_detections = FacilityPeopleCount.objects.filter(
#         timestamp__gte=now - timedelta(hours=1)
#     ).order_by('-timestamp')

#     context = {
#         'alerts': recent_alerts,
#         'detections': recent_detections,
#     }

#     return render(request, 'camera/dashboard.html', context)


# def get_alerts(request):
#     """ API view to return the latest alerts as JSON. """
#     now = timezone.now()
    
#     alerts = FacilityAlert.objects.filter(
#         last_violation__gte=now - timedelta(hours=24)
#     ).order_by('-last_violation').values('id', 'message', 'last_violation')

#     return JsonResponse(list(alerts), safe=False)


