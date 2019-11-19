from rest_framework.views import status
from rest_framework.test import APITestCase, APIClient

from django.conf import settings
from django.test import TestCase
from django.urls import reverse
from django.utils import timezone

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

    def auth_user(self, user: dict):
        """
        Helper method for generating credentials
        :param user: user_data with keys (it has to contain email and password)
        """
        auth_data = self.generate_credentials(user['email'], user['password'])
        self.client.credentials(HTTP_AUTHORIZATION=auth_data)


class GetAllUsersTest(BaseViewTest):

    def test_unauthenticated_user(self):
        response = self.client.get(reverse('gdzie_jedzonko:user-list'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_unauthorized_user(self):
        self.auth_user(self.USERS[0])

        response = self.client.get(reverse('gdzie_jedzonko:user-list'))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthorized_mod(self):
        self.auth_user(self.USERS[2])

        response = self.client.get(reverse('gdzie_jedzonko:user-list'))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_authorized_admin(self):
        self.auth_user(self.USERS[3])

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
        user = User.objects.get(email=self.USERS[0]['email'])
        self.auth_user(self.USERS[0])

        response = self.client.get(
            reverse('gdzie_jedzonko:user-detail', args=[user.id])
        )

        expected = User.objects.get(pk=user.id)
        serialized = UserSerializer(expected, many=False)

        self.assertEqual(response.data, serialized.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_authenticated_user_not_found(self):
        self.auth_user(self.USERS[0])

        response = self.client.get(
            reverse('gdzie_jedzonko:user-detail', args=[999])
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class GetAllRolesTest(BaseViewTest):

    def test_unauthenticated_user(self):
        response = self.client.get(reverse('gdzie_jedzonko:role-list'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_authenticated_user_success(self):
        self.auth_user(self.USERS[0])
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

        self.auth_user(self.USERS[0])

        response = self.client.delete(
            reverse('gdzie_jedzonko:user-detail', args=[user2.id])
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertIsNotNone(User.objects.get(email=self.USERS[1]['email']))

    def test_authenticated_moderator_but_not_owner(self):
        user2 = User.objects.get(email=self.USERS[1]['email'])

        self.auth_user(self.USERS[2])

        response = self.client.delete(
            reverse('gdzie_jedzonko:user-detail', args=[user2.id])
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(
            User.objects.filter(email=self.USERS[1]['email']).exists()
        )

    def test_authenticated_user_owner(self):
        user = User.objects.get(email=self.USERS[0]['email'])
        self.auth_user(self.USERS[0])

        response = self.client.delete(
            reverse('gdzie_jedzonko:user-detail', args=[user.id])
        )

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(
            User.objects.filter(email=self.USERS[0]['email']).exists()
        )

    def test_authenticated_admin(self):
        user = User.objects.get(email=self.USERS[0]['email'])

        self.auth_user(self.USERS[3])

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

    def test_create_user(self):
        response = self.client.post(
            reverse('gdzie_jedzonko:user-list'),
            data=self.test_user_data
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(
            User.objects.filter(email=self.test_user_data['email']).exists()
        )

    def test_user_already_exists_and_email_unique(self):
        self.client.post(
            reverse('gdzie_jedzonko:user-list'),
            data=self.test_user_data
        )

        response = self.client.post(
            reverse('gdzie_jedzonko:user-list'),
            data=self.test_user_data
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertTrue(
            User.objects.filter(email=self.test_user_data['email']).exists()
        )

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


class UpdateUserTest(BaseViewTest):

    def setUp(self):
        super().setUp()
        self.new_data = {
                'email': 'user1new@gdziejedzonko.pl',
                'password': 'password5432',
                'first_name': 'James',
                'last_name': 'Price',
                'birth_date': '1974-03-14'
        }

    def test_unauthenticated_user(self):
        user_id = User.objects.filter(email=self.USERS[0]['email'])[0].id
        response = self.client.patch(
            reverse('gdzie_jedzonko:user-detail', args=[user_id]),
            data=self.new_data
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_user_can_change_own_data(self):
        user_data = self.USERS[1]
        user = User.objects.filter(email=user_data['email'])[0]

        self.assertEqual(user_data['email'], user.email)
        self.assertTrue(user.check_password(user_data['password']))
        self.assertEqual(user_data['first_name'], user.first_name)
        self.assertEqual(user_data['last_name'], user.last_name)
        self.assertEqual(
            user_data['birth_date'],
            user.birth_date.strftime(settings.DATE_FORMAT)
        )

        self.auth_user(user_data)
        response = self.client.patch(
            reverse('gdzie_jedzonko:user-detail', args=[user.id]),
            data=self.new_data
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        user.refresh_from_db()

        self.assertEqual(self.new_data['email'], user.email)
        self.assertTrue(user.check_password(self.new_data['password']))
        self.assertEqual(self.new_data['first_name'], user.first_name)
        self.assertEqual(self.new_data['last_name'], user.last_name)
        self.assertEqual(
            self.new_data['birth_date'],
            user.birth_date.strftime(settings.DATE_FORMAT)
        )

    def test_user_and_moderator_cannot_change_role(self):
        # user
        user_data = self.USERS[0]
        user = User.objects.filter(email=user_data['email'])[0]

        self.assertEqual(user.role, Role.USER)

        self.auth_user(user_data)
        response = self.client.patch(
            reverse('gdzie_jedzonko:user-detail', args=[user.id]),
            data={'role': Role.ADMIN}
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        user.refresh_from_db()

        self.assertEqual(user.role, Role.USER)

        # moderator
        mod_data = self.USERS[2]

        self.auth_user(mod_data)
        response = self.client.patch(
            reverse('gdzie_jedzonko:user-detail', args=[user.id]),
            data={'role': Role.ADMIN}
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        user.refresh_from_db()
        self.assertEqual(user.role, Role.USER)

    def test_user_and_moderator_cannot_change_someone_data(self):
        # user
        user_data = self.USERS[0]
        user2 = User.objects.filter(email=self.USERS[1]['email'])[0]

        self.auth_user(user_data)
        response = self.client.patch(
            reverse('gdzie_jedzonko:user-detail', args=[user2.id]),
            data=self.new_data
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # checking if first user haven't changed anything on some fields
        user2_new = User.objects.filter(email=self.USERS[1]['email'])[0]
        self.assertEqual(user2.email, user2_new.email)
        self.assertEqual(user2.first_name, user2_new.first_name)
        self.assertEqual(user2.last_name, user2_new.last_name)

        # moderator
        mod_data = self.USERS[2]

        self.auth_user(mod_data)
        response = self.client.patch(
            reverse('gdzie_jedzonko:user-detail', args=[user2.id]),
            data=self.new_data
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_change_role(self):
        admin_data = self.USERS[3]
        admin = User.objects.filter(email=admin_data['email'])[0]

        self.assertEqual(admin.role, Role.ADMIN)

        self.auth_user(admin_data)
        response = self.client.patch(
            reverse('gdzie_jedzonko:user-detail', args=[admin.id]),
            data={'role': Role.USER}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        admin.refresh_from_db()

        self.assertEqual(admin.role, Role.USER)


class CreateUserIncorrectDataTest(BaseViewTest):
    def setUp(self):
        self.test_user_data = {

            'email': 'testuser@gdziejedzonko.pl',
            'password': 'password12345',
            'first_name': 'John',
            'last_name': 'Smith',
            'birth_date': '1970-09-22'
        }

    def test_incorrect_email(self):
        data = self.test_user_data
        data['email'] = 'test'

        response = self.client.post(
            reverse('gdzie_jedzonko:user-list'),
            data=data
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)

    def test_incorrect_password_length(self):
        # Password must contain 6-128 characters (inclusive both)
        password_too_short = '55555'

        data = self.test_user_data
        data['password'] = password_too_short

        response = self.client.post(
            reverse('gdzie_jedzonko:user-list'),
            data=data
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn(
            'at least 6 characters',
            str(response.data['password'])
        )

        password_too_long = '1' * 129
        data = self.test_user_data
        data['password'] = password_too_long

        response = self.client.post(
            reverse('gdzie_jedzonko:user-list'),
            data=data
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn(
            'no more than 128 characters',
            str(response.data['password'])
        )

    def test_incorrect_names_with_numbers(self):
        # first_name and last_name cannot contain numbers

        data = self.test_user_data
        data['first_name'] = 'John1'

        response = self.client.post(
            reverse('gdzie_jedzonko:user-list'),
            data=data
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Only letters', response.data['first_name'][0])

        data = self.test_user_data
        data['last_name'] = 'Smith2'

        response = self.client.post(
            reverse('gdzie_jedzonko:user-list'),
            data=data
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Only letters', response.data['last_name'][0])

    def test_incorrect_names_max_length(self):
        # first_name and last_name must contain 1-50 characters (inclusive)
        # tests for at least 1 character are already exist "test_required"

        data = self.test_user_data
        data['first_name'] = 'toolongfirstname'*5

        response = self.client.post(
            reverse('gdzie_jedzonko:user-list'),
            data=data
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('no more than 50', response.data['first_name'][0])

        data = self.test_user_data
        data['last_name'] = 'toolonglastname' * 5

        response = self.client.post(
            reverse('gdzie_jedzonko:user-list'),
            data=data
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('no more than 50', response.data['last_name'][0])

    def test_incorrect_birth_date_format(self):
        data = self.test_user_data
        data['birth_date'] = '2202-2-2-2'

        response = self.client.post(
            reverse('gdzie_jedzonko:user-list'),
            data=data
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('instead: YYYY-MM-DD', str(response.data['birth_date']))

    def test_incorrect_birth_date_greater_than_today(self):
        data = self.test_user_data
        tomorrow = timezone.now().date().today() + timezone.timedelta(days=1)

        data['birth_date'] = tomorrow.strftime(settings.DATE_FORMAT)

        response = self.client.post(
            reverse('gdzie_jedzonko:user-list'),
            data=data
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        self.assertIn(
            'Cannot be greater than today',
            str(response.data['birth_date'])
        )
