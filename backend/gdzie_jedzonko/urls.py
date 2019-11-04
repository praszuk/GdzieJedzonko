from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from django.urls import path
from .views import UserList

urlpatterns = [
    path('sessions/token/',
         TokenObtainPairView.as_view(),
         name='token_obtain_pair'),

    path('sessions/refresh/',
         TokenRefreshView.as_view(),
         name='token_refresh'),

    path('users/', UserList.as_view(),)
]
