












# #THIS CODE IS TO STORE OUPUT AFTER 1 MIN
# import argparse
# import time
# from pathlib import Path
# import cv2
# import torch
# import torch.backends.cudnn as cudnn
# from numpy import random
# import os
# import json
# from datetime import datetime, timedelta
# from collections import deque

# # Initialize JSON file if it doesn't exist
# json_path = 'people_counts.json'
# if not os.path.exists(json_path):
#     with open(json_path, 'w') as f:
#         json.dump([], f)

# # Custom Modules
# from models.experimental import attempt_load
# from utils.datasets import LoadStreams, LoadImages
# from utils.general import check_img_size, non_max_suppression, scale_coords, xyxy2xywh, strip_optimizer, set_logging, increment_path
# from utils.plots import plot_one_box
# from utils.torch_utils import select_device, load_classifier, time_synchronized, TracedModel

# # Modified log_count_to_json function to store only the last 3 minutes in 1-minute intervals
# def log_count_to_json(count, json_path=json_path, time_interval=1, window_duration=3):
#     timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
#     data = {
#         "timestamp": timestamp,
#         "people_count": count
#     }
    
#     # Load existing data if file exists
#     if os.path.exists(json_path):
#         with open(json_path, 'r') as f:
#             try:
#                 existing_data = json.load(f)
#                 if not isinstance(existing_data, list):
#                     existing_data = []
#             except json.JSONDecodeError:
#                 existing_data = []
#     else:
#         existing_data = []

#     # Add the new data
#     existing_data.append(data)
    
#     # Keep only the last 3 entries (3 minutes of data with 1-minute intervals)
#     existing_data = existing_data[-window_duration:]
    
#     # Write the filtered data to the JSON file
#     with open(json_path, 'w') as f:
#         json.dump(existing_data, f, indent=4)

# def detect(save_img=False):
#     source, weights, view_img, save_txt, imgsz, trace = opt.source, opt.weights, opt.view_img, opt.save_txt, opt.img_size, not opt.no_trace
#     save_img = not opt.nosave and not source.endswith('.txt')
#     webcam = source.isnumeric() or source.endswith('.txt') or source.lower().startswith(
#         ('rtsp://', 'rtmp://', 'http://', 'https://'))

#     # Directories
#     save_dir = Path(increment_path(Path(opt.project) / opt.name, exist_ok=opt.exist_ok))  # increment run
#     (save_dir / 'labels' if save_txt else save_dir).mkdir(parents=True, exist_ok=True)  # make dir

#     # Initialize
#     set_logging()
#     device = select_device(opt.device)
#     half = device.type != 'cpu'  # half precision only supported on CUDA

#     # Load model
#     model = attempt_load(weights, map_location=device)  # load FP32 model
#     stride = int(model.stride.max())  # model stride
#     imgsz = check_img_size(imgsz, s=stride)  # check img_size
#     if trace:
#         model = TracedModel(model, device, opt.img_size)
#     if half:
#         model.half()  # to FP16

#     # Set Dataloader
#     vid_path, vid_writer = None, None
#     if webcam:
#         view_img = True
#         cudnn.benchmark = True  # set True to speed up constant image size inference
#         dataset = LoadStreams(source, img_size=imgsz, stride=stride)
#     else:
#         dataset = LoadImages(source, img_size=imgsz, stride=stride)

#     # Get names and colors
#     names = model.module.names if hasattr(model, 'module') else model.names
#     colors = [[random.randint(0, 255) for _ in range(3)] for _ in names]

#     # Run inference
#     if device.type != 'cpu':
#         model(torch.zeros(1, 3, imgsz, imgsz).to(device).type_as(next(model.parameters())))  # run once

#     t0 = time.time()
#     last_log_time = datetime.now()
    
