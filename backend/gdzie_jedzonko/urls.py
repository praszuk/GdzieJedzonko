from rest_framework_simplejwt.views import TokenRefreshView

from django.urls import path

from .views import MyTokenObtainPairView, UserViewSet


app_name = 'gdzie_jedzonko'

user_list = UserViewSet.as_view({
    'get': 'list',
})

user_detail = UserViewSet.as_view({
    'get': 'retrieve'
})

urlpatterns = [
    path('sessions/token/',
         MyTokenObtainPairView.as_view(),
         name='token_obtain_pair'),

    path('sessions/refresh/',
         TokenRefreshView.as_view(),
         name='token_refresh'),

    path('users/', user_list, name='user-list'),
    path('users/<int:pk>/', user_detail, name='user-detail')
]
