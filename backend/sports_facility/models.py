from django.db import models

# Create your models here.


from django.db import models

# Create your models here.
# This odel will contain all the schemes and result related information
from django.utils import timezone
from datetime import datetime
from enum import Enum
# Create your models here.

class FACILTIY_class(Enum):
    CT='cricket'
    HT='hockey astro turf'
    A1='atheletic track'
    A2='atheletics'
    CH='conference hall and other rooms'
    S1= 'Swimming Pool'
    S2='learn to swim Classes'
    S3='learn to swim and life saving'
    s4='use of swimming pool only through booking'
    FT1='football play field'
    FT2='D.B Bandodkar Football Ground'
    GY='Gymnasium'
    GT='Gymnastics'
    IN='Indoor hall'
    BD= 'Badminton'
    TT= 'Table Tennis'
    WT='weightlifting'
    OF="open field"
    TK='Taekwondo'
    HB='handball'
    BB='basketball'
    CH='chess'
    JD='Judo'
    AC='archery'
    BX='boxing'
    RS='roller skating'
    OF='Open field(outdoor)'
    



    
    


    def choices(cls):
        return [(key.name, key.value) for key in cls]




class Sports_complex(models.Model):
    name=models.CharField(max_length=200,blank=True,null=True)
    facility=models.CharField(max_length=3, choices=FACILITY_class.choices(),blank=True,null=True)
    def _str_(self):
#        label= self.course_code + ' ' + self.course_name
        return name+ FACILTIY_class[self.facility].value
