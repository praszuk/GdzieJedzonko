from rest_framework import viewsets, status
from rest_framework.response import Response

from django.shortcuts import get_object_or_404

from users.models import User

from .models import Article, Photo
from .permissions import ArticlePermission, ImageArticlePermission
from .serializers import (
    ArticleSerializer,
    ArticleListSerializer,
    PhotoSerializer,
    ThumbnailSerializer
)


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


class ImageViewSet(viewsets.ModelViewSet):
    queryset = Photo.objects.all()
    permission_classes = [ImageArticlePermission]

    def create(self, request, *args, **kwargs):
        article = get_object_or_404(Article, pk=self.kwargs.get('article_id'))

        if 'photo' in request.data:
            data = {
                'image': request.data.get('photo'),
                'article': article.id
            }
            serializer = PhotoSerializer(data=data)

        elif 'thumbnail' in request.data:
            data = {
                'image': request.data.get('thumbnail'),
                'article': article.id
            }

            # Default action for post thumbnail is replacing by removing old
            if article.thumbnail:
                article.thumbnail.delete()

            serializer = ThumbnailSerializer(data=data)

        else:
            return Response(
                data={
                    'Not found image/thumbnail param in multipart/form-data'
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        return Response(
            data={'id': serializer.data['id']},
            status=status.HTTP_201_CREATED
        )
