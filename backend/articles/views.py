from rest_framework import viewsets

from .models import Article
from .permissions import ArticlePermission
from .serializers import ArticleSerializer, ArticleListSerializer


class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()
    permission_classes = [ArticlePermission]

    def get_serializer_class(self):
        if self.action == 'list':
            return ArticleListSerializer

        return ArticleSerializer
