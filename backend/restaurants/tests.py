from rest_framework import status
from rest_framework.test import APIClient, APITestCase

from django.core.exceptions import ValidationError
from django.urls import reverse

from users.models import User, Role

from .models import City, Restaurant
from .serializers import CitySerializer, RestaurantListSerializer
from .validators import validate_lat, validate_lon


class BaseViewTest(APITestCase):
    client = APIClient()

    def setUp(self):
        self.USERS = [
            {
                'email': 'articleuser1@gdziejedzonko.pl',
                'password': 'password1234',
                'first_name': 'David',
                'last_name': 'Davis'
            },
            {
                'email': 'articleuser2@gdziejedzonko.pl',
                'password': 'password1234',
                'first_name': 'John',
                'last_name': 'Smith',
                'birth_date': '1978-02-12'
            },
        ]
        self.MODS = [
            {
                'email': 'articlemod@gdziejedzonko.pl',
                'password': 'password1234',
                'first_name': 'Micheal',
                'last_name': 'Johnson',
                'birth_date': '1970-09-22',
                'role': Role.MODERATOR
            },
        ]
        self.ADMINS = [
            {
                'email': 'articleadmin@gdziejedzonko.pl',
                'password': 'password1234',
                'first_name': 'Adam',
                'last_name': 'Williams',
                'birth_date': '1970-09-22',
                'role': Role.ADMIN
            }
        ]

        for user in self.USERS:
            User.objects.create_user(**user)

        for mod in self.MODS:
            User.objects.create_user(**mod)

        for admin in self.ADMINS:
            User.objects.create_user(**admin)

    def generate_credentials(self, email: str, password: str):
        """
        Generating credentials string using token_obtain_pair endpoint.
        :return: Credentials string in format 'Bearer <access token>'
        :rtype: str
        """
        data = {'email': email, 'password': password}
        response = self.client.post(
            reverse('authentication:token_obtain_pair'),
            data=data
        )

        return 'Bearer ' + response.data['access']

    def auth_user(self, user: dict):
        """
        Helper method for generating credentials
        :param user: user_data with keys (it has to contain email and password)
        """
        auth_data = self.generate_credentials(user['email'], user['password'])
        self.client.credentials(HTTP_AUTHORIZATION=auth_data)


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


class CreateCityTest(BaseViewTest):

    def test_only_admin_can_create(self):
        city_data = {'name': 'Warsaw', 'lat': '52.23704', 'lon': '21.01753'}
        url = reverse('restaurants:cities-list')

        # Not authenticated
        response = self.client.post(url, city_data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        # User
        self.auth_user(self.USERS[0])
        response = self.client.post(url, city_data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # Mod
        self.auth_user(self.MODS[0])
        response = self.client.post(url, city_data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # Admin
        self.auth_user(self.ADMINS[0])
        response = self.client.post(url, city_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(
            CitySerializer(City.objects.all()[0], many=False).data,
            response.data
        )


class DeleteCityTest(BaseViewTest):

    def test_only_admin_can_destroy(self):
        city_data = {'name': 'Warsaw', 'lat': '52.23704', 'lon': '21.01753'}
        city_id = City.objects.create(**city_data).id
        self.assertTrue(City.objects.filter(pk=city_id).exists())

        url = reverse('restaurants:cities-detail', args=[city_id])

        # Not authenticated
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        # User
        self.auth_user(self.USERS[0])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # Mod
        self.auth_user(self.MODS[0])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # Admin
        self.auth_user(self.ADMINS[0])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(City.objects.filter(pk=city_id).exists())


class GetAllRestaurantsTest(BaseViewTest):
    def setUp(self):
        self.client = APIClient()

        self.c1 = City.objects.create(name='a', lat='52.52000', lon='13.40495')
        self.c2 = City.objects.create(name='b', lat='48.86471', lon='2.34901')
        self.c3 = City.objects.create(name='c', lat='52.23704', lon='21.01753')

        self.r1 = Restaurant.objects.create(
            name='Restaurant one',
            lat='52.52001',
            lon='13.40494',
            is_approved=True,
            city=self.c1
        )
        self.r2 = Restaurant.objects.create(
            name='Restaurant two',
            lat='52.52001',
            lon='13.40494',
            is_approved=True,
            city=self.c1
        )
        self.r3 = Restaurant.objects.create(
            name='Restaurant three',
            lat='52.52001',
            lon='13.40494',
            is_approved=False,
            city=self.c1
        )
        self.r4 = Restaurant.objects.create(
            name='Restaurant four',
            lat='48.86471',
            lon='2.34901',
            is_approved=True,
            city=self.c2,
        )

    def test_everyone_can_get_list_of_restaurants(self):
        expected = Restaurant.objects.filter(is_approved=True)
        response = self.client.get(reverse('restaurants:restaurants-list'))
        serialized = RestaurantListSerializer(expected, many=True)

        self.assertEqual(response.data, serialized.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_city_filter(self):
        expected = Restaurant.objects.filter(is_approved=True).filter(
            city=self.c1
        )
        response = self.client.get(
            reverse('restaurants:restaurants-list'),
            {'city': self.c1.id}
        )
        serialized = RestaurantListSerializer(expected, many=True)

        self.assertEqual(response.data, serialized.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_city_filter_incorrect_value(self):
        expected = Restaurant.objects.filter(is_approved=True)
        response = self.client.get(
            reverse('restaurants:restaurants-list'),
            {'city': '<non int value>'}
        )
        serialized = RestaurantListSerializer(expected, many=True)

        self.assertEqual(response.data, serialized.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class TestLocationValidators(APITestCase):

    def test_lat(self):
        self.assertRaises(ValidationError, validate_lat, 90.00001)
        self.assertRaises(ValidationError, validate_lat, -90.00001)

        self.assertIsNone(validate_lat(90.00000))
        self.assertIsNone(validate_lat(0.0))
        self.assertIsNone(validate_lat(-90.00000))

    def test_lon(self):
        self.assertRaises(ValidationError, validate_lon, 180.00001)
        self.assertRaises(ValidationError, validate_lon, -180.00001)

        self.assertIsNone(validate_lon(180.00000))
        self.assertIsNone(validate_lon(0.0))
        self.assertIsNone(validate_lon(-180.00000))
