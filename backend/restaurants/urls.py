from django.urls import path

from .views import CityViewSet


app_name = 'restaurants'


cities_list = CityViewSet.as_view({
    'get': 'list',
})


urlpatterns = [
    path('cities/', cities_list, name='cities-list'),
]