#     for path, img, im0s, vid_cap in dataset:
#         img = torch.from_numpy(img).to(device)
#         img = img.half() if half else img.float()  # uint8 to fp16/32
#         img /= 255.0  # 0 - 255 to 0.0 - 1.0
#         if img.ndimension() == 3:
#             img = img.unsqueeze(0)

#         # Inference
#         t1 = time_synchronized()
#         pred = model(img, augment=opt.augment)[0]

#         # Apply NMS
#         pred = non_max_suppression(pred, opt.conf_thres, opt.iou_thres, classes=opt.classes, agnostic=opt.agnostic_nms)
#         t2 = time_synchronized()

#         # Process detections
#         people_count = 0
#         for i, det in enumerate(pred):  # detections per image
#             if webcam:  # batch_size >= 1
#                 p, s, im0, frame = path[i], '%g: ' % i, im0s[i].copy(), dataset.count
#             else:
#                 p, s, im0, frame = path, '', im0s, getattr(dataset, 'frame', 0)

#             p = Path(p)  # to Path
#             save_path = str(save_dir / p.name)  # img.jpg
#             txt_path = str(save_dir / 'labels' / p.stem) + ('_%g' % dataset.frame if dataset.mode == 'video' else '')
#             s += '%gx%g ' % img.shape[2:]  # print string
#             gn = torch.tensor(im0.shape)[[1, 0, 1, 0]]  # normalization gain whwh
#             if len(det):
#                 # Rescale boxes from img_size to im0 size
#                 det[:, :4] = scale_coords(img.shape[2:], det[:, :4], im0.shape).round()
                
#                 # Count people (class 0)
#                 people_count = sum(1 for *_, cls in det if int(cls) == 0)  # Count only people (class 0)
#                 s += f"{people_count} person{'s' * (people_count > 1)}, "  # Add to string
                
#                 # Write results
#                 for *xyxy, conf, cls in reversed(det):
#                     if int(cls) == 0:  # Only process "person" class (class 0)
#                         label = f'{names[int(cls)]} {conf:.2f}'
#                         plot_one_box(xyxy, im0, label=label, color=colors[int(cls)], line_thickness=3)

#             # Print time (inference + NMS)
#             print(f'{s}Done. ({t2 - t1:.3f}s)')

#             # Stream results
#             if view_img:
#                 cv2.imshow(str(p), im0)
#                 cv2.waitKey(1)  # 1 millisecond

#             # Save results (image with detections)
#             if save_img:
#                 if dataset.mode == 'image':
#                     cv2.imwrite(save_path, im0)
#                 else:  # 'video' or 'stream'
#                     if vid_path != save_path:  # new video
#                         vid_path = save_path
#                         if isinstance(vid_writer, cv2.VideoWriter):
#                             vid_writer.release()  # release previous video writer
#                         if vid_cap:  # video
#                             fps = vid_cap.get(cv2.CAP_PROP_FPS)
#                             w = int(vid_cap.get(cv2.CAP_PROP_FRAME_WIDTH))
#                             h = int(vid_cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
#                         else:  # stream
#                             fps, w, h = 30, im0.shape[1], im0.shape[0]
#                             save_path += '.mp4'
#                         vid_writer = cv2.VideoWriter(save_path, cv2.VideoWriter_fourcc(*'mp4v'), fps, (w, h))
#                     vid_writer.write(im0)

#         # Check if it's time to log the count - changed from 10 minutes to 1 minute
#         current_time = datetime.now()
#         if current_time - last_log_time >= timedelta(minutes=1):  # Log every 1 minute
#             log_count_to_json(people_count)  # Store count in JSON file
#             last_log_time = current_time

#     print(f'Done. ({time.time() - t0:.3f}s)')

