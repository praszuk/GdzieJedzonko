from rest_framework.permissions import BasePermission

from users.permissions import (
    IsAuthenticated,
    IsAdminUser,
    IsModeratorUser,
    IsOwnerUser,
)


class IsOwnerArticle(BasePermission):
    """
        Allows access to the article object only for the owner of the article.
    """
    def has_object_permission(self, request, view, obj):
        return request.user == obj.user


class ArticlePermission(BasePermission):
    """
    All permissions for all Articles.
    """

    '''
        Workaround for using exists permissions instead of reimplementing. 
        None=self - context is incorrect but required to work
    '''
    # noinspection PyTypeChecker
    def has_permission(self, request, view):
        if view.action in ('list', 'retrieve'):
            return True

        elif view.action in ('create', 'destroy'):
            return IsAuthenticated.has_permission(None, request, view)

    def has_object_permission(self, request, view, obj):
        if view.action == 'retrieve':
            return True

        elif view.action == 'destroy':

            return bool(
                IsAdminUser.has_permission(None, request, view) or
                IsModeratorUser.has_permission(None, request, view) or
                IsOwnerArticle.has_object_permission(None, request, view, obj)
            )
