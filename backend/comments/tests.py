from rest_framework.test import APIClient, APITestCase

from users.models import User, Role


class BaseViewTest(APITestCase):
    client = APIClient()

    def setUp(self):
        self.article_content = {
            'ops': [
                {
                    'insert': 'Test article with '
                },
                {
                    'attributes': {'bold': True},
                    'insert': 'bold'
                }
            ]
        }

        self.comment_content1 = {
            'ops': [
                {
                    'insert': 'Test comment1 '
                },
                {
                    'attributes': {'bold': True},
                    'insert': 'bold'
                }
            ]
        }
        self.comment_content2 = {
            'ops': [
                {
                    'insert': 'Comment 2 '
                }
            ]
        }
        self.comment_content3 = {
            'ops': [
                {
                    'insert': 'Test comment3 '
                },
                {
                    'attributes': {'bold': True},
                    'insert': 'bold and '
                },
                {
                    'insert': 'nothing.'
                }
            ]
        }

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

