from rest_framework.permissions import BasePermission

from users.permissions import (
    IsAuthenticated,
    IsAdminUser,
    IsModeratorUser,
    IsOwnerUser,
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


class ImageArticlePermission(BasePermission):
    """
        All permissions for Images/Thumbnails in articles.
    """

    # noinspection PyTypeChecker
    def has_permission(self, request, view):
        # DRF hasn't option for getting foreign key object for creation
        # So object_id need to be get from request param and get object by id
        article_id = request.resolver_match.kwargs.get('article_id')
        article = Article.objects.get(pk=article_id)

        if view.action in ('create', ):
            if IsAuthenticated.has_permission(None, request, view):
                # Next hacky solution changing view.action to use
                # existing permissions instead of creating almost the same
                # TODO change to "update" when article-update will be done
                view.action = 'destroy'

                return ArticlePermission.has_object_permission(
                    None,
                    request,
                    view,
                    article
                )
            return False

    def has_object_permission(self, request, view, obj):
        if view.action == 'create':
            return True
