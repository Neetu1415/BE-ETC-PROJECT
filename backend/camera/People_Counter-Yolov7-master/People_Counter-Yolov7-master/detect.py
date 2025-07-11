import os
import sys
YOLO_BASE = os.path.dirname(os.path.abspath(__file__))
sys.path.append(YOLO_BASE)


from argparse import Namespace
from utils.torch_utils import select_device, load_classifier, time_synchronized, TracedModel
from utils.plots import plot_one_box
from utils.general import check_img_size, non_max_suppression, scale_coords, set_logging, increment_path
from utils.datasets import LoadStreams, LoadImages
from models.experimental import attempt_load
import argparse
import time
from pathlib import Path
import cv2
import torch
import torch.backends.cudnn as cudnn
from numpy import random

import json
import django
import logging
import multiprocessing
# import threading
import numpy as np
from datetime import datetime, timedelta
from django.core.mail import send_mail
from django.db import transaction

from django.conf import settings
from pathlib import Path
# This gets .../People_Counter_Yolov7_master/People_Counter_Yolov7_master
#YOLO_BASE = os.path.dirname(os.path.abspath(__file__))
#sys.path.append(YOLO_BASE)

# datasheet_path = Path(self._output_path) / "datasheets" / datasheet_name

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("yolo_detection.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Set up Django environment
BASE_DIR = os.path.abspath(
    os.path.join(
        os.path.dirname(__file__),
        '..',
        '..',
         '..'))
sys.path.append(BASE_DIR)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# Check if .env file exists
env_path = os.path.join(BASE_DIR, '.env')
if not os.path.exists(env_path):
    logger.info(
        f"{env_path} not found - if you're not configuring your environment separately, check this.")

try:
    django.setup()
    # Import Django models
    from sports_facility.models import Sports_complex, Camera
    from facility_booking.models import Booking
    from camera.models import FacilityPeopleCount, FacilityAlert
    django_available = True
except Exception as e:
    logger.warning(
        f"Django setup failed: {e}. Will continue without database functionality.")
    django_available = False

# Configure OpenCV for RTSP streams
os.environ["OPENCV_FFMPEG_CAPTURE_OPTIONS"] = "rtsp_transport;tcp|buffer_size;10000000|fifo_size;10000000"

# Initialize JSON file for fallback logging
json_path = 'people_counts.json'
if not os.path.exists(json_path):
    with open(json_path, 'w') as f:
        json.dump([], f)

# Import YOLO modules
# Import letterbox function - FIX: Import letterbox correctly
try:
    from utils.datasets import letterbox
except ImportError:
    # Alternative import paths for letterbox function
    try:
        from utils.augmentations import letterbox
    except ImportError:
        # Define letterbox function if it's not available in the imports
        def letterbox(
    img,
    new_shape=(
        640,
        640),
        color=(
            114,
            114,
            114),
            auto=True,
            scaleFill=False,
            scaleup=True,
             stride=32):
            # Resize and pad image while meeting stride-multiple constraints
            shape = img.shape[:2]  # current shape [height, width]
            if isinstance(new_shape, int):
                new_shape = (new_shape, new_shape)

            # Scale ratio (new / old)
            r = min(new_shape[0] / shape[0], new_shape[1] / shape[1])
            # only scale down, do not scale up (for better test mAP)
            if not scaleup:
                r = min(r, 1.0)

            # Compute padding
            ratio = r, r  # width, height ratios
            new_unpad = int(round(shape[1] * r)), int(round(shape[0] * r))
            dw, dh = new_shape[1] - new_unpad[0], new_shape[0] - \
                new_unpad[1]  # wh padding
            if auto:  # minimum rectangle
                dw, dh = np.mod(dw, stride), np.mod(dh, stride)  # wh padding
            elif scaleFill:  # stretch
                dw, dh = 0.0, 0.0
                new_unpad = (new_shape[1], new_shape[0])
                ratio = new_shape[1] / shape[1], new_shape[0] / \
                    shape[0]  # width, height ratios

            dw /= 2  # divide padding into 2 sides
            dh /= 2

            if shape[::-1] != new_unpad:  # resize
                img = cv2.resize(
    img, new_unpad, interpolation=cv2.INTER_LINEAR)
            top, bottom = int(round(dh - 0.1)), int(round(dh + 0.1))
            left, right = int(round(dw - 0.1)), int(round(dw + 0.1))
            img = cv2.copyMakeBorder(
    img,
    top,
    bottom,
    left,
    right,
    cv2.BORDER_CONSTANT,
     value=color)
            return img, ratio, (dw, dh)

# Configuration
CONFIG = {
    'log_interval_minutes': 1,  # Changed from 10 to 1 for more frequent updates
    'violation_threshold': 3,
    # 'default_rtsp_url': "rtsp://admin:GECGATE@321@172.28.0.95:554/stream",
    'default_rtsp_url': None,
    'send_email_alerts': True,
    'admin_email': 'admin@example.com',
    'max_connection_retries': 3,
    'retry_delay_seconds': 5,
    'save_detection_images': True,  # Save images with detections for verification
    'detection_images_dir': 'detection_images'  # Directory to save detection images
}

# Create detection images directory if it doesn't exist
if CONFIG['save_detection_images'] and not os.path.exists(
    CONFIG['detection_images_dir']):
    os.makedirs(CONFIG['detection_images_dir'])


def get_camera_url(facility_id=None):
    """
    Get camera URL from database based on facility ID.
    If no facility ID is provided, return the first active camera.
    """
    if not django_available:
        logger.warning("Django not available, using default camera URL")
        return CONFIG['default_rtsp_url'] + \
            "?buffer_size=10000000&fifo_size=10000000", None

    try:
        if facility_id:
            camera = Camera.objects.filter(
    sports_complex_id=facility_id,
     is_active=True).first()
        else:
            camera = Camera.objects.filter(is_active=True).first()

        if camera and camera.ip_url:
            # Add buffer parameters to improve stream stability
            url = camera.ip_url
            if '?' not in url:
                url += '?buffer_size=10000000&fifo_size=10000000'
            logger.info(f"Using camera: {camera} with URL: {url}")
            return url, camera
        else:
            logger.warning("No camera found in database, using default URL")
            return CONFIG['default_rtsp_url'] + \
                "?buffer_size=10000000&fifo_size=10000000", None
    except Exception as e:
        logger.error(f"Error fetching camera URL: {e}")
        return CONFIG['default_rtsp_url'] + \
            "?buffer_size=10000000&fifo_size=10000000", None


def get_all_active_cameras():
    """
    Get all active cameras from the database.
    """
    if not django_available:
        logger.warning("Django not available, cannot fetch cameras")
        return []

    try:
        cameras = Camera.objects.filter(is_active=True)
        logger.info(f"Found {len(cameras)} active cameras")
        return cameras
    except Exception as e:
        logger.error(f"Error fetching active cameras: {e}")
        return []


def check_booking_status(sports_complex_id, timestamp=None):
    """
    Check if the facility is currently booked and for how many people.
    Returns (is_booked, expected_count)
    """
    if not django_available or not sports_complex_id:
        return False, 0

    if timestamp is None:
        timestamp = datetime.now()

    current_date = timestamp.date()
    current_time = timestamp.time()

    try:
        # Find active bookings for this facility
        bookings = Booking.objects.filter(
            sports_complex_id=sports_complex_id,
            booking_date__lte=current_date,
            booking_end_date__gte=current_date
        )

        # Filter bookings by time if on the start or end date
        active_bookings = []
        for booking in bookings:
            if booking.booking_date == current_date and booking.booking_time > current_time:
                continue
            if booking.booking_end_date == current_date and booking.booking_end_time < current_time:
                continue
            active_bookings.append(booking)

        if active_bookings:
            # For simplicity, assume 1 person per booking
            # In a real system, you might have a field for expected number of
            # people
            return True, len(active_bookings)

        return False, 0
    except Exception as e:
        logger.error(f"Error checking booking status: {e}")
        return False, 0


def send_alert_email(subject, message, recipient_list=None):
    """
    Send email notification for alerts.
    """
    if not CONFIG['send_email_alerts'] or not django_available:
        return

    if recipient_list is None:
        recipient_list = [CONFIG['admin_email']]

    try:
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            recipient_list,
            fail_silently=False,
        )
        logger.info(f"Alert email sent to {recipient_list}")
    except Exception as e:
        logger.error(f"Failed to send email alert: {e}")



