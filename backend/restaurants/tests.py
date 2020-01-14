from rest_framework import status
from rest_framework.test import APIClient, APITestCase

from django.urls import reverse

from .models import City
from .serializers import CitySerializer


class GetAllCitiesTest(APITestCase):

    def setUp(self):
        self.client = APIClient()

        City.objects.create(name='Berlin', lat='52.52000', lon='13.40495')
        City.objects.create(name='Paris', lat='48.86471', lon='2.34901')
        City.objects.create(name='Warsaw', lat='52.23704', lon='21.01753')

    def test_everyone_can_get_list_of_cities(self):
        expected = City.objects.all()
        response = self.client.get(reverse('restaurants:cities-list'))
        serialized = CitySerializer(expected, many=True)

        self.assertEqual(response.data, serialized.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

