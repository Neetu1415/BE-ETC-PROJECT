# users/permissions.py
from rest_framework import permissions

class IsOverallAdmin(permissions.BasePermission):
    """
    Allows access only to overall admin users.
    """
    def has_permission(self, request, view):
        return (
            request.user and
            request.user.is_authenticated and
            getattr(request.user, 'role', None) == 'overall_admin'
        )


class IsStadiumAdmin(permissions.BasePermission):
    """
    Allows access only to stadium admin users.
    """
    def has_permission(self, request, view):
        return (
            request.user and
            request.user.is_authenticated and
            getattr(request.user, 'role', None) == 'stadium_admin'
        )