def log_count_to_json(
    count,
    facility_id=None,
    camera_id=None,
    is_booked=False,
    expected_count=0
):
    """
    Log people count to database and check for violations.
    """
    logger.info(f"PEOPLE COUNT: {count} people detected")

    if True:
        try:
            sports_complex = None
            camera = None

            if facility_id:
                sports_complex = Sports_complex.objects.get(id=facility_id)
            if camera_id:
                camera = Camera.objects.get(id=camera_id)

            people_count = FacilityPeopleCount.objects.create(
                sports_complex=sports_complex,
                camera=camera,
                detected_count=count
            )
            logger.info(
                f"Logged count: {count} people at {sports_complex} (Camera: {camera})")
	    # Skip alert processing if no one detected
            if count == 0:
                logger.info("No people detected.")
                return


            if True:
                alert, created = FacilityAlert.objects.get_or_create(
                    sports_complex=sports_complex,
                    camera=camera,
                    defaults={'message':f'UNAUTHORIZED USAGE: {count} people detected at {sports_complex} without booking.', 'violation_count': 0}
                )
                print('***********************', alert.violation_count, is_booked, count)

                if alert:
                    last_updated = alert.last_violation
                    time_difference = datetime.now() - last_updated.replace(tzinfo=None)

                if not is_booked and count > 0:
                    print('line 285')
                    if alert:
                        print('line 287', alert.violation_count)
                        logger.info(f"Violation count increased to {alert.violation_count} for {sports_complex}")

                        if alert.violation_count >= CONFIG['violation_threshold']:
                            message = f"UNAUTHORIZED USAGE: {count} people detected at {sports_complex} without booking."
                            alert.message = message
                            logger.warning(message)

                            if alert.violation_count == CONFIG['violation_threshold']:
                                send_alert_email(
                                    "Unauthorized Facility Usage Alert",
                                    f"Unauthorized usage detected at {sports_complex}.\n\n"
                                    f"Camera: {camera}\n"
                                    f"People detected: {count}\n"
                                    f"Time: {datetime.now()}\n\n"
                                    f"This facility is not currently booked."
                                )
                                alert.violation_count = 0
                                logger.info(f"Alert sent and violation count reset to 1 for {sports_complex}")

                        print('line 311', alert.violation_count)
                        alert.violation_count += 1
                        alert.save()
                    else:
                        FacilityAlert.objects.create(
                            sports_complex=sports_complex,
                            camera=camera,
                            message=f"Potential unauthorized usage: {count} people detected.",
                            violation_count=1
                        )
                        logger.info(f"Created new alert for unauthorized usage: {count} people at {sports_complex}")

                elif alert:
                    alert.violation_count = 0
                    print('line   368')
                    alert.save()
                    logger.info(f"Reset violation count for {sports_complex}")

        except Exception as e:
            logger.error(f"Error logging count to database: {e}")

    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    data = {
        "timestamp": timestamp,
        "people_count": count,
        "is_booked": is_booked,
        "expected_count": expected_count,
        "facility_id": facility_id,
        "camera_id": camera_id
    }

    if os.path.exists(json_path):
        with open(json_path, 'r') as f:
            try:
                existing_data = json.load(f)
                if not isinstance(existing_data, list):
                    existing_data = []
            except json.JSONDecodeError:
                existing_data = []
    else:
        existing_data = []

    existing_data.append(data)
    existing_data = existing_data[-3:]

    with open(json_path, 'w') as f:
        json.dump(existing_data, f, indent=4)

