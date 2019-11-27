from rest_framework.permissions import BasePermission


class ArticlePermission(BasePermission):
    """
    All permissions for all Articles.
    """

    def has_permission(self, request, view):
        if view.action == 'retrieve':
            return True

    def has_object_permission(self, request, view, obj):
        if view.action == 'retrieve':
            return True
