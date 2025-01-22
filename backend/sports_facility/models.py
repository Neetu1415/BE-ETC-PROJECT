from django.db import models

# Create your models here.
from enum import Enum

class FACILITY_class(Enum):
    CT = 'cricket'
    OFCT = 'open field cricket'
    HT = 'hockey astro turf'
    A1 = 'atheletic track'
    A2 = 'atheletics'
    CN = 'conference hall and other rooms'
    S1 = 'Swimming Pool'
    S2 = 'learn to swim Classes'
    S3 = 'learn to swim and life saving'
    S4 = 'use of swimming pool only through booking'
    FT1 = 'football play field'
    FT2 = 'D.B Bandodkar Football Ground'
    GY = 'Gymnasium'
    GT = 'Gymnastics'
    IN = 'Indoor hall'
    BD = 'Badminton'
    INBD = 'indoor hall badminton'
    TT = 'Table Tennis'
    INTT = 'indoor hall table tennis'
    WT = 'weightlifting'
    INWT = 'indoor weight lifting'
    TK = 'Taekwondo'
    HB = 'handball'
    BB = 'basketball'
    CH = 'chess'
    JD = 'Judo'
    AC = 'archery'
    BX = 'boxing'
    RS = 'roller skating'
    OF = 'Open field(outdoor)'
    AA = 'all facilities'
    OO = 'open field outdoor'

    @classmethod
    def choices(cls):
        return [(key.name, key.value) for key in cls]



class Sports_complex(models.Model):
    uid=models.CharField(max_length=2,blank=True,null=True)
    name=models.CharField(max_length=200,blank=True,null=True)
    facility=models.CharField(max_length=8, choices=FACILITY_class.choices(),blank=True,null=True)
    def _str_(self):
#        label= self.course_code + ' ' + self.course_name
        return [self.uid] + FACILITY_class[self.facility].value
