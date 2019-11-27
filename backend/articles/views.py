from rest_framework import viewsets, status
from rest_framework.response import Response


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

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)

        return Response(
            data={'id': serializer.data['id']},
            status=status.HTTP_201_CREATED,
            headers=headers,
        )
