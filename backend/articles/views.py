from rest_framework import viewsets, status
from rest_framework.response import Response

from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import get_object_or_404

from django_filters.rest_framework import (
    CharFilter,
    DjangoFilterBackend,
    FilterSet,
    NumberFilter
)

from .models import Article, Photo, Thumbnail
from .permissions import ArticlePermission, ImageArticlePermission
from .serializers import (
    ArticleSerializer,
    ArticleListSerializer,
    PhotoSerializer,
    ThumbnailSerializer
)


class ArticleFilter(FilterSet):
    user = NumberFilter(field_name='user')
    title = CharFilter(field_name='title', lookup_expr='contains')
    first_name = CharFilter(
        field_name='user__first_name',
        lookup_expr='startswith'
    )
    last_name = CharFilter(
        field_name='user__last_name',
        lookup_expr='startswith'
    )

    class Meta:
        model = Article
        fields = []


class ArticleViewSet(viewsets.ModelViewSet):
    permission_classes = [ArticlePermission]
    filter_class = ArticleFilter
    filter_backends = [DjangoFilterBackend]

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

    def filter_queryset(self, queryset):
        queryset = super(ArticleViewSet, self).filter_queryset(queryset)
        return queryset.order_by('-creation_date')

    def get_queryset(self):
        if self.action == 'list':
            return Article.objects.filter(restaurant__is_approved=True)
        else:
            return Article.objects.all()


class ImageViewSet(viewsets.ModelViewSet):
    queryset = Photo.objects.all()
    permission_classes = [ImageArticlePermission]

    def create(self, request, *args, **kwargs):
        try:
            article = get_object_or_404(
                Article,
                pk=self.kwargs.get('article_id')
            )
        except Article.DoesNotExist:
            raise Response(
                data={'detail': 'Not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

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
            if Thumbnail.objects.filter(article=article).exists():
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

    def destroy(self, request, *args, **kwargs):
        try:
            article_id = self.kwargs.get('article_id')
            article = get_object_or_404(Article, pk=article_id)

            image_id = self.kwargs.get('image_id')
            thumbnail = Thumbnail.objects.filter(pk=image_id)
            photo = Photo.objects.filter(pk=image_id)

            if thumbnail.exists():
                image = Thumbnail.objects.get(pk=image_id)
            elif photo.exists():
                image = Photo.objects.get(pk=image_id)
            else:
                raise ObjectDoesNotExist('Image not found')

            if image.article == article:
                image.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
            else:
                return Response(
                    data={
                        'detail': 'Image does not belong to this article.'
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

        except Article.DoesNotExist:
            return Response(
                data={'detail': 'Article not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        except ObjectDoesNotExist:
            return Response(
                data={'detail': 'Image not found.'},
                status=status.HTTP_404_NOT_FOUND
            )
