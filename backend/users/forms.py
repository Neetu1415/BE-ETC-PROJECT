# users/forms.py
from django import forms
from django.contrib.auth.forms import UserChangeForm, UserCreationForm
from sports_facility.models import Sports_complex, COMPLEX_class
from .models import User

# Custom admin form that includes our stadium field filtering logic
class UserAdminForm(forms.ModelForm):
    class Meta:
        model = User
        fields = '__all__'

    stadium = forms.ModelChoiceField(
        queryset=Sports_complex.objects.none(),  # Initially empty queryset
        required=False
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # Step 1: Get all Sports Complex records
        all_sports_complexes = Sports_complex.objects.all().order_by('uid')

        # Step 2: Remove duplicates based on `uid`
        unique_complexes = []
        seen_uids = set()

        for complex in all_sports_complexes:
            if complex.uid and complex.uid not in seen_uids:
                unique_complexes.append(complex.id)  # Store unique complex ID
                seen_uids.add(complex.uid)  # Mark UID as seen

        # Step 3: Get only the unique sports complexes
        unique_queryset = Sports_complex.objects.filter(id__in=unique_complexes)

        # Step 4: Set the filtered queryset to remove duplicates
        self.fields['stadium'].queryset = unique_queryset

        # Step 5: Customize how stadium names appear in the dropdown
        self.fields['stadium'].label_from_instance = lambda obj: (
            COMPLEX_class[obj.name].value if obj.name in COMPLEX_class.__members__ else obj.name
        )



# Custom user creation form that now inherits the custom filtering logic
class CustomUserCreationForm(UserAdminForm, UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = User
        fields = ["email", "first_name", "last_name", "password1", "password2", "role", "stadium"]
        error_class = "error"

# Custom user change form (unchanged)
class CustomUserChangeForm(UserChangeForm):
    class Meta(UserChangeForm.Meta):
        model = User
        fields = ["email", "first_name", "last_name"]
        error_class = "error"
