
from datetime import datetime

def hello():
    with open("/home/gec/BE-ETC-PROJECT/backend/cron_output.log", "a") as f:
        f.write(f"{datetime.now()} - I ran\n")

#def hello():
 #   print('I ran')
 #  print('***********************************')

#from django.core.management.base import BaseCommand
#from sports_facility.models import Sports_complex, Camera

#def assign_camera():
    # Find a sports complex by UID
 #   try:
  #      complex = Sports_complex.objects.first()
   #     if not complex:
    #        print("No sports complex found. Please create one first.")
     #       return

        # Create a new camera for this complex
     #   camera = Camera.objects.create(
       #     sports_complex=complex,
      #      ip_url='rtsp://admin:password@172.31.1.60:554/stream',
        #    description='Main entrance camera',
         #   is_active=True
#        )
        
        #print(f"Camera added to {complex}: {camera.ip_url}")

        # Add second camera
       # camera2 = Camera.objects.create(
       #     sports_complex=complex,
       #     ip_url='rtsp://admin:password@192.168.1.101:554/stream',
       #     description='Field view camera',
       #     is_active=True
       # )
        
        #print(f"Second camera added to {complex}: {camera2.ip_url}")

   # except Exception as e:
    #    print(f"Error: {str(e)}")




  #exec(open('sports_facility/tests/assign_camera.py').read())"

# Trigger a test alert
#echo "Testing alert generation..."
#python3 manage.py shell -c "exec(open('camera/tests/test_alert.py').read())"

# Check alerts
#echo "Checking generated alerts..."
#python3 manage.py shell -c "exec(open('scripts/check_alerts.py').read())"

