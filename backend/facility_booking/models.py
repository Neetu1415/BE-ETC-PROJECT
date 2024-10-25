from django.db import models
from django.contrib.auth import get_user_model 
from enum import Enum

# Create your models here.
from sports_facility.models import Sports_complex



class GROUP_class(Enum):
    GAID = 'Govt Aided Educational Institution'
    EDINST = 'Educational Institutions'
    AGSCF = 'Association/Govt/Sports events/Clubs/Federations'
    OVNR = 'Other village clubs which are not registered to SAG'
    PSEV = 'Private Sporting events/Tariff for others'
    HP = 'Hourly Pass'
    STUD = 'Students'
    NSTUD = 'Non Students'
    CA=' Recognized state Sports Association for conduct of Zonal Championship/Federation Cup/ National Championship/ International Championship or Government / Government aided primary/Secondary / Higher Secondary Schools for Sports Day '
    CB='SAG Registered Sports. Club/State Sports Association/ - League Clubs/ NGOs having annual turnover of less than 3 Lakhs/ Other Educational Institutions for the conduct of any other sporting event (excluding those covered in Cat (A) '
    CC='Sporting event by private party/ Organisations/ other NGOs (not covered in cat B) or Educational events/ Discours/ Lectures for/ by intuitions registered under societies Registrations'


class ChargeType(models.TextChoices):
    D = 'DAILY', 'Daily'
    M = 'MONTHLY', 'Monthly'
    HP= 'Hourly Pass'
    Q='Quarterly'
    Y='Annualy'
    OR='One Registration'
    MEM='Membership renewal'

    

class Charges(models.Model):
    spid=models.Foreignkey(Sports_complex, on_delete=models.CACSCADE)
    gp=models.CharField(max_length=5, on_delete=models.CACSCADE)
    typ=models.CharField(max_length=3, choices=ChargeType.choices)
    rates=models.DecimalField(max_digits=5, decimal_places=2)


class Booking(models.Model):
    userid=models.Foreignkey(get_user_model(), on_delete=models.CACSCADE) CharField(max_length=200,blank=True,null=True)
    spid=models.Foreignkey(Sports_complex, on_delete=models.CACSCADE)
    Datefield
    timefield

    CharField(max_length=200,blank=True,null=True)
    facility=models.CharField(max_length=3, choices=FACILITY_class.choices(),blank=True,null=True)
