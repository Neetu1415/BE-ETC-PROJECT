import csv 


from sports_facility.models import Sports_complex




f=open('../sports_facility.csv')

csvreader=csv.reader(f)
next(csvreader)
next(csvreader)






for line in csvreader:


    try:
        sp=Sports_complex.objects.get(uid=line[0],facility=line[3])
    except Sports_complex.DoesNotExist:
        sp=Sports_complex(uid=line[0],facility=line[3])
    if (line[0]=='5' and line[3]=='FT2'):
        print('found')
        input()
    sp.name=line[1]
    sp.save()

