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

# from django.contrib import admin
# from .models import Sports_complex, Camera

# class CameraInline(admin.TabularInline):
#     model = Camera
#     extra = 1  # Allows adding multiple camera entries

# class SportsComplexAdmin(admin.ModelAdmin):
#     list_display = ('uid', 'name', 'facility', 'camera_count')
#     list_filter = ('name', 'facility')
#     search_fields = ('uid', 'name', 'facility')
#     inlines = [CameraInline]
    
#     def camera_count(self, obj):
#         return obj.cameras.count()
#     camera_count.short_description = 'Number of Cameras'

# admin.site.register(Sports_complex, SportsComplexAdmin)
# admin.site.register(Camera)
















# //////////////////////////

# from django.contrib import admin
# from .models import Sports_complex, COMPLEX_class, FACILITY_class

# class SportsComplexAdmin(admin.ModelAdmin):
#     list_display = ('uid', 'name', 'facility_display')  # Display facility in admin panel
#     list_filter = ('name', 'facility')  # Filters for easier searching
#     search_fields = ('uid', 'name', 'facility')  # Search by UID, name, and facility
#     ordering = ('uid',)

#     def facility_display(self, obj):
#         """Display the full descriptive name of the facility."""
#         return FACILITY_class[obj.facility].value if obj.facility else "Unknown"

#     facility_display.short_description = 'Facility'

# # Registering the model with the custom admin configuration
# admin.site.register(Sports_complex, SportsComplexAdmin)
















