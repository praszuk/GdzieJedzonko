from django.urls import path

from .views import ArticleViewSet


app_name = 'articles'


article_detail = ArticleViewSet.as_view({
    'get': 'retrieve',
})


urlpatterns = [
    path('<int:pk>/', article_detail, name='article-detail')
]
