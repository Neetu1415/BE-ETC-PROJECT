import os
import django
import json
import sys

# Add the project root to the path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from sports_facility.models import Camera

def get_camera_ips():
    """Fetch all active camera IPs from the database"""
    cameras = Camera.objects.filter(is_active=True)
    
    # Group cameras by sports complex
    camera_data = {}
    for camera in cameras:
        complex_name = str(camera.sports_complex)
        if complex_name not in camera_data:
            camera_data[complex_name] = []
        
        if camera.ip_url:  # Only include cameras with IP URLs
            camera_data[complex_name].append({
                'id': camera.id,
                'ip_url': camera.ip_url,
                'description': camera.description
            })
    
    # Save to JSON file for the people counter to use
    output_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'camera_ips.json')
    with open(output_path, 'w') as f:
        json.dump(camera_data, f, indent=4)
    
    return camera_data

if __name__ == "__main__":
    cameras = get_camera_ips()
    print(f"Fetched {sum(len(cams) for cams in cameras.values())} cameras for {len(cameras)} sports complexes")