def detect_single_camera(camera_url, camera, opt):
    """
    Run detection on a single camera for one frame and exit.
    Designed to be run by cron for each interval.
    """
    facility_id = camera.sports_complex.id if camera and hasattr(camera, 'sports_complex') else None
    camera_id = camera.id if camera else None

    # Set up the detection parameters
    weights = opt.weights
    imgsz = opt.img_size
    conf_thres = opt.conf_thres
    iou_thres = opt.iou_thres

    # Initialize
    set_logging()
    device = select_device(opt.device)
    half = device.type != 'cpu'

    # Load model
    model = attempt_load(weights, map_location=device)
    stride = int(model.stride.max())
    imgsz = check_img_size(imgsz, s=stride)
    if not opt.no_trace:
        model = TracedModel(model, device, opt.img_size)
    if half:
        model.half()

    names = model.module.names if hasattr(model, 'module') else model.names
    colors = [[random.randint(0, 255) for _ in range(3)] for _ in range(len(names))]

    if device.type != 'cpu':
        model(torch.zeros(1, 3, imgsz, imgsz).to(device).type_as(next(model.parameters())))

    logger.info(f"Starting detection for camera: {camera_url}")

    cap = cv2.VideoCapture(camera_url)
    if not cap.isOpened():
        logger.error(f"Failed to open camera: {camera_url}")
        return

    cap.set(cv2.CAP_PROP_BUFFERSIZE, 3)

    t0 = time.time()

    try:
        ret, frame = cap.read()
        if not ret:
            logger.warning("Failed to read frame, exiting.")
            return

        # Prepare image
        img = letterbox(frame, imgsz, stride=stride)[0]
        img = img[:, :, ::-1].transpose(2, 0, 1)
        img = np.ascontiguousarray(img)
        img = torch.from_numpy(img).to(device)
        img = img.half() if half else img.float()
        img /= 255.0
        if img.ndimension() == 3:
            img = img.unsqueeze(0)

        # Inference
        t1 = time_synchronized()
        pred = model(img, augment=opt.augment)[0]
        pred = non_max_suppression(pred, conf_thres, iou_thres, classes=opt.classes, agnostic=opt.agnostic_nms)
        t2 = time_synchronized()

        # Process detections
        people_count = 0
        for i, det in enumerate(pred):
            im0 = frame.copy()
            if len(det):
                det[:, :4] = scale_coords(img.shape[2:], det[:, :4], im0.shape).round()
                people_count = sum(1 for *_, cls in det if int(cls) == 0)

                for *xyxy, conf, cls in reversed(det):
                    if int(cls) == 0:
                        label = f'{names[int(cls)]} {conf:.2f}'
                        plot_one_box(xyxy, im0, label=label, color=colors[int(cls)], line_thickness=3)

            logger.info(f"{i}: {im0.shape[0]}x{im0.shape[1]} {people_count} persons, Done. ({t2 - t1:.3f}s)")

            if CONFIG['save_detection_images']:
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                save_path = os.path.join(CONFIG['detection_images_dir'], f"detection_{timestamp}_{people_count}persons.jpg")
                cv2.imwrite(save_path, im0)
                logger.info(f"Saved detection image to {save_path}")

        # Log count + violations
        is_booked, expected_count = check_booking_status(facility_id)
        log_count_to_json(
            people_count,
            facility_id=facility_id,
            camera_id=camera_id,
            is_booked=is_booked,
            expected_count=expected_count
        )
        logger.info(f"Logged count: {people_count} people (is_booked={is_booked}, expected={expected_count})")

    except Exception as e:
        logger.error(f"Error during detection: {e}")

    finally:
     cap.release()
     cv2.destroyAllWindows()
     logger.info(f"Detection completed for camera: {camera_url} ({time.time() - t0:.3f}s)")
     print(f"{i}: {im0.shape[0]}x{im0.shape[1]} {people_count} persons, Done. ({t2 - t1:.3f}s)")


