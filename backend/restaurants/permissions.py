from rest_framework.permissions import BasePermission


class CityPermission(BasePermission):
    """
        Operations on cities.
    """
    def has_permission(self, request, view):
        if view.action == 'list':
            return True
