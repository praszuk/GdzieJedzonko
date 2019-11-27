from rest_framework import status
from rest_framework.test import APIClient, APITestCase

from django.urls import reverse

from .models import Article
from .serializers import ArticleSerializer, ArticleListSerializer
from users.models import User, Role


class BaseViewTest(APITestCase):
    client = APIClient()


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
