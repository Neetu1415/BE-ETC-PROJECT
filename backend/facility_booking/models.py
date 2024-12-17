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
    CA = 'Recognized state Sports Association for conduct of Zonal Championship/Federation Cup/ National Championship/ International Championship or Government / Government aided primary/Secondary / Higher Secondary Schools for Sports Day'
    CB = 'SAG Registered Sports Club/State Sports Association - League Clubs/ NGOs having annual turnover of less than 3 Lakhs/ Other Educational Institutions for the conduct of any other sporting event (excluding those covered in Cat (A)'
    CC = 'Sporting event by private party/Organisations/other NGOs (not covered in cat B) or Educational events/Discours/Lectures for/by institutions registered under societies Registrations'

    @classmethod
    def choices(cls):
        return [(key.name, key.value) for key in cls]


class ChargeType(models.TextChoices):
    D = 'DAILY', 
    M = 'MONTHLY', 
    HP = 'HOURLY PASS', 
    Q = 'QUARTERLY', 
    Y = 'ANNUALLY', 
    OR = 'ONE REGISTRATION', 
    MEM = 'MEMBERSHIP RENEWAL', 


class Charges(models.Model):
    sports_complex = models.ForeignKey(Sports_complex, on_delete=models.CASCADE)
    group = models.CharField(max_length=100, choices=GROUP_class.choices())  # Adjusted max_length
    type = models.CharField(max_length=20, choices=ChargeType.choices)  # Adjusted max_length
    rate = models.DecimalField(max_digits=10, decimal_places=2)  # Adjusted field name for clarity


class Booking(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)  # Fixed typo in CASCADE
    sports_complex = models.ForeignKey(Sports_complex, on_delete=models.CASCADE)  # Fixed typo in CASCADE
    booking_date = models.DateField()  # Clarified field name
    booking_time = models.TimeField()  # Clarified field name
    additional_info = models.CharField(max_length=200, blank=True, null=True)  # Allow blank and null
    facility = models.CharField(max_length=100, choices=FACILITY_class.choices())  # Adjusted max_length

