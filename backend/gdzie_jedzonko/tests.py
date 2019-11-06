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
        User.objects.create_user(
            email='user1@gdziejedzonko.pl',
            password='1234',
        )

        User.objects.create_user(
            email='user2@gdziejedzonko.pl',
            password='1234',
            first_name='John',
            last_name='Smith',
            birth_date='1978-02-12'
        )

        User.objects.create_user(
            email='mod@gdziejedzonko.pl',
            password='1234',
            first_name='Micheal',
            last_name='Johnson',
            birth_date='1970-09-22',
            role=Role.MODERATOR
        )

        User.objects.create_user(
            email='admin@gdziejedzonko.pl',
            password='1234',
            first_name='Adam',
            last_name='Williams',
            birth_date='1970-09-22',
            role=Role.ADMIN
        )

    def test_unauthenticated_user(self):
        response = self.client.get(reverse('gdzie_jedzonko:user-list'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
