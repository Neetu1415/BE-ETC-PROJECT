"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

"""
from django.contrib import admin
from django.urls import path,include

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/v1/auth/", include('djoser.urls')),
    path("api/v1/auth/", include('djoser.urls.jwt')),
    path('facility_booking/', include('facility_booking.urls')),

    path('camera/', include('camera.urls')),

]
"""
# backend/urls.py
from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView

urlpatterns = [
    # ← your admin site
    path('admin/', admin.site.urls),

    # ← djoser / JWT endpoints
    path('api/v1/auth/', include('djoser.urls')),
    path('api/v1/auth/', include('djoser.urls.jwt')),

    # ← your custom user endpoints (including the role‑protected dashboards)
    path('api/v1/users/', include('users.urls')),

    # ← your facility‑booking API
    path('api/v1/facility_booking/', include('facility_booking.urls')),

    # ← your camera/alerts API
    path('api/v1/camera/', include('camera.urls')),

    # …and *only after* all of the above, hand *everything else* to React
    #enre_path(r'^.*$', TemplateView.as_view(template_name="index.html")),
]
