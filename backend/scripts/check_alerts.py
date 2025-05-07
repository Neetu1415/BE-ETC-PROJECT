from camera.models import FacilityAlert

def run():
    # Get all alerts
    alerts = FacilityAlert.objects.all()
    print(f"Total alerts: {alerts.count()}")

    # Print details of each alert
    for alert in alerts:
        print(f"Alert ID: {alert.id}")
        print(f"Complex: {alert.sports_complex}")
        print(f"Camera: {alert.camera}")
        print(f"Message: {alert.message}")
        print(f"Timestamp: {alert.timestamp}")
        print(f"People count: {alert.people_count}")
        print("-" * 40)

if __name__ == "__main__":
    run()