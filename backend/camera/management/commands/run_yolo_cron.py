from django.core.management.base import BaseCommand
import subprocess
import os
from datetime import datetime
from camera.People_Counter_Yolov7_master.People_Counter_Yolov7_master.detect import run_detect
class Command(BaseCommand):
    help = "Run YOLO detection via shell script (conda safe)"

    def handle(self, *args, **kwargs):
        log_file = "/home/gec/BE-ETC-PROJECT/backend/cron_output.log"

        with open(log_file, "a") as log:
            log.write(f"\n[{datetime.now()}] Cron job started.\n")

        # Absolute path to the shell script
        shell_script = "/home/gec/BE-ETC-PROJECT/run_detect.sh"

        try:
            subprocess.run(shell_script, shell=True, check=True, executable='/bin/bash')

            with open(log_file, "a") as log:
                log.write(f"[{datetime.now()}]  Detection completed successfully.\n")
        except subprocess.CalledProcessError as e:
            with open(log_file, "a") as log:
                log.write(f"[{datetime.now()}]  Detection failed: {e}\n")



def run_yolo():
    help = "Run YOLO detection via shell script (conda safe)"

    log_file = "/home/gec/BE-ETC-PROJECT/backend/cron_output.log"

    with open(log_file, "a") as log:
        log.write(f"\n[{datetime.now()}] Cron job started.\n")
    run_detect()