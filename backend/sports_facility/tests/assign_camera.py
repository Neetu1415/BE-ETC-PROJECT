from django.core.management.base import BaseCommand
from sports_facility.models import Sports_complex, Camera

def run():
    # Find a sports complex by UID
    try:
        complex = Sports_complex.objects.first()
        if not complex:
            print("No sports complex found. Please create one first.")
            return

        # Create a new camera for this complex
        camera = Camera.objects.create(
            sports_complex=complex,
            # ip_url='rtsp://admin:password@192.168.1.100:554/stream',
            ip_url='rtsp://admin:GECMAIN%40124@172.31.1.60:554/Streaming/Channels/101/',
            description='Main entrance camera',
            is_active=True
        )
        
        print(f"Camera added to {complex}: {camera.ip_url}")

        # Add second camera
        # camera2 = Camera.objects.create(
        #     sports_complex=complex,
        #     ip_url='rtsp://admin:password@192.168.1.101:554/stream',
        #     description='Field view camera',
        #     is_active=True
        # )
        
        # print(f"Second camera added to {complex}: {camera2.ip_url}")

    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    run()