#old  single_camera 
#def detect_single_camera(camera_url, camera, opt):
#     """
#     Run detection on a single camera with error handling.
#     """
#     facility_id = camera.sports_complex.id if camera and hasattr(camera, 'sports_complex') else None
#     camera_id = camera.id if camera else None
    
#     # Set up the detection parameters
#     weights = opt.weights
#     imgsz = opt.img_size
#     conf_thres = opt.conf_thres
#     iou_thres = opt.iou_thres
    
#     # Initialize
#     set_logging()
#     device = select_device(opt.device)
#     half = device.type != 'cpu'
    
#     # Load model
#     model = attempt_load(weights, map_location=device)
#     stride = int(model.stride.max())
#     imgsz = check_img_size(imgsz, s=stride)
#     if not opt.no_trace:
#         model = TracedModel(model, device, opt.img_size)
#     if half:
#         model.half()
    
#     # Get names and colors
#     names = model.module.names if hasattr(model, 'module') else model.names
#     # colors = [[random.randint(0, 255) for _ in range(3)] for _ in _ in range(3)] for _ in range(len(names))]
#     colors = [[random.randint(0, 255) for _ in range(3)] for _ in range(len(names))]
#     # Run inference once to initialize
#     if device.type != 'cpu':
#         model(torch.zeros(1, 3, imgsz, imgsz).to(device).type_as(next(model.parameters())))
    
