from django.contrib import admin

# Register your models here.

from .models import Sports_complex
from .models import COMPLEX_class, FACILITY_class

class SportsComplexAdmin(admin.ModelAdmin):
    list_display = ('uid', 'name', 'facility_display')
    list_filter = ('name', 'facility')
    search_fields = ('uid', 'name', 'facility')
    ordering = ('uid',)

    def facility_display(self, obj):
        # Display the full descriptive name of the facility
        return FACILITY_class[obj.facility].value if obj.facility else "Unknown"
    facility_display.short_description = 'Facility'

# Registering the model with custom admin configuration
admin.site.register(Sports_complex, SportsComplexAdmin)
