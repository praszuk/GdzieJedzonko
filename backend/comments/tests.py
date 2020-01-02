from rest_framework import status
from rest_framework.test import APIClient, APITestCase

from django.urls import reverse

from articles.models import Article
from users.models import User, Role

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


class GetAllCommentsTest(BaseViewTest):

    def setUp(self):
        super().setUp()
        self.user = User.objects.create_user(
            email='user1@gdziejedzonko.pl',
            password='password1234',
            first_name='John',
            last_name='Smith',
            role=Role.USER
        )

        self.article = Article.objects.create(
            title='Title',
            content=self.article_content,
            user=self.user
        )

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
