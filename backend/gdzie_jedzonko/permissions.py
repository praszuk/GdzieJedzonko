from rest_framework.permissions import BasePermission

from .models import Role


class IsAdminUser(BasePermission):
    """
    Allows access only to users with ADMIN role.
    """

    def has_permission(self, request, view):
        return bool(request.user and request.user.role == Role.ADMIN)
