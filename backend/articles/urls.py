from django.urls import path

from .views import ArticleViewSet


app_name = 'articles'


article_detail = ArticleViewSet.as_view({
    'get': 'retrieve',
})

article_list = ArticleViewSet.as_view({
    'get': 'list',
})

urlpatterns = [
    path('', article_list, name='article-list'),
    path('<int:pk>/', article_detail, name='article-detail'),
]
