from rest_framework.permissions import BasePermission

from users.permissions import IsAdminUser, IsModeratorUser, IsAuthenticated
from .models import Restaurant


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


class RestaurantPermission(BasePermission):
    # noinspection PyTypeChecker
    def has_permission(self, request, view):
        if view.action in ('list', 'retrieve'):
            return True

        elif view.action in ('destroy', 'create', 'partial_update'):
            return IsAuthenticated.has_permission(None, request, view)

    # noinspection PyTypeChecker
    def has_object_permission(self, request, view, obj: Restaurant):
        if view.action == 'retrieve':
            if obj.is_approved:
                return True
            else:
                return bool(
                    IsAuthenticated.has_permission(None, request, view) and
                    bool(
                        IsModeratorUser.has_permission(None, request, view) or
                        IsAdminUser.has_permission(None, request, view)
                    )
                )
        elif view.action in ('destroy', 'partial_update'):
            return bool(
                IsModeratorUser.has_permission(None, request, view) or
                IsAdminUser.has_permission(None, request, view)
            )


class RestaurantPendingPermission(BasePermission):
    """
        Handle with not approved restaurants list.
    """
    # noinspection PyTypeChecker
    def has_permission(self, request, view):
        if view.action == 'list':
            return bool(
                IsAuthenticated.has_permission(None, request, view) and
                bool(
                    IsModeratorUser.has_permission(None, request, view) or
                    IsAdminUser.has_permission(None, request, view)
                )
            )
