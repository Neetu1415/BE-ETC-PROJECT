from sports_facility.models import Sports_complex, Camera
from camera.models import FacilityPeopleCount, FacilityAlert
from django.utils import timezone

def run():
    # Clear existing alerts
    FacilityAlert.objects.all().delete()
    print("Cleared existing alerts")

    try:
        complex = Sports_complex.objects.first()
        if not complex:
            print("No sports complex found. Please create one first.")
            return
            
        camera = complex.cameras.first()
        if not camera:
            print(f"No camera found for {complex}. Please run assign_camera.py first.")
            return
        
        # Simulate people detection (no booking)
        people_count = FacilityPeopleCount.objects.create(
            sports_complex=complex,
            camera=camera,
            detected_count=5
        )
        
        # Manually trigger violation check
        people_count.check_violation()
        
        # Check if alert was generated
        alerts = FacilityAlert.objects.filter(
            sports_complex=complex,
            camera=camera
        )
        
        if alerts.exists():
            print(f"SUCCESS: Alert generated: {alerts.first().message}")
            print(f"Alert timestamp: {alerts.first().timestamp}")
            print(f"People detected: {alerts.first().people_count}")
        else:
            print("ERROR: No alert was generated!")
            
    except Exception as e:
        print(f"Error during testing: {str(e)}")

if __name__ == "__main__":
    run()