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
    BD= 'Badminton'
    TT= 'Table Tennis'
    SW= 'Swimming Pool'


    def choices(cls):
        return [(key.name, key.value) for key in cls]




class Sports_complex(models.Model):
    name=models.CharField(max_length=200,blank=True,null=True)
    facility=models.CharField(max_length=3, choices=FACILITY_class.choices(),blank=True,null=True)
    def __str__(self):
#        label= self.course_code + ' ' + self.course_name
        return name+ FACILTIY_class[self.facility].value
