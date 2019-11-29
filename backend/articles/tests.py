from rest_framework import status
from rest_framework.test import APIClient, APITestCase

from django.urls import reverse

from .models import Article
from .serializers import ArticleSerializer, ArticleListSerializer
from users.models import User, Role


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


class GetDetailArticleTest(BaseViewTest):

    @classmethod
    def setUpTestData(cls):
        user = User.objects.create_user(
            email='test@gdziejedzonko.pl',
            password='password1234',
            first_name='John',
            last_name='Smith',
            role=Role.USER
        )
        Article.objects.create(
            title='Test title',
            content='Content of the article',
            user=user
        )

    def test_everyone_can_get_detail(self):
        expected = Article.objects.all()[0]
        response = self.client.get(
            reverse('articles:article-detail', args=[expected.id])
        )
        serialized = ArticleSerializer(expected, many=False)

        self.assertEqual(response.data, serialized.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class GetAllArticlesTest(BaseViewTest):
    @classmethod
    def setUpTestData(cls):
        user = User.objects.create_user(
            email='user1@gdziejedzonko.pl',
            password='password1234',
            first_name='John',
            last_name='Smith',
            role=Role.USER
        )

        Article.objects.create(
            title='Title',
            content='Content of the article',
            user=user
        )
        Article.objects.create(
            title='Test title',
            content='No content',
            user=user
        )
        Article.objects.create(
            title='Test title title',
            content='Test content',
            user=user
        )

    def test_everyone_can_get_list_of_articles(self):
        expected = Article.objects.all()
        response = self.client.get(reverse('articles:article-list'))
        serialized = ArticleListSerializer(expected, many=True)

        self.assertEqual(response.data, serialized.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class GetAllArticlesFilteredByUserTest(BaseViewTest):

    def setUp(self):
        self.user1 = User.objects.create_user(
            email='filteruser@gdziejedzonko.pl',
            password='password1234',
            first_name='John',
            last_name='Smith',
            role=Role.USER
        )

        self.user2 = User.objects.create_user(
            email='filteruser2@gdziejedzonko.pl',
            password='password1234',
            first_name='John',
            last_name='Smith',
            role=Role.USER
        )

        Article.objects.create(
            title='Title1',
            content='Content of the article',
            user=self.user1
        )
        Article.objects.create(
            title='Test title2',
            content='No content',
            user=self.user1
        )
        Article.objects.create(
            title='Test title title3',
            content='Test content',
            user=self.user2
        )

    def test_get_articles_user_exists(self):
        expected = Article.objects.filter(user_id=self.user1.id)
        response = self.client.get(
            reverse('articles:article-list'),
            {'user': self.user1.id}
        )
        serialized = ArticleListSerializer(expected, many=True)

        self.assertEqual(response.data, serialized.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_articles_user_not_exists(self):
        expected = Article.objects.all()
        response = self.client.get(
            reverse('articles:article-list'),
            {'user': 999999}
        )
        serialized = ArticleListSerializer(expected, many=True)

        self.assertEqual(response.data, serialized.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_articles_user_incorrect_value(self):
        expected = Article.objects.all()
        response = self.client.get(
            reverse('articles:article-list'),
            {'user': 'incorrect_value'}
        )
        serialized = ArticleListSerializer(expected, many=True)

        self.assertEqual(response.data, serialized.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class CreateArticleTest(BaseViewTest):

    def test_unauthenticated_user_cannot_create(self):
        article_data = {
            'title': 'Title',
            'content': 'Content of the article',
        }
        response = self.client.post(
            reverse('articles:article-list'),
            data=article_data
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_authenticated_user_can_create(self):
        article_data = {
            'title': 'Title',
            'content': 'Content of the article',
        }

        self.auth_user(self.USERS[0])

        response = self.client.post(
            reverse('articles:article-list'),
            data=article_data
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        article = Article.objects.get(pk=response.data['id'])
        user = User.objects.filter(email=self.USERS[0]['email'])[0]

        self.assertEqual(article_data['title'], article.title)
        self.assertEqual(article.user, user)


class DeleteArticleTest(BaseViewTest):

    def setUp(self):
        super().setUp()

        self.user1 = User.objects.filter(email=self.USERS[0]['email'])[0]
        self.user2 = User.objects.filter(email=self.USERS[1]['email'])[0]

        self.article1 = Article.objects.create(
            title='Title1',
            content='Content of the article',
            user=self.user1
        )
        self.article2 = Article.objects.create(
            title='Test title title3',
            content='Test content',
            user=self.user2
        )

    def test_unauthenticated_user(self):
        response = self.client.delete(
            reverse('articles:article-detail', args=[self.article1.id])
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_user_not_owner_cannot(self):
        self.auth_user(self.USERS[1])

        response = self.client.delete(
            reverse('articles:article-detail', args=[self.article1.id])
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_user_owner_can(self):
        self.auth_user(self.USERS[0])

        response = self.client.delete(
            reverse('articles:article-detail', args=[self.article1.id])
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_mod_not_owner_can(self):
        self.auth_user(self.MODS[0])

        response = self.client.delete(
            reverse('articles:article-detail', args=[self.article1.id])
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
