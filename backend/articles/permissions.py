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

        if view.action == 'create':
            return IsAuthenticated.has_permission(None, request, view)

    def has_object_permission(self, request, view, obj):
        if view.action == 'retrieve':
            return True
