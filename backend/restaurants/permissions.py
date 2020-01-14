from rest_framework.permissions import BasePermission

from users.permissions import IsAdminUser, IsAuthenticated


class CityPermission(BasePermission):
    """
        Operations on cities.
    """

    # noinspection PyTypeChecker
    def has_permission(self, request, view):
        if view.action == 'list':
            return True

        elif view.action == 'create':
            return bool(
                IsAuthenticated.has_permission(None, request, view) and
                IsAdminUser.has_permission(None, request, view)
            )

