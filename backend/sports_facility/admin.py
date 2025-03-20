from django.contrib import admin
from .models import Sports_complex, Camera

class CameraInline(admin.TabularInline):
    model = Camera
    extra = 1  # Allows adding multiple camera entries

class SportsComplexAdmin(admin.ModelAdmin):
    list_display = ('uid', 'name', 'facility', 'camera_count')
    list_filter = ('name', 'facility')
    search_fields = ('uid', 'name', 'facility')
    inlines = [CameraInline]
    
    def camera_count(self, obj):
        return obj.cameras.count()
    camera_count.short_description = 'Number of Cameras'

admin.site.register(Sports_complex, SportsComplexAdmin)
admin.site.register(Camera)














