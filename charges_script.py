import csv
from facility_booking.models import Charges
from sports_facility.models import Sports_complex



f1=open('../charges.csv')
csvreader=csv.reader(f1)
next(csvreader)
next(csvreader)
for line in csvreader:
    try:
        sp=Sports_complex.objects.get(uid=line[0],facility=line[1])
        try:
            cg=Charges.objects.get(sports_complex=sp,group=line[2],type=line[3])
        except Charges.DoesNotExist:
            
            cg=Charges(sports_complex=sp,group=line[2],type=line[3])
        print('saved', cg.sports_complex)
        cg.rate=line[4]
        cg.save()
    except Sports_complex.DoesNotExist:
        print(line)
                       
        print("sports complex does not exist")
        input()
        
                