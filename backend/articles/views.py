from rest_framework import viewsets, status
from rest_framework.response import Response

from users.models import User

from .models import Article
from .permissions import ArticlePermission
from .serializers import ArticleSerializer, ArticleListSerializer


class ArticleViewSet(viewsets.ModelViewSet):
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

    def get_queryset(self):
        user_id = self.request.query_params.get('user', None)

        if user_id:
            try:
                user_id = int(user_id)
                if User.objects.filter(id=user_id).exists():
                    return Article.objects.filter(user__id=user_id)

            except ValueError:
                pass

        return Article.objects.all()
