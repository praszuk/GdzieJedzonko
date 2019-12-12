from django.urls import path

from .views import ArticleViewSet, ImageViewSet


app_name = 'articles'


article_detail = ArticleViewSet.as_view({
    'get': 'retrieve',
    'delete': 'destroy',
})

article_list = ArticleViewSet.as_view({
    'get': 'list',
    'post': 'create',
})

images_list = ImageViewSet.as_view({
    'post': 'create',
})

urlpatterns = [
    path('', article_list, name='article-list'),
    path('<int:pk>/', article_detail, name='article-detail'),
    path('<int:article_id>/images/', images_list, name='images-list'),
]
