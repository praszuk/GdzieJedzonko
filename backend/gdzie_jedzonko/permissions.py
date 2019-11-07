from rest_framework.permissions import BasePermission, IsAuthenticated

from .models import Role


class IsAdminUser(BasePermission):
    """
    Allows access only to users with ADMIN role.
    """

    def has_permission(self, request, view):
        return bool(request.user and request.user.role == Role.ADMIN)


class UserPermission(BasePermission):
    """
    All permission for all User actions.
    """
    def has_permission(self, request, view):

        if view.action == 'list':
            '''
            Workaround for using exists permissions class
            None=self - context is incorrect but required to work
            '''
            # noinspection PyTypeChecker
            return bool(
                IsAuthenticated.has_permission(None, request, view) and
                IsAdminUser.has_permission(None, request, view)
            )