# if __name__ == '__main__':
#     parser = argparse.ArgumentParser()
#     parser.add_argument('--weights', nargs='+', type=str, default='yolov7.pt', help='model.pt path(s)')
#     parser.add_argument('--source', type=str, default='rtsp://admin:GECGATE@321@172.28.0.95:554/stream', help='source')
#     parser.add_argument('--img-size', type=int, default=640, help='inference size (pixels)')
#     parser.add_argument('--conf-thres', type=float, default=0.25, help='object confidence threshold')
#     parser.add_argument('--iou-thres', type=float, default=0.45, help='IOU threshold for NMS')
#     parser.add_argument('--device', default='', help='cuda device, i.e. 0 or 0,1,2,3 or cpu')
#     parser.add_argument('--view-img', action='store_true', help='display results')
#     parser.add_argument('--save-txt', action='store_true', help='save results to *.txt')
#     parser.add_argument('--save-conf', action='store_true', help='save confidences in --save-txt labels')
#     parser.add_argument('--nosave', action='store_true', help='do not save images/videos')
#     parser.add_argument('--classes', nargs='+', type=int, help='filter by class: --class 0, or --class 0 2 3')
#     parser.add_argument('--agnostic-nms', action='store_true', help='class-agnostic NMS')
#     parser.add_argument('--augment', action='store_true', help='augmented inference')
#     parser.add_argument('--update', action='store_true', help='update all models')
#     parser.add_argument('--project', default='runs/detect', help='save results to project/name')
#     parser.add_argument('--name', default='exp', help='save results to project/name')
#     parser.add_argument('--exist-ok', action='store_true', help='existing project/name ok, do not increment')
#     parser.add_argument('--no-trace', action='store_true', help='don`t trace model')
#     opt = parser.parse_args()
#     print(opt)

#     with torch.no_grad():
#         if opt.update:  # update all models (to fix SourceChangeWarning)
#             for opt.weights in ['yolov7.pt']:
#                 detect()
#                 strip_optimizer(opt.weights)
#         else:
#             detect()























import sys
import argparse
import time
from pathlib import Path
import cv2
import torch
import torch.backends.cudnn as cudnn
from numpy import random
import os
import json
import django
import logging
import threading
import numpy as np
from datetime import datetime, timedelta
from django.core.mail import send_mail
from django.conf import settings

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("yolo_detection.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(_name_)

# Set up Django environment
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(_file_), '..', '..', '..'))
sys.path.append(BASE_DIR)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# Check if .env file exists
env_path = os.path.join(BASE_DIR, '.env')
if not os.path.exists(env_path):
    logger.info(f"{env_path} not found - if you're not configuring your environment separately, check this.")

try:
    django.setup()
    # Import Django models
    from sports_facility.models import Sports_complex, Camera
    from facility_booking.models import Booking
    from camera.models import FacilityPeopleCount, FacilityAlert
    django_available = True
except Exception as e:
    logger.warning(f"Django setup failed: {e}. Will continue without database functionality.")
    django_available = False

# Configure OpenCV for RTSP streams
os.environ["OPENCV_FFMPEG_CAPTURE_OPTIONS"] = "rtsp_transport;tcp|buffer_size;10000000|fifo_size;10000000"

# Initialize JSON file for fallback logging
json_path = 'people_counts.json'
if not os.path.exists(json_path):
    with open(json_path, 'w') as f:
        json.dump([], f)

# Import YOLO modules
from models.experimental import attempt_load
from utils.datasets import LoadStreams, LoadImages
from utils.general import check_img_size, non_max_suppression, scale_coords, set_logging, increment_path
from utils.plots import plot_one_box
from utils.torch_utils import select_device, load_classifier, time_synchronized, TracedModel

# Import letterbox function - FIX: Import letterbox correctly
try:
    from utils.datasets import letterbox
