from django.db import models

# Create your models here.
from django.contrib.auth import get_user_model
from sports_facility.models import Sports_complex , FACILITY_class
from enum import Enum


class GROUP_class(Enum):
    GAID = 'Govt Aided Educational Institution'
    EDINST = 'Educational Institutions'
    AGSCF = 'Association/Govt/Sports events/Clubs/Federations'
    OVNR = 'Other village clubs which are not registered to SAG'
    PSEV = 'Private Sporting events/Tariff for others'
    HP = 'Hourly Pass'
    STUD = 'Students'
    NSTUD = 'Non Students'
    CA = 'category A - Recognized state Sports Association for conduct of Zonal Championship/Federation Cup/ National Championship/ International Championship or Government / Government aided primary/Secondary / Higher Secondary Schools for Sports Day'
    CB = 'category B - SAG Registered Sports Club/State Sports Association - League Clubs/ NGOs having annual turnover of less than 3 Lakhs/ Other Educational Institutions for the conduct of any other sporting event (excluding those covered in Cat (A)'
    CC = 'category C - Sporting event by private party/Organisations/other NGOs (not covered in cat B) or Educational events/Discours/Lectures for/by institutions registered under societies Registrations'
    CD = 'category D - Commercial sporting/NonSporting Event/FilmShooting'
   

    @classmethod
    def choices(cls):
        return [(key.name, key.value) for key in cls]


class ChargeType(models.TextChoices):
    HD = 'HALF DAY', 
    FD = 'FULL DAY',
    M = 'MONTHLY', 
    HP = 'HOURLY PASS', 
    Q = 'QUARTERLY', 
    Y = 'ANNUALLY', 
    OR = 'ONE REGISTRATION', 
    MEM = 'MEMBERSHIP RENEWAL', 


class Charges(models.Model):
    sports_complex = models.ForeignKey(Sports_complex, on_delete=models.CASCADE)
    group = models.CharField(max_length=100, choices=GROUP_class.choices())  
    type = models.CharField(max_length=20, choices=ChargeType.choices)  
    rate = models.DecimalField(max_digits=10, decimal_places=2) 
    class Meta:
        verbose_name_plural = "Charges"
    


class Booking(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    sports_complex = models.ForeignKey(Sports_complex, on_delete=models.CASCADE) 
    booking_date = models.DateField()  
    booking_time = models.TimeField()  
    booking_end_time = models.TimeField(null=True, blank=True)
    charges= models.ForeignKey(Charges, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user.email} - {self.booking_date} {self.booking_time} to {self.booking_end_time}"


