from rest_framework_simplejwt.views import TokenRefreshView

from django.urls import path

from .views import MyTokenObtainPairView, UserViewSet, RoleViewSet


app_name = 'gdzie_jedzonko'

role_list = RoleViewSet.as_view({
    'get': 'list',
})

user_list = UserViewSet.as_view({
    'get': 'list',
    'post': 'create'
})

user_detail = UserViewSet.as_view({
    'get': 'retrieve',
    'patch': 'partial_update',
    'delete': 'destroy'
})


urlpatterns = [
    path('sessions/token/',
         MyTokenObtainPairView.as_view(),
         name='token_obtain_pair'),

    path('sessions/refresh/',
         TokenRefreshView.as_view(),
         name='token_refresh'),

    path('roles/', role_list, name='role-list'),
    path('users/', user_list, name='user-list'),
    path('users/<int:pk>/', user_detail, name='user-detail')
]
