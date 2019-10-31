from django.test import TestCase
from .models import User


class UserModelTest(TestCase):

    def test_create_user_and_check_is_password_hashed(self):
        user = User.objects.create_user(email='test@test.com', password='123')
        self.assertNotEqual(user.password, '123')
        self.assertTrue(user.check_password('123'))