#     # Initialize variables for logging
#     t0 = time.time()
#     last_log_time = datetime.now()
#     log_interval = timedelta(minutes=CONFIG['log_interval_minutes'])
    
#     logger.info(f"Starting detection for camera: {camera_url}")
    
#     # Create a direct OpenCV capture for more control
#     cap = cv2.VideoCapture(camera_url)
#     if not cap.isOpened():
#         logger.error(f"Failed to open camera: {camera_url}")
#         return
    
#     # Set buffer size to reduce frame dropping
#     cap.set(cv2.CAP_PROP_BUFFERSIZE, 3)
    
#     # Frame counter for saving images
#     frame_count = 0
    
#     try:
#         while True:
#             # Read frame
#             ret, frame = cap.read()
#             if not ret:
#                 logger.warning("Failed to read frame, attempting to reconnect...")
#                 time.sleep(2)
#                 cap.release()
#                 cap = cv2.VideoCapture(camera_url)
#                 if not cap.isOpened():
#                     logger.error("Failed to reconnect to camera")
#                     break
#                 continue
            
#             frame_count += 1
            
#             # Prepare image for YOLO
#             try:
#                 # Use a larger image size for better detection of small objects
#                 img = letterbox(frame, imgsz, stride=stride)[0]
#                 img = img[:, :, ::-1].transpose(2, 0, 1)  # BGR to RGB
#                 img = np.ascontiguousarray(img)
#                 img = torch.from_numpy(img).to(device)
#                 img = img.half() if half else img.float()
#                 img /= 255.0
#                 if img.ndimension() == 3:
#                     img = img.unsqueeze(0)
                
#                 # Inference
#                 t1 = time_synchronized()
#                 pred = model(img, augment=opt.augment)[0]
                
#                 # Apply NMS with lower confidence threshold to detect more people
#                 pred = non_max_suppression(
#                     pred, 
#                     conf_thres, 
#                     iou_thres, 
#                     classes=opt.classes, 
#                     agnostic=opt.agnostic_nms
#                 )
#                 t2 = time_synchronized()
                
#                 # Process detections
#                 people_count = 0
#                 for i, det in enumerate(pred):
#                     s = ''
#                     im0 = frame.copy()
                    
#                     if len(det):
#                         # Rescale boxes from img_size to im0 size
#                         det[:, :4] = scale_coords(img.shape[2:], det[:, :4], im0.shape).round()
                        
#                         # Count people (class 0)
#                         people_count = sum(1 for *_, cls in det if int(cls) == 0)
#                         s += f"{people_count} person{'s' if people_count > 1 else ''}, "
                        
#                         # Draw boxes with thicker lines and larger font for better visibility
#                         for *xyxy, conf, cls in reversed(det):
#                             if int(cls) == 0:  # Only process "person" class
#                                 label = f'{names[int(cls)]} {conf:.2f}'
#                                 plot_one_box(xyxy, im0, label=label, color=colors[int(cls)], line_thickness=3)
                    
#                     # Print time (inference + NMS)
#                     print(f"{i}: {im0.shape[0]}x{im0.shape[1]} {people_count} persons, Done. ({t2 - t1:.3f}s)")
#                     logger.info(f"{i}: {im0.shape[0]}x{im0.shape[1]} {people_count} persons, Done. ({t2 - t1:.3f}s)")
                    
#                     # Save detection image periodically for verification
#                     if CONFIG['save_detection_images'] and frame_count % 30 == 0:  # Save every 30 frames
#                         timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
#                         save_path = os.path.join(CONFIG['detection_images_dir'], f"detection_{timestamp}_{people_count}persons.jpg")
#                         cv2.imwrite(save_path, im0)
#                         logger.info(f"Saved detection image to {save_path}")
                    
