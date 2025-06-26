#!/bin/bash

echo "Starting test sequence..."

# Activate virtual environment if you're using one
# source venv/bin/activate

# Change to project directory
cd "C:\Users\mitali ghadi\OneDrive\Desktop\BE-ETC-PROJECT-phase_2\backend"


# Run migrations if needed
echo "Running migrations..."
python manage.py migrate

# Assign cameras
echo "Assigning cameras..."
python manage.py shell -c "exec(open('sports_facility/tests/assign_camera.py').read())"

# Run test alert
echo "Testing alert generation..."
python manage.py shell -c "exec(open('camera/tests/test_alert.py').read())"

# Check alerts
echo "Checking generated alerts..."
python manage.py shell -c "exec(open('scripts/check_alerts.py').read())"

# Run management command
echo "Running detect_people management command..."
python manage.py detect_people

echo "Test sequence completed."