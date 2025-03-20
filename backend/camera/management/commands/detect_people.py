from django.core.management.base import BaseCommand
from sports_facility.models import Sports_complex, Camera
from camera.models import FacilityPeopleCount
import random

class Command(BaseCommand):
    help = 'Simulates people detection for all active cameras'

    def add_arguments(self, parser):
        parser.add_argument(
            '--complex',
            type=str,
            help='UID of the specific sports complex to check',
        )

    def handle(self, *args, **options):
        complex_uid = options.get('complex')

        if complex_uid:
            try:
                complex = Sports_complex.objects.get(uid=complex_uid)
                cameras = complex.cameras.filter(is_active=True)
                self.stdout.write(f"Checking {cameras.count()} cameras for complex {complex}")
            except Sports_complex.DoesNotExist:
                self.stdout.write(self.style.ERROR(f"Complex with UID {complex_uid} not found"))
                return
        else:
            cameras = Camera.objects.filter(is_active=True)
            self.stdout.write(f"Checking all {cameras.count()} active cameras")

        for camera in cameras:
            # Simulate random people count
            count = random.randint(0, 10)
            people_count = FacilityPeopleCount.objects.create(
                sports_complex=camera.sports_complex,
                camera=camera,
                detected_count=count
            )
            people_count.check_violation()
            self.stdout.write(f"Detected {count} people at {camera.sports_complex} - {camera.description}")