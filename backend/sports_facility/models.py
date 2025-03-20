from django.db import models
from enum import Enum

# Keep the original FACILITY_class for backward compatibility
class FACILITY_class(Enum):
    CT = 'Cricket'
    OFCT = 'Open Field Cricket'
    HT = 'Hockey Astro Turf'
    A1 = 'Athletic Track'
    A2 = 'Athletics'
    CN = 'Conference Hall and Other Rooms'
    S1 = 'Swimming Pool'
    S2 = 'Learn to Swim Classes'
    S3 = 'Learn to Swim and Life Saving'
    S4 = 'Use of Swimming Pool Only Through Booking'
    FT1 = 'Football Play Field'
    FT2 = 'D.B Bandodkar Football Ground'
    GY = 'Gymnasium'
    GT = 'Gymnastics'
    IN = 'Indoor Hall'
    BD = 'Badminton'
    INBD = 'Indoor Hall Badminton'
    TT = 'Table Tennis'
    INTT = 'Indoor Hall Table Tennis'
    WT = 'Weightlifting'
    INWT = 'Indoor Weight Lifting'
    TK = 'Taekwondo'
    HB = 'Handball'
    BB = 'Basketball'
    CH = 'Chess'
    JD = 'Judo'
    AC = 'Archery'
    BX = 'Boxing'
    RS = 'Roller Skating'
    OF = 'Open Field (Outdoor)'
    AA = 'All Facilities'
    OO = 'Open Field Outdoor'

    @classmethod
    def choices(cls):
        return [(key.name, key.value) for key in cls]

# Keep the original COMPLEX_class for backward compatibility
class COMPLEX_class(Enum):
    P = 'Pedem Sports Complex'
    A = 'Athletic Stadium Bambolim'
    MP = 'Multipurpose Indoor Stadium (Pedem)'
    SP = 'Dr. Shyama Prasad Mukherjee Indoor Stadium'
    MC = 'Multipurpose Indoor Campal'
    MN = 'Manohar Parrikar Indoor Stadium Navelim'
    MF = 'Multipurpose Hall Fatorda'
    IP = 'Indoor Hall Ponda / Sports Complex Ponda'
    SF = 'Swimming Pool Fatorda'
    AG = 'Assolna Ground'
    TM = 'Tilak Maidan'
    AC = 'Agonda Sports Complex'
    BG = 'Benaulim Ground'
    UG = 'Utorda Ground'
    FM = 'Fatorda Multipurpose Indoor Stadium'
    PF = 'PJN Stadium Fatorda'
    FC = 'Fatorda Open Sports Complex'

    @classmethod
    def choices(cls):
        return [(key.name, key.value) for key in cls]

class Sports_complex(models.Model):
    uid = models.CharField(max_length=10, unique=True, blank=True, null=True)
    name = models.CharField(max_length=50, choices=COMPLEX_class.choices(), blank=True, null=True)
    facility = models.CharField(max_length=50, choices=FACILITY_class.choices(), blank=True, null=True)

    def __str__(self):
        """Display UID with facility name in human-readable format."""
        try:
            facility_name = FACILITY_class[self.facility].value if self.facility else "Unknown Facility"
        except KeyError:
            facility_name = self.facility or "Unknown Facility"
        return f"{self.uid} - {facility_name}"

    class Meta:
        verbose_name_plural = "Sports Complexes"

# Add the Camera model for storing camera IP URLs
class Camera(models.Model):
    sports_complex = models.ForeignKey(
        Sports_complex, on_delete=models.CASCADE, related_name="cameras"
    )
    ip_url = models.CharField(max_length=255, null=True, blank=True)
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Camera at {self.sports_complex} - {self.ip_url}"
# from django.db import models
# from enum import Enum

# # Keep the original FACILITY_class for backward compatibility
# class FACILITY_class(Enum):
#     CT = 'Cricket'
#     OFCT = 'Open Field Cricket'
#     HT = 'Hockey Astro Turf'
#     A1 = 'Athletic Track'
#     A2 = 'Athletics'
#     CN = 'Conference Hall and Other Rooms'
#     S1 = 'Swimming Pool'
#     S2 = 'Learn to Swim Classes'
#     S3 = 'Learn to Swim and Life Saving'
#     S4 = 'Use of Swimming Pool Only Through Booking'
#     FT1 = 'Football Play Field'
#     FT2 = 'D.B Bandodkar Football Ground'
#     GY = 'Gymnasium'
#     GT = 'Gymnastics'
#     IN = 'Indoor Hall'
#     BD = 'Badminton'
#     INBD = 'Indoor Hall Badminton'
#     TT = 'Table Tennis'
#     INTT = 'Indoor Hall Table Tennis'
#     WT = 'Weightlifting'
#     INWT = 'Indoor Weight Lifting'
#     TK = 'Taekwondo'
#     HB = 'Handball'
#     BB = 'Basketball'
#     CH = 'Chess'
#     JD = 'Judo'
#     AC = 'Archery'
#     BX = 'Boxing'
#     RS = 'Roller Skating'
#     OF = 'Open Field (Outdoor)'
#     AA = 'All Facilities'
#     OO = 'Open Field Outdoor'

#     @classmethod
#     def choices(cls):
#         return [(key.name, key.value) for key in cls]

