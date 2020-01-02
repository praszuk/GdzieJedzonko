from django.shortcuts import get_object_or_404
from rest_framework.permissions import BasePermission

from .models import Article


class CommentArticlePermission(BasePermission):
    """
        Operations on comments belonging to article.
    """

    # noinspection PyTypeChecker
    def has_permission(self, request, view):
        # DRF hasn't option for getting foreign key object for creation
        # So object_id need to be get from request param and get object by id
        article_id = request.resolver_match.kwargs.get('article_id')
        get_object_or_404(Article, pk=article_id)

        if view.action == 'list':
            return True
