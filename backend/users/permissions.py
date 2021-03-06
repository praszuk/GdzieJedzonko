from rest_framework.permissions import BasePermission, IsAuthenticated

from .models import Role


class IsAdminUser(BasePermission):
    """
    Allows access only to users with ADMIN role.
    """

    def has_permission(self, request, view):
        return bool(request.user and request.user.role == Role.ADMIN)


class IsModeratorUser(BasePermission):
    """
    Allows access only to users with MODERATOR role.
    """

    def has_permission(self, request, view):
        return bool(request.user and request.user.role == Role.MODERATOR)


class IsOwnerUser(BasePermission):
    """
    Allows access to the user object only for the owner of the object.
    """
    def has_object_permission(self, request, view, obj):
        return request.user == obj


class UserPermission(BasePermission):
    """
    All permission for all User actions.
    """

    '''
    Workaround for using exists permissions instead of reimplementing. 
    None=self - context is incorrect but required to work
    '''
    # noinspection PyTypeChecker
    def has_permission(self, request, view):

        if view.action in ('retrieve', 'partial_update', 'destroy'):
            return IsAuthenticated.has_permission(None, request, view)

        elif view.action == 'list':
            return bool(
                IsAuthenticated.has_permission(None, request, view) and
                IsAdminUser.has_permission(None, request, view)
            )

        elif view.action == 'create':
            return True

    '''
    Workaround for using exists permissions instead of reimplementing. 
    None=self - context is incorrect but required to work
    '''
    # noinspection PyTypeChecker
    def has_object_permission(self, request, view, obj):

        if view.action == 'retrieve':
            return True

        elif view.action == 'destroy':
            return bool(
                IsOwnerUser.has_object_permission(None, request, view, obj) or
                IsAdminUser.has_permission(None, request, view)
            )

        elif view.action == 'partial_update':
            if 'role' in request.data:
                return bool(IsAdminUser.has_permission(None, request, view))

            return bool(
                IsOwnerUser.has_object_permission(None, request, view, obj) or
                IsAdminUser.has_permission(None, request, view)
            )