except ImportError:
    # Alternative import paths for letterbox function
    try:
        from utils.augmentations import letterbox
    except ImportError:
        # Define letterbox function if it's not available in the imports
        def letterbox(img, new_shape=(640, 640), color=(114, 114, 114), auto=True, scaleFill=False, scaleup=True, stride=32):
            # Resize and pad image while meeting stride-multiple constraints
            shape = img.shape[:2]  # current shape [height, width]
            if isinstance(new_shape, int):
                new_shape = (new_shape, new_shape)

            # Scale ratio (new / old)
            r = min(new_shape[0] / shape[0], new_shape[1] / shape[1])
            if not scaleup:  # only scale down, do not scale up (for better test mAP)
                r = min(r, 1.0)

            # Compute padding
            ratio = r, r  # width, height ratios
            new_unpad = int(round(shape[1] * r)), int(round(shape[0] * r))
            dw, dh = new_shape[1] - new_unpad[0], new_shape[0] - new_unpad[1]  # wh padding
            if auto:  # minimum rectangle
                dw, dh = np.mod(dw, stride), np.mod(dh, stride)  # wh padding
            elif scaleFill:  # stretch
                dw, dh = 0.0, 0.0
                new_unpad = (new_shape[1], new_shape[0])
                ratio = new_shape[1] / shape[1], new_shape[0] / shape[0]  # width, height ratios

            dw /= 2  # divide padding into 2 sides
            dh /= 2

            if shape[::-1] != new_unpad:  # resize
                img = cv2.resize(img, new_unpad, interpolation=cv2.INTER_LINEAR)
            top, bottom = int(round(dh - 0.1)), int(round(dh + 0.1))
            left, right = int(round(dw - 0.1)), int(round(dw + 0.1))
            img = cv2.copyMakeBorder(img, top, bottom, left, right, cv2.BORDER_CONSTANT, value=color)
            return img, ratio, (dw, dh)

# Configuration
CONFIG = {
    'log_interval_minutes': 10,  # Changed from 10 to 1 for more frequent updates
    'violation_threshold': 3,
    # 'default_rtsp_url': "rtsp://admin:GECGATE@321@172.28.0.95:554/stream",
    'default_rtsp_url':None,
    'send_email_alerts': True,
    'admin_email': 'admin@example.com',
    'max_connection_retries': 3,
    'retry_delay_seconds': 5,
    'save_detection_images': True,  # Save images with detections for verification
    'detection_images_dir': 'detection_images'  # Directory to save detection images
}

# Create detection images directory if it doesn't exist
if CONFIG['save_detection_images'] and not os.path.exists(CONFIG['detection_images_dir']):
    os.makedirs(CONFIG['detection_images_dir'])

def get_camera_url(facility_id=None):
    """
    Get camera URL from database based on facility ID.
    If no facility ID is provided, return the first active camera.
    """
    if not django_available:
        logger.warning("Django not available, using default camera URL")
        return CONFIG['default_rtsp_url'] + "?buffer_size=10000000&fifo_size=10000000", None
    
    try:
        if facility_id:
            camera = Camera.objects.filter(sports_complex_id=facility_id, is_active=True).first()
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
            return CONFIG['default_rtsp_url'] + "?buffer_size=10000000&fifo_size=10000000", None
    except Exception as e:
        logger.error(f"Error fetching camera URL: {e}")
        return CONFIG['default_rtsp_url'] + "?buffer_size=10000000&fifo_size=10000000", None

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
            # In a real system, you might have a field for expected number of people
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

