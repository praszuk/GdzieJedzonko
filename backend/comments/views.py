from django.shortcuts import get_object_or_404
from rest_framework import status, viewsets
from rest_framework.response import Response

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

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['article_id'] = self.kwargs['article_id']

        return context

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        return Response(data=serializer.data, status=status.HTTP_201_CREATED)
