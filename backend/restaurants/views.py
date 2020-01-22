from rest_framework import viewsets

from django_filters.rest_framework import (
    DjangoFilterBackend,
    FilterSet,
    NumberFilter
)

from .models import City, Restaurant
from .permissions import (
    CityPermission,
    RestaurantPermission,
    RestaurantPendingPermission
)
from .serializers import (
    CitySerializer,
    RestaurantListSerializer,
    RestaurantSerializer
)


class CityViewSet(viewsets.ModelViewSet):
    queryset = City.objects.all()
    serializer_class = CitySerializer
    permission_classes = (CityPermission, )


class CityFilter(FilterSet):
    city = NumberFilter(field_name='city')

    class Meta:
        model = Restaurant
        fields = []


class RestaurantViewSet(viewsets.ModelViewSet):
    permission_classes = (RestaurantPermission, )
    filter_backends = [DjangoFilterBackend]
    filter_class = CityFilter

    def get_queryset(self):
        if self.action == 'list':
            return Restaurant.objects.filter(is_approved=True)
        else:
            return Restaurant.objects.all()

    def get_serializer_class(self):
        if self.action == 'list':
            return RestaurantListSerializer

        return RestaurantSerializer


class RestaurantListPendingViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = (RestaurantPendingPermission,)
    queryset = Restaurant.objects.filter(is_approved=False)
    serializer_class = RestaurantSerializer