#                     # Stream results
#                     if opt.view_img:
#                         window_name = f"Camera: {camera.sports_complex.name if camera and hasattr(camera, 'sports_complex') else 'Unknown'}"
#                         cv2.imshow(window_name, im0)
#                         if cv2.waitKey(1) & 0xFF == ord('q'):  # Press 'q' to exit
#                             break
                
#                 # Check if it's time to log the count
#                 current_time = datetime.now()
#                 if current_time - last_log_time >= log_interval:
#                     # Check booking status
#                     is_booked, expected_count = check_booking_status(facility_id, current_time)
#                     print('is_booked',is_booked, expected_count)

#                     # Log count and check for violations
#                     log_count_to_json(
#                         people_count, 
#                         facility_id=facility_id, 
#                         camera_id=camera_id,
#                         is_booked=is_booked,
#                         expected_count=expected_count
#                     )
                    
#                     last_log_time = current_time
#                     logger.info(f"Logged count at {current_time}: {people_count} people detected")
                
#             except Exception as e:
#                 logger.error(f"Error processing frame: {e}")
#                 continue
                
#             # Add a small delay to reduce CPU usage
#             time.sleep(0.01)
            
#     except KeyboardInterrupt:
#         logger.info("Detection stopped by user")
#     except Exception as e:
#         logger.error(f"Error in detection loop: {e}")
#     finally:
#         cap.release()
#         cv2.destroyAllWindows()
#         logger.info(f"Detection completed for camera: {camera_url} ({time.time() - t0:.3f}s)")

def detect_multi_camera(opt):
    """
    Run detection on multiple cameras in parallel.
    """
    cameras = get_all_active_cameras()
    
    if not cameras:
        logger.warning("No active cameras found. Using default camera.")
        url, camera = get_camera_url()
        detect_single_camera(url, camera, opt)
        return
    
    processes = []
    for camera in cameras:
        if not camera.ip_url:
            logger.warning(f"Camera {camera.id} has no URL. Skipping.")
            continue

        logger.info(f"Starting process for camera: {camera}")
        process = multiprocessing.Process(
            target=detect_single_camera,
            args=(camera.ip_url, camera, opt),
            name=f"Camera-{camera.id}"
        )
        print(camera, '****************************cameraaaa')
        process.daemon = True  # optional: you can skip daemon if you want them to stay running
        process.start()
        processes.append(process)

    # Wait for all processes to complete
    for process in processes:
         process.join()

  #  threads = []
  # for camera in cameras:
  #      if not camera.ip_url:
   #        logger.warning(f"Camera {camera.id} has no URL. Skipping.")
    #        continue
        
 #      logger.info(f"Starting thread for camera: {camera}")
 #      thread = threading.Thread(
 #          target=detect_single_camera,
 #          args=(camera.ip_url, camera, opt),
 #          name=f"Camera-{camera.id}"
 #      )
 #      thread.daemon = True
 #       thread.start()
 #       threads.append(thread)
    
    # Wait for all threads to complete
#    for thread in threads:
#       thread.join()

def detect(opt,save_img=False):
    """
    Main detection function.
    """
    print('multicameraaaa', opt.multi_camera)
    if opt.multi_camera:
        detect_multi_camera(opt)
    else:
        # Get camera URL from database
        source, camera = get_camera_url(opt.facility_id)
        detect_single_camera(source, camera, opt)

def check_alerts():
    """
    Check for active alerts in the database and print them.
    This function can be called to verify if alerts are being generated.
    """
    if not django_available:
        logger.warning("Django not available, cannot check alerts")
        return
    
    try:
        alerts = FacilityAlert.objects.filter(violation_count__gte=CONFIG['violation_threshold'])
        
        if not alerts:
            logger.info("No active alerts found")
            return
        
        logger.info(f"Found {len(alerts)} active alerts:")
        for alert in alerts:
            logger.info(f"Alert ID: {alert.id}")
            logger.info(f"Facility: {alert.sports_complex}")
            logger.info(f"Camera: {alert.camera}")
            logger.info(f"Message: {alert.message}")
            logger.info(f"Violation count: {alert.violation_count}")
            logger.info(f"Created at: {alert.created_at}")
            logger.info(f"Updated at: {alert.last_violation}")