def log_count_to_json(count, facility_id=None, camera_id=None, is_booked=False, expected_count=0):
    """
    Log people count to database and check for violations.
    """
    # Always log to console for immediate feedback
    logger.info(f"PEOPLE COUNT: {count} people detected")
    
    if django_available:
        try:
            # Get the sports complex and camera objects
            sports_complex = None
            camera = None
            
            if facility_id:
                sports_complex = Sports_complex.objects.get(id=facility_id)
            if camera_id:
                camera = Camera.objects.get(id=camera_id)
            
            # Create a new people count record
            people_count = FacilityPeopleCount.objects.create(
                sports_complex=sports_complex,
                camera=camera,
                detected_count=count
            )
            logger.info(f"Logged count: {count} people at {sports_complex} (Camera: {camera})")
            
            # Check for violations
            alert = FacilityAlert.objects.filter(
                sports_complex=sports_complex,
                camera=camera
            ).first()
            
            # Reset violations older than 10 minutes
            if alert:
                last_updated = alert.updated_at
                time_difference = datetime.now() - last_updated.replace(tzinfo=None)
                if time_difference.total_seconds() > 600:  # 10 minutes in seconds
                    logger.info(f"Resetting violation count for {sports_complex} due to 10-minute timeout")
                    alert.violation_count = 0
                    alert.save()
            
            if not is_booked and count > 0:
                # Case 1: Facility not booked but people detected
                if alert:
                    alert.violation_count += 1
                    logger.info(f"Violation count increased to {alert.violation_count} for {sports_complex}")
                    
                    if alert.violation_count >= CONFIG['violation_threshold']:
                        message = f"UNAUTHORIZED USAGE: {count} people detected at {sports_complex} without booking."
                        alert.message = message
                        logger.warning(message)
            
                        # Send email alert
                        if alert.violation_count == CONFIG['violation_threshold']:  # Only send on threshold crossing
                            send_alert_email(
                                "Unauthorized Facility Usage Alert",
                                f"Unauthorized usage detected at {sports_complex}.\n\n"
                                f"Camera: {camera}\n"
                                f"People detected: {count}\n"
                                f"Time: {datetime.now()}\n\n"
                                f"This facility is not currently booked."
                            )
                            # Reset violation count to 1 after sending alert (not 0)
                            alert.violation_count = 1
                            logger.info(f"Alert sent and violation count reset to 1 for {sports_complex}")
                    alert.save()
                else:
                    # Create new alert with violation count 1
                    FacilityAlert.objects.create(
                        sports_complex=sports_complex,
                        camera=camera,
                        message=f"Potential unauthorized usage: {count} people detected.",
                        violation_count=1
                    )
                    logger.info(f"Created new alert for unauthorized usage: {count} people at {sports_complex}")
            
            elif is_booked and count > expected_count:
                # Case 2: Facility booked for X people but more than X detected
                if alert:
                    alert.violation_count += 1
                    logger.info(f"Violation count increased to {alert.violation_count} for {sports_complex}")
                    
                    if alert.violation_count >= CONFIG['violation_threshold']:
                        message = f"OVERCAPACITY: {count} people detected at {sports_complex}, expected {expected_count}."
                        alert.message = message
                        logger.warning(message)
            
                        # Send email alert
                        if alert.violation_count == CONFIG['violation_threshold']:  # Only send on threshold crossing
                            send_alert_email(
                                "Facility Overcapacity Alert",
                                f"Overcapacity detected at {sports_complex}.\n\n"
                                f"Camera: {camera}\n"
                                f"People detected: {count}\n"
                                f"Expected count: {expected_count}\n"
                                f"Time: {datetime.now()}\n\n"
                                f"This facility is currently booked for {expected_count} people."
                            )
                            # Reset violation count to 1 after sending alert (not 0)
                            alert.violation_count = 1
                            logger.info(f"Alert sent and violation count reset to 1 for {sports_complex}")
                    alert.save()
                else:
                    # Create new alert with violation count 1
                    FacilityAlert.objects.create(
                        sports_complex=sports_complex,
                        camera=camera,
                        message=f"Potential overcapacity: {count} people detected, expected {expected_count}.",
                        violation_count=1
                    )
                    logger.info(f"Created new alert for overcapacity: {count} people at {sports_complex} (expected {expected_count})")
            
            # If no violation, reset any existing alerts
            elif alert:
                alert.violation_count = 0
                alert.save()
                logger.info(f"Reset violation count for {sports_complex}")
                
        except Exception as e:
            logger.error(f"Error logging count to database: {e}")
            # Fall through to JSON logging
    
    # Always log to JSON file as backup
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    data = {
        "timestamp": timestamp,
        "people_count": count,
        "is_booked": is_booked,
        "expected_count": expected_count,
        "facility_id": facility_id,
        "camera_id": camera_id
    }
    
    # Load existing data if file exists
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

    # Add the new data
    existing_data.append(data)
    
    # Keep only the last 30 minutes of data (assuming 10-minute intervals)
    existing_data = existing_data[-3:]  # Increased from 3 to 30 to keep more history
    
    # Write the filtered data to the JSON file
    with open(json_path, 'w') as f:
        json.dump(existing_data, f, indent=4)

