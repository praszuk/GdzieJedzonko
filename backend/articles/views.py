from rest_framework import viewsets

from .models import Article
from .permissions import ArticlePermission
from .serializers import ArticleSerializer


class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [ArticlePermission]
