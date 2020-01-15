from django.urls import path

from .views import CityViewSet, RestaurantViewSet


app_name = 'restaurants'


cities_list = CityViewSet.as_view({
    'get': 'list',
    'post': 'create'
})

cities_detail = CityViewSet.as_view({
    'delete': 'destroy'
})

restaurants_list = RestaurantViewSet.as_view({
    'get': 'list'
})

urlpatterns = [
    path('', restaurants_list, name='restaurants-list'),
    path('cities/', cities_list, name='cities-list'),
    path('cities/<int:pk>/', cities_detail, name='cities-detail'),
]
