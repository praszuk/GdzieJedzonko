from rest_framework_simplejwt.views import TokenRefreshView

from django.urls import path

from .views import MyTokenObtainPairView, UserList


app_name = 'gdzie_jedzonko'

urlpatterns = [
    path('sessions/token/',
         MyTokenObtainPairView.as_view(),
         name='token_obtain_pair'),

    path('sessions/refresh/',
         TokenRefreshView.as_view(),
         name='token_refresh'),

    path('users/', UserList.as_view(), name='user-list')
]
