from rest_framework import status
from rest_framework.test import APIClient, APITestCase

from django.urls import reverse

from .models import Article
from .serializers import ArticleSerializer, ArticleListSerializer
from users.models import User, Role


class BaseViewTest(APITestCase):
    client = APIClient()

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


class CreateArticleTest(BaseViewTest):

    @classmethod
    def setUpTestData(cls):
        User.objects.create_user(
            email='test@gdziejedzonko.pl',
            password='password1234',
            first_name='John',
            last_name='Smith',
            role=Role.USER
        )

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
