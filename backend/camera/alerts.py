import json
import datetime
from django.utils.timezone import make_aware, now
from camera.models import FacilityAlert

# File path for YOLO detection logs
json_file_path = "backend/camera/People_Counter-Yolov7-master/people_counts.json"

def check_violations():
    """ Checks JSON for violations and creates or updates alerts """
    try:
        with open(json_file_path, "r") as file:
            data = json.load(file)
        
        for facility, records in data.items():
            for record in records:
                expected = record["expected"]
                actual = record["actual"]
                timestamp = make_aware(datetime.datetime.fromisoformat(record["timestamp"]))

                if actual > expected:
                    # Check for existing alert
                    alert = FacilityAlert.objects.filter(
                        sports_complex=facility,
                        camera=record.get("camera")
                    ).first()

                    if alert:
                        # Increment violation count and update timestamp
                        alert.violation_count += 1
                        alert.last_violation = timestamp
                        alert.save()
                    else:
                        # Create a new alert
                        FacilityAlert.objects.create(
                            sports_complex=facility,
                            camera=record.get("camera"),
                            message=f"ALERT: {actual} people detected at {facility}.",
                            violation_count=1,
                            last_violation=timestamp
                        )

    except Exception as e:
        print(f"Error reading JSON: {e}")


def notify_admin(facility_name):
    """ Sends admin notification """
    print(f"ALERT: Facility '{facility_name}' has exceeded its capacity for over 30 minutes! Notify Admin.")



# import json
# import datetime
# from django.utils.timezone import make_aware
# from camera.models import Alert

# def check_violations():
#     json_file_path = "backend/camera/People_Counter-Yolov7-master/people_counts.json"
    
#     try:
#         with open(json_file_path, "r") as file:
#             data = json.load(file)
        
#         for facility, records in data.items():
#             violation_count = 0
#             violation_start = None

#             for record in records:
#                 expected = record["expected"]
#                 actual = record["actual"]
#                 timestamp = make_aware(datetime.datetime.fromisoformat(record["timestamp"]))

#                 if actual > expected:
#                     if violation_count == 0:
#                         violation_start = timestamp
#                     violation_count += 1

#                     alert, created = Alert.objects.get_or_create(
#                         facility_name=facility,
#                         expected_count=expected,
#                         actual_count=actual,
#                         violation_time=timestamp
#                     )
#                     alert.alert_count += 1
#                     alert.save()

#                     if violation_count >= 6:  # Violations for 30 minutes (6 records assuming 5-min intervals)
#                         notify_admin(facility)
#                 else:
#                     violation_count = 0  # Reset if condition is not met

#     except Exception as e:
#         print(f"Error reading JSON: {e}")

# def notify_admin(facility_name):
#     print(f"ALERT: Facility '{facility_name}' has exceeded its capacity for over 30 minutes! Notify Admin.")
