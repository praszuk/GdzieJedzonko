from rest_framework.permissions import BasePermission
from rest_framework.exceptions import NotAuthenticated

from django.shortcuts import get_object_or_404

from users.permissions import (
    IsAuthenticated,
    IsAdminUser,
    IsModeratorUser,
)
from .models import Article


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

        elif view.action in ('create', 'destroy', 'partial_update'):
            return IsAuthenticated.has_permission(None, request, view)

    def has_object_permission(self, request, view, obj):
        if view.action == 'retrieve':
            return True

        elif view.action in ('destroy', 'partial_update'):

            return bool(
                IsAdminUser.has_permission(None, request, view) or
                IsModeratorUser.has_permission(None, request, view) or
                IsOwnerArticle.has_object_permission(None, request, view, obj)
            )


class ImageArticlePermission(BasePermission):
    """
        All permissions for Photos/Thumbnail in articles.
    """

    # noinspection PyTypeChecker
    def has_permission(self, request, view):
        # DRF hasn't option for getting foreign key object for creation
        # So object_id need to be get from request param and get object by id
        article_id = request.resolver_match.kwargs.get('article_id')
        article = get_object_or_404(Article, pk=article_id)

        if view.action in ('create', 'destroy'):
            if IsAuthenticated.has_permission(None, request, view):
                # Next hacky solution changing view.action to use
                # existing permissions instead of creating almost the same
                view.action = 'partial_update'

                return ArticlePermission.has_object_permission(
                    None,
                    request,
                    view,
                    article
                )
            else:
                raise NotAuthenticated()

        return False

    def has_object_permission(self, request, view, obj):
        if view.action in ('create', 'destroy'):
            return True
