from django.db import models
from django.utils.timezone import now
from django.apps import apps  # Lazy import to avoid circular import issues

# Model to track people detected by YOLO
class FacilityPeopleCount(models.Model):
    sports_complex = models.ForeignKey(
        'sports_facility.Sports_complex',
        on_delete=models.SET_NULL,  
        related_name="people_detections",
        null=True,  
        blank=True  
    )
    camera = models.ForeignKey(
        'sports_facility.Camera',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="people_counts"
    )
    detected_count = models.IntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        complex_name = self.sports_complex.name if self.sports_complex else "Unknown"
        return f"{complex_name} - {self.timestamp}: {self.detected_count} people"

    def check_violation(self):
        """Check for overcapacity or unauthorized entry and update/create alert."""
        if not self.sports_complex:
            return  # Skip if no sports complex

        FacilityAlert = apps.get_model('camera', 'FacilityAlert')  # Lazy import

        # Fetch the first matching alert or create a new one
        alert = FacilityAlert.objects.filter(
            sports_complex=self.sports_complex,
            camera=self.camera
        ).first()

        if alert:
            # Increment violation count and update timestamp
            alert.violation_count += 1
            alert.last_violation = now()
            alert.save()
        else:
            # Create a new alert if none exists
            FacilityAlert.objects.create(
                sports_complex=self.sports_complex,
                camera=self.camera,
                message=f"ALERT: {self.detected_count} people detected at {self.sports_complex}.",
                violation_count=1
            )

    class Meta:
        verbose_name = "Facility People Count"
        verbose_name_plural = "Facility People Counts"


# Model to track alerts and violations
class FacilityAlert(models.Model):
    sports_complex = models.ForeignKey(
        'sports_facility.Sports_complex',
        on_delete=models.SET_NULL,
        related_name="alerts",
        null=True,
        blank=True
    )
    camera = models.ForeignKey(
        'sports_facility.Camera',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="alerts"
    )
    message = models.TextField()
    violation_count = models.IntegerField(default=0)  # Track repeated violations
    last_violation = models.DateTimeField(auto_now=True)

    def __str__(self):
        complex_name = self.sports_complex.name if self.sports_complex else "Unknown"
        return f"Alert at {complex_name}: {self.message}"

    def increment_violation(self):
        """Increment violation count instead of creating duplicate alerts."""
        self.violation_count += 1
        self.last_violation = now()
        self.save()

    class Meta:
        verbose_name = "Facility Alert"
        verbose_name_plural = "Facility Alerts"



# from django.db import models
# from django.apps import apps  # Lazy import to avoid circular import issues

# class FacilityPeopleCount(models.Model):
#     sports_complex = models.ForeignKey(
#         'sports_facility.Sports_complex',
#         on_delete=models.SET_NULL,  # Prevent deletion issues
#         related_name="people_detections",
#         null=True,  
#         blank=True  
#     )
#     camera = models.ForeignKey(
#         'sports_facility.Camera',
#         on_delete=models.SET_NULL,
#         null=True,
#         blank=True,
#         related_name="people_counts"
#     )
#     detected_count = models.IntegerField()
#     timestamp = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         complex_name = self.sports_complex.name if self.sports_complex else "Unknown"
#         return f"{complex_name} - {self.timestamp}: {self.detected_count} people"

#     def check_violation(self):
#         """Checks for overcapacity or unauthorized entry and creates an alert."""
#         if not self.sports_complex:
#             return  # Skip if no sports complex
            
#         FacilityAlert = apps.get_model('camera', 'FacilityAlert')  # Lazy import
#         FacilityAlert.objects.create(
#             sports_complex=self.sports_complex,
#             camera=self.camera,
#             message=f"ALERT: {self.detected_count} people detected at {self.sports_complex}."
#         )

#     class Meta:
#         verbose_name = "Facility People Count"
#         verbose_name_plural = "Facility People Counts"

# class FacilityAlert(models.Model):
#     sports_complex = models.ForeignKey(
#         'sports_facility.Sports_complex',
#         on_delete=models.SET_NULL,  # Prevent deletion errors
#         related_name="alerts",
#         null=True,  
#         blank=True  
#     )
#     camera = models.ForeignKey(
#         'sports_facility.Camera',
#         on_delete=models.SET_NULL,
#         null=True,
#         blank=True,
#         related_name="alerts"
#     )
#     message = models.TextField()
#     violation_count = models.IntegerField(default=0)
#     last_violation = models.DateTimeField(auto_now=True)

#     def __str__(self):
#         complex_name = self.sports_complex.name if self.sports_complex else "Unknown"
#         return f"Alert at {complex_name}: {self.message}"

#     def update_violation(self, message=None):
#         self.violation_count += 1
#         if message:
#             self.message = message
#         self.save()

#     class Meta:
#         verbose_name = "Facility Alert"
#         verbose_name_plural = "Facility Alerts"









