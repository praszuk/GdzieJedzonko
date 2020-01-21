from rest_framework import status
from rest_framework.test import APIClient, APITestCase

from django.urls import reverse

from articles.models import Article
from restaurants.models import Restaurant, City
from users.models import User, Role

from .constants import MAX_COMMENT_SIZE
from .models import Comment
from .serializers import CommentSerializer


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

        self.user = User.objects.create_user(
            email='user1@gdziejedzonko.pl',
            password='password1234',
            first_name='John',
            last_name='Smith',
            role=Role.USER
        )

        self.restaurant = Restaurant.objects.create(
            name='Restaurant one',
            lat='52.52001',
            lon='13.40494',
            is_approved=False,
            city=City.objects.create(name='a', lat='52.52000', lon='13.40495')
        )

        self.article = Article.objects.create(
            title='Title',
            content=self.article_content,
            user=self.user,
            rating=0,
            restaurant=self.restaurant
        )

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


class GetAllCommentsTest(BaseViewTest):

    def setUp(self):
        super().setUp()

        self.comment1 = Comment.objects.create(
            content=self.comment_content1,
            article=self.article,
            user=self.user
        )
        self.comment2 = Comment.objects.create(
            content=self.comment_content2,
            article=self.article,
            user=self.user
        )
        self.comment3 = Comment.objects.create(
            content=self.comment_content3,
            article=self.article,
            user=self.user
        )

    def test_everyone_can_get_list_of_comments(self):
        expected = Comment.objects.filter(
            article=self.article
        ).order_by('-creation_date')
        response = self.client.get(
            reverse(
                'articles:comments:comment-list',
                kwargs={'article_id': self.article.id}
            )
        )
        serialized = CommentSerializer(expected, many=True)

        self.assertEqual(response.data, serialized.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_incorrect_article_id_return_404(self):
        response = self.client.get(
            reverse(
                'articles:comments:comment-list',
                kwargs={'article_id': 55555}
            )
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class CreateCommentTest(BaseViewTest):

    def test_unauthenticated_cannot_create(self):
        response = self.client.post(
            reverse(
                'articles:comments:comment-list',
                kwargs={'article_id': self.article.id}
            ),
            data={'content': self.article_content},
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_authenticated_can_create(self):
        article_data = {'content': self.article_content}
        user = User.objects.filter(email=self.USERS[0]['email'])[0]

        self.auth_user(self.USERS[0])
        response = self.client.post(
            reverse(
                'articles:comments:comment-list',
                kwargs={'article_id': self.article.id}
            ),
            data=article_data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['user']['id'], user.id)
        self.assertIn(
            Comment.objects.get(pk=response.data['id']),
            self.article.comment_set.all()
        )

    def test_article_does_not_exists(self):
        self.auth_user(self.USERS[0])
        response = self.client.post(
            reverse(
                'articles:comments:comment-list',
                kwargs={'article_id': 55555}
            ),
            data={'content': self.article_content},
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class CommentValidatorsTest(BaseViewTest):

    def test_over_max_size_of_comment(self):
        too_long_content = {
            'ops': [
                {
                    'attributes': {'bold': True},
                    'insert': '.' * MAX_COMMENT_SIZE
                },
                {
                    'insert': '.'
                }
            ]
        }
        self.auth_user(self.USERS[0])
        response = self.client.post(
            reverse(
                'articles:comments:comment-list',
                kwargs={'article_id': self.article.id}
            ),
            data={'content': too_long_content},
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_equal_max_size_of_comment(self):
        max_size_content = {
            'ops': [
                {
                    'attributes': {'bold': True},
                    'insert': '.' * (MAX_COMMENT_SIZE - 1)
                },
                {
                    'insert': '.'
                }
            ]
        }

        self.auth_user(self.USERS[0])
        response = self.client.post(
            reverse(
                'articles:comments:comment-list',
                kwargs={'article_id': self.article.id}
            ),
            data={'content': max_size_content},
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
