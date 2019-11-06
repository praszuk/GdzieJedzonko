from rest_framework.views import status
from rest_framework.test import APITestCase, APIClient

from django.test import TestCase
from django.urls import reverse

from .models import Role, User


class UserModelTest(TestCase):

    def test_create_user_and_check_is_password_hashed(self):
        user = User.objects.create_user(email='test@test.com', password='123')
        self.assertNotEqual(user.password, '123')
        self.assertTrue(user.check_password('123'))


class BaseViewTest(APITestCase):
    client = APIClient()
    DATETIME_FORMAT = '%Y-%m-%d %H:%M:%S'
    DATE_FORMAT = '%Y-%m-%d'


class GetAllUsersTest(BaseViewTest):

    def setUp(self):
        self.USERS = [
            {
                'email': 'user1@gdziejedzonko.pl',
                'password': '1234'
            },
            {
                'email': 'user2@gdziejedzonko.pl',
                'password': '1234',
                'first_name': 'John',
                'last_name': 'Smith',
                'birth_date': '1978-02-12'
            },
            {
                'email': 'mod@gdziejedzonko.pl',
                'password': '1234',
                'first_name': 'Micheal',
                'last_name': 'Johnson',
                'birth_date': '1970-09-22',
                'role': Role.MODERATOR
            },
            {
                'email': 'admin@gdziejedzonko.pl',
                'password': '1234',
                'first_name': 'Adam',
                'last_name': 'Williams',
                'birth_date': '1970-09-22',
                'role': Role.ADMIN
            }
        ]

        for user in self.USERS:
            User.objects.create_user(**user)

    def generate_credentials(self, email, password):
        data = {'email': email, 'password': password}
        response = self.client.post(
            reverse('gdzie_jedzonko:token_obtain_pair'),
            data=data
        )
        return 'Bearer ' + response.data['access']

    def test_unauthenticated_user(self):
        response = self.client.get(reverse('gdzie_jedzonko:user-list'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_unauthorized_user(self):
        credentials = self.generate_credentials(
            self.USERS[0]['email'],
            self.USERS[0]['password']
        )
        self.client.credentials(HTTP_AUTHORIZATION=credentials)

        response = self.client.get(reverse('gdzie_jedzonko:user-list'))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthorized_mod(self):
        credentials = self.generate_credentials(
            self.USERS[2]['email'],
            self.USERS[2]['password']
        )
        self.client.credentials(HTTP_AUTHORIZATION=credentials)

        response = self.client.get(reverse('gdzie_jedzonko:user-list'))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
