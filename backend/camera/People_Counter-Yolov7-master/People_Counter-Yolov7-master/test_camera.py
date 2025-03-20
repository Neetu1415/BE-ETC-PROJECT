import json
import datetime

def update_people_count(facility_name, expected, actual):
    json_file_path = "C:\Users\sande\OneDrive\Desktop\BEPROJECT\backend\camera\People_Counter-Yolov7-master\People_Counter-Yolov7-master\people_counts.json"
    timestamp = datetime.datetime.now().isoformat()

    try:
        with open(json_file_path, "r") as file:
            data = json.load(file)
    except (FileNotFoundError, json.JSONDecodeError):
        data = {}

    if facility_name not in data:
        data[facility_name] = []

    data[facility_name].append({"timestamp": timestamp, "expected": expected, "actual": actual})

    with open(json_file_path, "w") as file:
        json.dump(data, file, indent=4)

# Example Usage
update_people_count("facility_1", 5, 7)
