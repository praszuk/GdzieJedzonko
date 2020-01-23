from django.urls import path

from .views import coordinates


urlpatterns = [
    path('coordinates/', coordinates, name='coordinates')
]