# # Keep the original COMPLEX_class for backward compatibility
# class COMPLEX_class(Enum):
#     P = 'Pedem Sports Complex'
#     A = 'Athletic Stadium Bambolim'
#     MP = 'Multipurpose Indoor Stadium (Pedem)'
#     SP = 'Dr. Shyama Prasad Mukherjee Indoor Stadium'
#     MC = 'Multipurpose Indoor Campal'
#     MN = 'Manohar Parrikar Indoor Stadium Navelim'
#     MF = 'Multipurpose Hall Fatorda'
#     IP = 'Indoor Hall Ponda / Sports Complex Ponda'
#     SF = 'Swimming Pool Fatorda'
#     AG = 'Assolna Ground'
#     TM = 'Tilak Maidan'
#     AC = 'Agonda Sports Complex'
#     BG = 'Benaulim Ground'
#     UG = 'Utorda Ground'
#     FM = 'Fatorda Multipurpose Indoor Stadium'
#     PF = 'PJN Stadium Fatorda'
#     FC = 'Fatorda Open Sports Complex'

#     @classmethod
#     def choices(cls):
#         return [(key.name, key.value) for key in cls]

# class Sports_complex(models.Model):
#     uid = models.CharField(max_length=10, unique=True, blank=True, null=True)
#     name = models.CharField(max_length=50, choices=COMPLEX_class.choices(), blank=True, null=True)
#     facility = models.CharField(max_length=50, choices=FACILITY_class.choices(), blank=True, null=True)

#     def __str__(self):
#         """Display UID with facility name in human-readable format."""
#         try:
#             facility_name = FACILITY_class[self.facility].value if self.facility else "Unknown Facility"
#         except KeyError:
#             facility_name = self.facility or "Unknown Facility"
#         return f"{self.uid} - {facility_name}"

#     class Meta:
#         verbose_name_plural = "Sports Complexes"

# # Add the Camera model for storing camera IP URLs
# class Camera(models.Model):
#     sports_complex = models.ForeignKey(
#         Sports_complex, on_delete=models.CASCADE, related_name="cameras"
#     )
#     ip_url = models.CharField(max_length=255, null=True, blank=True)
#     description = models.TextField(blank=True, null=True)
#     is_active = models.BooleanField(default=True)
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

#     def __str__(self):
#         return f"Camera at {self.sports_complex} - {self.ip_url}"
















# from django.db import models
# from enum import Enum

# class FACILITY_class(Enum):
#     CT = 'Cricket'
#     OFCT = 'Open Field Cricket'
#     HT = 'Hockey Astro Turf'
#     A1 = 'Athletic Track'
#     A2 = 'Athletics'
#     CN = 'Conference Hall and Other Rooms'
#     S1 = 'Swimming Pool'
#     S2 = 'Learn to Swim Classes'
#     S3 = 'Learn to Swim and Life Saving'
#     S4 = 'Use of Swimming Pool Only Through Booking'
#     FT1 = 'Football Play Field'
#     FT2 = 'D.B Bandodkar Football Ground'
#     GY = 'Gymnasium'
#     GT = 'Gymnastics'
#     IN = 'Indoor Hall'
#     BD = 'Badminton'
#     INBD = 'Indoor Hall Badminton'
#     TT = 'Table Tennis'
#     INTT = 'Indoor Hall Table Tennis'
#     WT = 'Weightlifting'
#     INWT = 'Indoor Weight Lifting'
#     TK = 'Taekwondo'
#     HB = 'Handball'
#     BB = 'Basketball'
#     CH = 'Chess'
#     JD = 'Judo'
#     AC = 'Archery'
#     BX = 'Boxing'
#     RS = 'Roller Skating'
#     OF = 'Open Field (Outdoor)'
#     AA = 'All Facilities'
#     OO = 'Open Field Outdoor'

#     @classmethod
#     def choices(cls):
#         return [(key.name, key.value) for key in cls]

# class COMPLEX_class(Enum):
#     P = 'Pedem Sports Complex'
#     A = 'Athletic Stadium Bambolim'
#     MP = 'Multipurpose Indoor Stadium (Pedem)'
#     SP = 'Dr. Shyama Prasad Mukherjee Indoor Stadium'
#     MC = 'Multipurpose Indoor Campal'
#     MN = 'Manohar Parrikar Indoor Stadium Navelim'
#     MF = 'Multipurpose Hall Fatorda'
#     IP = 'Indoor Hall Ponda / Sports Complex Ponda'
#     SF = 'Swimming Pool Fatorda'
#     AG = 'Assolna Ground'
#     TM = 'Tilak Maidan'
#     AC = 'Agonda Sports Complex'
#     BG = 'Benaulim Ground'
#     UG = 'Utorda Ground'
#     FM = 'Fatorda Multipurpose Indoor Stadium'
#     PF = 'PJN Stadium Fatorda'
#     FC = 'Fatorda Open Sports Complex'

#     @classmethod
#     def choices(cls):
#         return [(key.name, key.value) for key in cls]

# class Sports_complex(models.Model):
#     uid = models.CharField(max_length=2, blank=True, null=True)
#     name = models.CharField(max_length=50, choices=COMPLEX_class.choices(), blank=True, null=True)
#     facility = models.CharField(max_length=50, choices=FACILITY_class.choices(), blank=True, null=True)

#     def __str__(self):
#         """Display UID with facility name in human-readable format."""
#         facility_name = FACILITY_class[self.facility].value if self.facility else "Unknown Facility"
#         return f"{self.uid} - {facility_name}"

#     class Meta:
#         verbose_name_plural = "Sports Complexes"













