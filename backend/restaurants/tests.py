from rest_framework import status
from rest_framework.test import APIClient, APITestCase

from django.core.exceptions import ValidationError
from django.urls import reverse

from users.models import User, Role

from .models import City
from .serializers import CitySerializer
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
