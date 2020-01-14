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

        elif view.action in ('create', 'destroy'):
            return bool(
                IsAuthenticated.has_permission(None, request, view) and
                IsAdminUser.has_permission(None, request, view)
            )

    def has_object_permission(self, request, view, obj):
        if view.action == 'destroy':
            return True

