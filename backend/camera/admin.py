from django.contrib import admin
from .models import FacilityAlert, FacilityPeopleCount

@admin.register(FacilityPeopleCount)
class FacilityPeopleCountAdmin(admin.ModelAdmin):
    list_display = ('sports_complex', 'camera', 'detected_count', 'timestamp')
    list_filter = ('sports_complex', 'camera', 'timestamp')
    search_fields = ('sports_complex__name', 'camera__id')

@admin.register(FacilityAlert)
class FacilityAlertAdmin(admin.ModelAdmin):
    list_display = ('sports_complex', 'camera', 'message', 'violation_count', 'last_violation')
    ordering = ('-last_violation',)
    search_fields = ('sports_complex__name', 'camera__id', 'message')
    list_filter = ('last_violation', 'violation_count')


# from django.contrib import admin
# from .models import FacilityPeopleCount, FacilityAlert

# @admin.register(FacilityPeopleCount)
# class FacilityPeopleCountAdmin(admin.ModelAdmin):
#     list_display = ('sports_complex', 'camera', 'detected_count', 'timestamp')
#     list_filter = ('sports_complex', 'timestamp')
#     search_fields = ('sports_complex__name', 'camera__ip_url')

# @admin.register(FacilityAlert)
# class FacilityAlertAdmin(admin.ModelAdmin):
#     list_display = ('sports_complex', 'camera', 'message', 'violation_count', 'last_violation')
#     list_filter = ('sports_complex', 'last_violation')
#     search_fields = ('sports_complex__name', 'camera__ip_url', 'message')






























