from rest_framework import viewsets

from .models import City
from .permissions import CityPermission
from .serializers import CitySerializer


class CityViewSet(viewsets.ModelViewSet):
    queryset = City.objects.all()
    serializer_class = CitySerializer
    permission_classes = (CityPermission, )
