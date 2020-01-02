from django.shortcuts import get_object_or_404
from rest_framework import viewsets

from articles.models import Article

from .models import Comment
from .serializers import CommentSerializer
from .permissions import CommentArticlePermission


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.order_by('-creation_date')
    serializer_class = CommentSerializer
    permission_classes = (CommentArticlePermission, )

    def get_queryset(self):
        art = get_object_or_404(Article, id=self.kwargs['article_id'])

        return Comment.objects.filter(article=art).order_by('-creation_date')
