from django.urls import path

from .views import CommentViewSet


app_name = 'comments'


comment_list = CommentViewSet.as_view({
    'get': 'list',
})

urlpatterns = [
    path('', comment_list, name='comment-list'),
]
