from rest_framework.views import status
from rest_framework.test import APITestCase, APIClient

from django.test import TestCase
from django.urls import reverse

from .models import Role, User
from .serializers import UserSerializer, RoleSerializer


class UserModelTest(TestCase):

    def test_create_user_and_check_is_password_hashed(self):
        user = User.objects.create_user(
            email='test@test.com',
            password='123',
            first_name='test',
            last_name='test'
        )
        self.assertNotEqual(user.password, '123')
        self.assertTrue(user.check_password('123'))


class BaseViewTest(APITestCase):
    client = APIClient()
    DATETIME_FORMAT = '%Y-%m-%d %H:%M:%S'
    DATE_FORMAT = '%Y-%m-%d'

    def setUp(self):
        self.USERS = [
            {
                'email': 'user1@gdziejedzonko.pl',
                'password': 'password1234',
                'first_name': 'David',
                'last_name': 'Davis'
            },
            {
                'email': 'user2@gdziejedzonko.pl',
                'password': 'password1234',
                'first_name': 'John',
                'last_name': 'Smith',
                'birth_date': '1978-02-12'
            },
            {
                'email': 'mod@gdziejedzonko.pl',
                'password': 'password1234',
                'first_name': 'Micheal',
                'last_name': 'Johnson',
                'birth_date': '1970-09-22',
                'role': Role.MODERATOR
            },
            {
                'email': 'admin@gdziejedzonko.pl',
                'password': 'password1234',
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


class GetAllUsersTest(BaseViewTest):

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

    def test_authorized_admin(self):
        credentials = self.generate_credentials(
            self.USERS[3]['email'],
            self.USERS[3]['password']
        )
        self.client.credentials(HTTP_AUTHORIZATION=credentials)

        response = self.client.get(reverse('gdzie_jedzonko:user-list'))
        expected = User.objects.all()
        serialized = UserSerializer(expected, many=True)

        self.assertEqual(response.data, serialized.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class GetDetailUserTest(BaseViewTest):

    def test_unauthenticated_user(self):
        response = self.client.get(
            reverse('gdzie_jedzonko:user-detail', args=[1])
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_authenticated_user_success(self):
        user_sample_data_id = 0
        user = User.objects.get(email=self.USERS[user_sample_data_id]['email'])

        credentials = self.generate_credentials(
            self.USERS[user_sample_data_id]['email'],
            self.USERS[user_sample_data_id]['password']
        )
        self.client.credentials(HTTP_AUTHORIZATION=credentials)

        response = self.client.get(
            reverse('gdzie_jedzonko:user-detail', args=[user.id])
        )

        expected = User.objects.get(pk=user.id)
        serialized = UserSerializer(expected, many=False)

        self.assertEqual(response.data, serialized.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_authenticated_user_not_found(self):
        user_sample_data_id = 0

        credentials = self.generate_credentials(
            self.USERS[user_sample_data_id]['email'],
            self.USERS[user_sample_data_id]['password']
        )
        self.client.credentials(HTTP_AUTHORIZATION=credentials)

        response = self.client.get(
            reverse('gdzie_jedzonko:user-detail', args=[999])
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class GetAllRolesTest(BaseViewTest):

    def test_unauthenticated_user(self):
        response = self.client.get(reverse('gdzie_jedzonko:role-list'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_authenticated_user_success(self):
        user_sample_data_id = 0

        credentials = self.generate_credentials(
            self.USERS[user_sample_data_id]['email'],
            self.USERS[user_sample_data_id]['password']
        )
        self.client.credentials(HTTP_AUTHORIZATION=credentials)
        response = self.client.get(reverse('gdzie_jedzonko:role-list'))

        expected = Role.items()
        serialized = RoleSerializer(expected, many=True)

        self.assertEqual(response.data, serialized.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class DeleteUserTest(BaseViewTest):

    def test_unauthenticated_user(self):
        response = self.client.delete(
            reverse('gdzie_jedzonko:user-detail', args=[1])
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_authenticated_user_but_not_owner(self):
        user2 = User.objects.get(email=self.USERS[1]['email'])

        credentials = self.generate_credentials(
            self.USERS[0]['email'],
            self.USERS[0]['password']
        )
        self.client.credentials(HTTP_AUTHORIZATION=credentials)

        response = self.client.delete(
            reverse('gdzie_jedzonko:user-detail', args=[user2.id])
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertIsNotNone(User.objects.get(email=self.USERS[1]['email']))

    def test_authenticated_moderator_but_not_owner(self):
        user2 = User.objects.get(email=self.USERS[1]['email'])

        credentials = self.generate_credentials(
            self.USERS[2]['email'],
            self.USERS[2]['password']
        )
        self.client.credentials(HTTP_AUTHORIZATION=credentials)

        response = self.client.delete(
            reverse('gdzie_jedzonko:user-detail', args=[user2.id])
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(
            User.objects.filter(email=self.USERS[1]['email']).exists()
        )

    def test_authenticated_user_owner(self):
        user = User.objects.get(email=self.USERS[0]['email'])

        credentials = self.generate_credentials(
            self.USERS[0]['email'],
            self.USERS[0]['password']
        )
        self.client.credentials(HTTP_AUTHORIZATION=credentials)

        response = self.client.delete(
            reverse('gdzie_jedzonko:user-detail', args=[user.id])
        )

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(
            User.objects.filter(email=self.USERS[0]['email']).exists()
        )

    def test_authenticated_admin(self):
        user = User.objects.get(email=self.USERS[0]['email'])

        credentials = self.generate_credentials(
            self.USERS[3]['email'],
            self.USERS[3]['password']
        )
        self.client.credentials(HTTP_AUTHORIZATION=credentials)

        response = self.client.delete(
            reverse('gdzie_jedzonko:user-detail', args=[user.id])
        )

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(
            User.objects.filter(email=self.USERS[0]['email']).exists()
        )


class CreateUserTest(BaseViewTest):
    def setUp(self):
        self.test_user_data = {

            'email': 'testuser@gdziejedzonko.pl',
            'password': 'password12345',
            'first_name': 'John',
            'last_name': 'Smith',
            'birth_date': '1970-09-22'
        }

    def test_required_email(self):
        data = self.test_user_data
        data.pop('email')

        response = self.client.post(
            reverse('gdzie_jedzonko:user-list'),
            data=data
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)

    def test_required_password(self):
        data = self.test_user_data
        data.pop('password')

        response = self.client.post(
            reverse('gdzie_jedzonko:user-list'),
            data=data
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data)

    def test_required_first_name(self):
        data = self.test_user_data
        data.pop('first_name')

        response = self.client.post(
            reverse('gdzie_jedzonko:user-list'),
            data=data
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('first_name', response.data)

    def test_required_last_name(self):
        data = self.test_user_data
        data.pop('last_name')

        response = self.client.post(
            reverse('gdzie_jedzonko:user-list'),
            data=data
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('last_name', response.data)

    def test_not_required_birth_date(self):
        data = self.test_user_data
        data.pop('birth_date')

        response = self.client.post(
            reverse('gdzie_jedzonko:user-list'),
            data=data
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIsNone(User.objects.get(email=data['email']).birth_date)
