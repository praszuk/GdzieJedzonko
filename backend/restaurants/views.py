from rest_framework import viewsets

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


class RestaurantViewSet(viewsets.ModelViewSet):
    permission_classes = (RestaurantPermission, )

    def get_queryset(self):
        query_set = Restaurant.objects.all()
        if self.action == 'list':
            query_set = query_set.filter(is_approved=True)
            city_id = self.request.query_params.get('city', None)
            if city_id:
                try:
                    city_id = int(city_id)
                    if City.objects.filter(id=city_id).exists():
                        query_set = query_set.filter(city__id=city_id)

                except ValueError:
                    pass

        return query_set

    def get_serializer_class(self):
        if self.action == 'list':
            return RestaurantListSerializer

        return RestaurantSerializer


class RestaurantListPendingViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = (RestaurantPendingPermission,)
    queryset = Restaurant.objects.filter(is_approved=False)
    serializer_class = RestaurantSerializer