def detect_single_camera(camera_url, camera, opt):
    """
    Run detection on a single camera with error handling.
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
    
    # Get names and colors
    names = model.module.names if hasattr(model, 'module') else model.names
    # colors = [[random.randint(0, 255) for _ in range(3)] for _ in _ in range(3)] for _ in range(len(names))]
    colors = [[random.randint(0, 255) for _ in range(3)] for _ in range(len(names))]
    # Run inference once to initialize
    if device.type != 'cpu':
        model(torch.zeros(1, 3, imgsz, imgsz).to(device).type_as(next(model.parameters())))
    
    # Initialize variables for logging
    t0 = time.time()
    last_log_time = datetime.now()
    log_interval = timedelta(minutes=CONFIG['log_interval_minutes'])
    
    logger.info(f"Starting detection for camera: {camera_url}")
    
    # Create a direct OpenCV capture for more control
    cap = cv2.VideoCapture(camera_url)
    if not cap.isOpened():
        logger.error(f"Failed to open camera: {camera_url}")
        return
    
    # Set buffer size to reduce frame dropping
    cap.set(cv2.CAP_PROP_BUFFERSIZE, 3)
    
    # Frame counter for saving images
    frame_count = 0
    
    try:
        while True:
            # Read frame
            ret, frame = cap.read()
            if not ret:
                logger.warning("Failed to read frame, attempting to reconnect...")
                time.sleep(2)
                cap.release()
                cap = cv2.VideoCapture(camera_url)
                if not cap.isOpened():
                    logger.error("Failed to reconnect to camera")
                    break
                continue
            
            frame_count += 1
            
            # Prepare image for YOLO
            try:
                # Use a larger image size for better detection of small objects
                img = letterbox(frame, imgsz, stride=stride)[0]
                img = img[:, :, ::-1].transpose(2, 0, 1)  # BGR to RGB
                img = np.ascontiguousarray(img)
                img = torch.from_numpy(img).to(device)
                img = img.half() if half else img.float()
                img /= 255.0
                if img.ndimension() == 3:
                    img = img.unsqueeze(0)
                
                # Inference
                t1 = time_synchronized()
                pred = model(img, augment=opt.augment)[0]
                
                # Apply NMS with lower confidence threshold to detect more people
                pred = non_max_suppression(
                    pred, 
                    conf_thres, 
                    iou_thres, 
                    classes=opt.classes, 
                    agnostic=opt.agnostic_nms
                )
                t2 = time_synchronized()
                
                # Process detections
                people_count = 0
                for i, det in enumerate(pred):
                    s = ''
                    im0 = frame.copy()
                    
                    if len(det):
                        # Rescale boxes from img_size to im0 size
                        det[:, :4] = scale_coords(img.shape[2:], det[:, :4], im0.shape).round()
                        
                        # Count people (class 0)
                        people_count = sum(1 for *_, cls in det if int(cls) == 0)
                        s += f"{people_count} person{'s' if people_count > 1 else ''}, "
                        
                        # Draw boxes with thicker lines and larger font for better visibility
                        for *xyxy, conf, cls in reversed(det):
                            if int(cls) == 0:  # Only process "person" class
                                label = f'{names[int(cls)]} {conf:.2f}'
                                plot_one_box(xyxy, im0, label=label, color=colors[int(cls)], line_thickness=3)
                    
                    # Print time (inference + NMS)
                    print(f"{i}: {im0.shape[0]}x{im0.shape[1]} {people_count} persons, Done. ({t2 - t1:.3f}s)")
                    logger.info(f"{i}: {im0.shape[0]}x{im0.shape[1]} {people_count} persons, Done. ({t2 - t1:.3f}s)")
                    
                    # Save detection image periodically for verification
                    if CONFIG['save_detection_images'] and frame_count % 30 == 0:  # Save every 30 frames
                        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                        save_path = os.path.join(CONFIG['detection_images_dir'], f"detection_{timestamp}_{people_count}persons.jpg")
                        cv2.imwrite(save_path, im0)
                        logger.info(f"Saved detection image to {save_path}")
                    
                    # Stream results
                    if opt.view_img:
                        window_name = f"Camera: {camera.sports_complex.name if camera and hasattr(camera, 'sports_complex') else 'Unknown'}"
                        cv2.imshow(window_name, im0)
                        if cv2.waitKey(1) & 0xFF == ord('q'):  # Press 'q' to exit
                            break
                
                # Check if it's time to log the count
                current_time = datetime.now()
                if current_time - last_log_time >= log_interval:
                    # Check booking status
                    is_booked, expected_count = check_booking_status(facility_id, current_time)
                    
                    # Log count and check for violations
                    log_count_to_json(
                        people_count, 
                        facility_id=facility_id, 
                        camera_id=camera_id,
                        is_booked=is_booked,
                        expected_count=expected_count
                    )
                    
                    last_log_time = current_time
                    logger.info(f"Logged count at {current_time}: {people_count} people detected")
                
            except Exception as e:
                logger.error(f"Error processing frame: {e}")
                continue
                
            # Add a small delay to reduce CPU usage
            time.sleep(0.01)
            
    except KeyboardInterrupt:
        logger.info("Detection stopped by user")
    except Exception as e:
        logger.error(f"Error in detection loop: {e}")
    finally:
        cap.release()
        cv2.destroyAllWindows()
        logger.info(f"Detection completed for camera: {camera_url} ({time.time() - t0:.3f}s)")

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
    
    threads = []
    for camera in cameras:
        if not camera.ip_url:
            logger.warning(f"Camera {camera.id} has no URL. Skipping.")
            continue
        
        logger.info(f"Starting thread for camera: {camera}")
        thread = threading.Thread(
            target=detect_single_camera,
            args=(camera.ip_url, camera, opt),
            name=f"Camera-{camera.id}"
        )
        thread.daemon = True
        thread.start()
        threads.append(thread)
    
    # Wait for all threads to complete
    for thread in threads:
        thread.join()

def detect(save_img=False):
    """
    Main detection function.
    """
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
            logger.info(f"Updated at: {alert.updated_at}")
            logger.info("---")
    
    except Exception as e:
        logger.error(f"Error checking alerts: {e}")

if _name_ == '_main_':
    parser = argparse.ArgumentParser()
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
    opt = parser.parse_args()
    logger.info(opt)

    # Check for .env file
    env_path = os.path.join(os.path.dirname(_file_), '..', '..', '..', '.env')
    if not os.path.exists(env_path):
        logger.info(f"{env_path} not found - if you're not configuring your environment separately, check this.")

    # Check alerts if requested
    if opt.check_alerts:
        check_alerts()
        sys.exit(0)

    with torch.no_grad():
        if opt.update:  # update all models (to fix SourceChangeWarning)
            for opt.weights in ['yolov7.pt']:
                detect()
                try:
                    from utils.general import strip_optimizer
                    strip_optimizer(opt.weights)
                except ImportError:
                    logger.warning("strip_optimizer not found, skipping model optimization")
        else:
            detect()