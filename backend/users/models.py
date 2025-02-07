# users/models.py
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils.translation import gettext_lazy as _
from .managers import CustomUserManager
from sports_facility.models import Sports_complex  # adjust import as needed

class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (
        ('customer', 'Customer'),
        ('stadium_admin', 'Stadium Admin'),
        ('overall_admin', 'Overall Admin'),
    )
    
    first_name = models.CharField(_("First Name"), max_length=50)
    last_name = models.CharField(_("Last Name"), max_length=50)
    email = models.EmailField(_("Email Address"), max_length=200, unique=True)
    
    # Set default role to 'customer'
    role = models.CharField(_("Role"), max_length=20, choices=ROLE_CHOICES, default='customer')
    
    # Only applicable for stadium admins (optional)
    stadium = models.ForeignKey(Sports_complex, on_delete=models.SET_NULL, null=True, blank=True)
    
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"]

    objects = CustomUserManager()

    class Meta:
        verbose_name = _("User")
        verbose_name_plural = _("Users")

    def __str__(self):
        return self.email

    @property
    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"
