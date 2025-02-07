# users/forms.py
from django import forms
from django.contrib.auth.forms import UserChangeForm, UserCreationForm
from sports_facility.models import Sports_complex
from .models import User

# Custom user creation form (for registration, etc.)
class CustomUserCreationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = User
        fields = ["email", "first_name", "last_name"]
        error_class = "error"


# Custom user change form (for editing users outside of admin)
class CustomUserChangeForm(UserChangeForm):
    class Meta(UserChangeForm.Meta):
        model = User
        fields = ["email", "first_name", "last_name"]
        error_class = "error"


# Custom admin form to control the stadium field widget
class UserAdminForm(forms.ModelForm):
    class Meta:
        model = User
        fields = '__all__'

    # Define the stadium field so we can override its queryset and display
    stadium = forms.ModelChoiceField(
        queryset=Sports_complex.objects.none(),
        required=False
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # Get all sports complexes ordered by the 'name' field.
        qs = Sports_complex.objects.all().order_by('name')

        # Build a list of IDs for the first occurrence of each unique complex name.
        unique_ids = []
        seen = set()
        for obj in qs:
            # Protect against None values.
            if obj.name and obj.name not in seen:
                unique_ids.append(obj.id)
                seen.add(obj.name)

        # Filter the queryset so that only one Sports_complex per unique name appears.
        unique_qs = Sports_complex.objects.filter(id__in=unique_ids)
        self.fields['stadium'].queryset = unique_qs

        # Override the label to display only the sports complex name.
        self.fields['stadium'].label_from_instance = lambda obj: obj.get_name_display() if obj.name else ""
