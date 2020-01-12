from django.urls import path, include

from .views import ArticleViewSet, ImageViewSet


app_name = 'articles'


article_detail = ArticleViewSet.as_view({
    'get': 'retrieve',
    'delete': 'destroy',
    'patch': 'partial_update',
})

article_list = ArticleViewSet.as_view({
    'get': 'list',
    'post': 'create',
})

images_list = ImageViewSet.as_view({
    'post': 'create',
})

images_detail = ImageViewSet.as_view({
    'delete': 'destroy',
})

urlpatterns = [
    path('', article_list, name='article-list'),
    path('<int:pk>/', article_detail, name='article-detail'),

    path('<int:article_id>/comments/', include('comments.urls')),

    path('<int:article_id>/images/', images_list, name='images-list'),
    path(
        '<int:article_id>/images/<int:image_id>/',
        images_detail,
        name='images-detail'
    ),
]