#	    logger.info(f"Updated at: {alert.updated_at}")

            logger.info("---")
    
    except Exception as e:
        logger.error(f"Error checking alerts: {e}")

#if __name__ == '__main__':
def run_detect():
    parser = argparse.ArgumentParser(prog='detect')
    parser.add_argument('--weights', nargs='+', type=str, default='yolov7.pt', help='model.pt path(s)')
    parser.add_argument('--facility-id', type=int, default=None, help='ID of the facility to monitor')
    parser.add_argument('--multi-camera', action='store_true', help='Monitor all active cameras')
    parser.add_argument('--img-size', type=int, default=1280, help='inference size (pixels)')  # Increased from 640 to 1280
    parser.add_argument('--conf-thres', type=float, default=0.20, help='object confidence threshold')  # Lowered from 0.25 to 0.20
    parser.add_argument('--iou-thres', type=float, default=0.45, help='IOU threshold for NMS')
    parser.add_argument('--device', default='', help='cuda device, i.e. 0 or 0,1,2,3 or cpu')
    parser.add_argument('--view-img', action='store_true', help='display results')
    parser.add_argument('--save-txt', action='store_true', help='save results to *.txt')
    parser.add_argument('--save-conf', action='store_true', help='save confidences in --save-txt labels')
    parser.add_argument('--nosave', action='store_true', help='do not save images/videos')
    parser.add_argument('--classes', nargs='+', type=int, default=[0], help='filter by class: --class 0, or --class 0 2 3')  # Default to only person class
    parser.add_argument('--agnostic-nms', action='store_true', help='class-agnostic NMS')
    parser.add_argument('--augment', action='store_true', help='augmented inference')
    parser.add_argument('--update', action='store_true', help='update all models')
    parser.add_argument('--project', default='runs/detect', help='save results to project/name')
    parser.add_argument('--name', default='exp', help='save results to project/name')
    parser.add_argument('--exist-ok', action='store_true', help='existing project/name ok, do not increment')
    parser.add_argument('--no-trace', action='store_true', help='don`t trace model')
    parser.add_argument('--check-alerts', action='store_true', help='check for active alerts in the database')
    #opt = parser.parse_args()
    #print(parser.parse_args())
    #input()
    #opt={}
    #opt = argparse.Namespace()
    opt = Namespace(
    weights='/home/gec/BE-ETC-PROJECT/backend/camera/People_Counter_Yolov7_master/People_Counter_Yolov7_master/yolov7.pt',
    facility_id=None,
    multi_camera=True,
    img_size=1280,
    conf_thres=0.2,
    iou_thres=0.45,
    device='',
    view_img=False,
    save_txt=False,
    save_conf=False,
    nosave=False,
    classes=[0],
    agnostic_nms=False,
    augment=False,
    update=False,
    project='runs/detect',
    name='exp',
    exist_ok=True,
    no_trace=True,
    check_alerts=False
    )
    logger.info(opt)
    #opt.multi_camera=True
    #opt.check_alerts=False
    #opt.weights='/home/gec/BE-ETC-PROJECT/backend/camera/People_Counter_Yolov7_master/People_Counter_Yolov7_master/yolov7.pt'
    #opt.no_trace=True
    #opt.img_size=1280
    #opt.conf_thres=0.2
    print(opt)
    # Check for .env file
    env_path = os.path.join(os.path.dirname(__file__), '..', '..', '..', '.env')
    if not os.path.exists(env_path):
        logger.info(f"{env_path} not found - if you're not configuring your environment separately, check this.")

    # Check alerts if requested
    if opt.check_alerts:
        check_alerts()
        sys.exit(0)

    with torch.no_grad():
        if opt.update:  # update all models (to fix SourceChangeWarning)
            for opt.weights in ['yolov7.pt']:
                detect(opt)
                try:
                    from utils.general import strip_optimizer
                    strip_optimizer(opt.weights)
                except ImportError:
                    logger.warning("strip_optimizer not found, skipping model optimization")
        else:
            detect(opt)

    print('I am out of detect')
