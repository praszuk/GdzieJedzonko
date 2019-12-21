from PIL import Image as PILImage

from rest_framework import status
from rest_framework.test import APIClient, APITestCase

from django.core.files.base import File
from django.urls import reverse
from django.test import override_settings

import json
import shutil
import tempfile

from io import BytesIO

from .constants import (
    MAX_IMAGES_PER_ARTICLE,
    ALLOWED_IMAGE_EXTENSION,
    MAX_ARTICLE_SIZE
)
from .models import Article, Photo, Thumbnail
from .serializers import ArticleSerializer, ArticleListSerializer
from users.models import User, Role


TMP_MEDIA_ROOT = tempfile.mkdtemp()


@override_settings(MEDIA_ROOT=TMP_MEDIA_ROOT)
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
        self.article_content_str = json.dumps(self.article_content)

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

    @classmethod
    def tearDownClass(cls):
        shutil.rmtree(TMP_MEDIA_ROOT, ignore_errors=True)
        super().tearDownClass()

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

    def create_test_image_file(
            self,
            name='test.png',
            ext='png',
            size=(50, 50),
            color=(256, 0, 0)
    ):
        file_obj = BytesIO()

        if ext == 'jpg':
            ext = 'JPEG'
            image = PILImage.new('RGB', size=size, color=color)
        else:
            image = PILImage.new('RGBA', size=size, color=color)

        image.save(file_obj, ext)
        file_obj.seek(0)

        return File(file_obj, name=name)

    def upload_image(
            self,
            user: dict,
            article: Article,
            image: PILImage = None,
            is_thumbnail=False
    ):
        if not image:
            image = self.create_test_image_file()

        self.auth_user(user)

        response = self.client.post(
            reverse(
                'articles:images-list',
                kwargs={'article_id': article.id}
            ),
            {'thumbnail' if is_thumbnail else 'photo': image},
            format='multipart'
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        return response.data['id']


class GetDetailArticleTest(BaseViewTest):

    def setUp(self):
        super().setUp()
        user = User.objects.create_user(
            email='test@gdziejedzonko.pl',
            password='password1234',
            first_name='John',
            last_name='Smith',
            role=Role.USER
        )
        Article.objects.create(
            title='Test title',
            content=self.article_content_str,
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

    def setUp(self):
        super().setUp()
        user = User.objects.create_user(
            email='user1@gdziejedzonko.pl',
            password='password1234',
            first_name='John',
            last_name='Smith',
            role=Role.USER
        )

        Article.objects.create(
            title='Title',
            content=self.article_content_str,
            user=user
        )
        Article.objects.create(
            title='Test title',
            content=self.article_content_str,
            user=user
        )
        Article.objects.create(
            title='Test title title',
            content=self.article_content_str,
            user=user
        )

    def test_everyone_can_get_list_of_articles(self):
        expected = Article.objects.order_by('-creation_date')
        response = self.client.get(reverse('articles:article-list'))
        serialized = ArticleListSerializer(expected, many=True)

        self.assertEqual(response.data, serialized.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class GetAllArticlesFilteredByUserTest(BaseViewTest):

    def setUp(self):
        super().setUp()

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
            content=self.article_content_str,
            user=self.user1
        )
        Article.objects.create(
            title='Test title2',
            content=self.article_content_str,
            user=self.user1
        )
        Article.objects.create(
            title='Test title title3',
            content=self.article_content_str,
            user=self.user2
        )

    def test_get_articles_user_exists(self):
        expected = Article.objects.filter(
            user_id=self.user1.id
        ).order_by('-creation_date')

        response = self.client.get(
            reverse('articles:article-list'),
            {'user': self.user1.id}
        )
        serialized = ArticleListSerializer(expected, many=True)

        self.assertEqual(response.data, serialized.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_articles_user_not_exists(self):
        expected = Article.objects.order_by('-creation_date')
        response = self.client.get(
            reverse('articles:article-list'),
            {'user': 999999}
        )
        serialized = ArticleListSerializer(expected, many=True)

        self.assertEqual(response.data, serialized.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_articles_user_incorrect_value(self):
        expected = Article.objects.order_by('-creation_date')
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
            'content': self.article_content_str,
        }
        response = self.client.post(
            reverse('articles:article-list'),
            data=article_data,
            format='json'
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_authenticated_user_can_create(self):
        article_data = {
            'title': 'Title',
            'content': self.article_content_str,
        }

        self.auth_user(self.USERS[0])

        response = self.client.post(
            reverse('articles:article-list'),
            data=article_data,
            format='json'
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        article = Article.objects.get(pk=response.data['id'])
        user = User.objects.filter(email=self.USERS[0]['email'])[0]

        self.assertEqual(article_data['title'], article.title)
        self.assertEqual(article.user, user)


class DeleteArticleTest(BaseViewTest):

    def setUp(self):
        super().setUp()

        self.article1 = Article.objects.create(
            title='Title1',
            content=self.article_content_str,
            user=User.objects.filter(email=self.USERS[0]['email'])[0]
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

    def test_admin_not_owner_can(self):
        self.auth_user(self.ADMINS[0])

        response = self.client.delete(
            reverse('articles:article-detail', args=[self.article1.id])
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)


class CreateImageForArticleTest(BaseViewTest):
    def setUp(self):
        super().setUp()

        self.article1 = Article.objects.create(
            title='Title1',
            content=self.article_content_str,
            user=User.objects.filter(email=self.USERS[0]['email'])[0]
        )
        self.article2 = Article.objects.create(
            title='Title2',
            content=self.article_content_str,
            user=User.objects.filter(email=self.USERS[1]['email'])[0]
        )

    def test_unauthorized_cannot_create_image_for_article(self):
        response = self.client.post(
            reverse(
                'articles:images-list',
                kwargs={'article_id': self.article1.id}
            ),
            {'photo': self.create_test_image_file()},
            format='multipart'
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_user_owner_can_create_image_for_article(self):
        self.upload_image(self.USERS[0], self.article1)

    def test_user_not_owner_cannot_create_image_for_article(self):
        self.auth_user(self.USERS[1])

        response = self.client.post(
            reverse(
                'articles:images-list',
                kwargs={'article_id': self.article1.id}
            ),
            {'photo': self.create_test_image_file()},
            format='multipart'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_mod_and_admin_not_owners_can_create_image_for_article(self):
        self.upload_image(self.MODS[0], self.article1)
        self.upload_image(self.ADMINS[0], self.article1)

    def test_article_not_exists(self):
        response = self.client.post(
            reverse(
                'articles:images-list',
                kwargs={'article_id': 99999}
            ),
            {'photo': self.create_test_image_file()},
            format='multipart'
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_thumbnail_is_replaced_by_new_objects(self):
        self.auth_user(self.USERS[0])

        response1 = self.client.post(
            reverse(
                'articles:images-list',
                kwargs={'article_id': self.article1.id}
            ),
            {'thumbnail': self.create_test_image_file()},
            format='multipart'
        )
        self.assertEqual(response1.status_code, status.HTTP_201_CREATED)

        response2 = self.client.post(
            reverse(
                'articles:images-list',
                kwargs={'article_id': self.article1.id}
            ),
            {'thumbnail': self.create_test_image_file()},
            format='multipart'
        )
        self.assertEqual(response2.status_code, status.HTTP_201_CREATED)

        self.assertNotEqual(response1.data['id'], response2.data['id'])
        self.assertEqual(self.article1.thumbnail.id, response2.data['id'])

    def test_incorrect_form_data_parameter(self):
        self.auth_user(self.USERS[0])

        response = self.client.post(
            reverse(
                'articles:images-list',
                kwargs={'article_id': self.article1.id}
            ),
            {'incorrect': self.create_test_image_file()},
            format='multipart'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class DeleteImageFromArticleTest(BaseViewTest):
    def setUp(self):
        super().setUp()

        self.article1 = Article.objects.create(
            title='Title1',
            content=self.article_content_str,
            user=User.objects.filter(email=self.USERS[0]['email'])[0]
        )
        self.article2 = Article.objects.create(
            title='Title2',
            content=self.article_content_str,
            user=User.objects.filter(email=self.USERS[1]['email'])[0]
        )

        self.upload_image(self.USERS[0], self.article1, is_thumbnail=True)
        self.upload_image(self.USERS[0], self.article1)
        self.upload_image(self.USERS[0], self.article1)

        self.upload_image(self.USERS[1], self.article2, is_thumbnail=True)
        self.upload_image(self.USERS[1], self.article2)
        self.upload_image(self.USERS[1], self.article2)

    def delete_image(self, user, article_id, image_id, is_thumbnail=False):
        self.auth_user(user)

        response = self.client.delete(reverse(
            'articles:images-detail',
            kwargs={
                'article_id': article_id,
                'image_id': image_id
            }
        ))

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        if is_thumbnail:
            self.assertFalse(Thumbnail.objects.filter(pk=image_id).exists())
        else:
            self.assertFalse(Photo.objects.filter(pk=image_id).exists())

    def test_unauthenticated_user_cannot_delete_image(self):
        response = self.client.delete(reverse(
            'articles:images-detail',
            kwargs={
                'article_id': self.article1.id,
                'image_id': self.article1.thumbnail.id
            }
        ))

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_user_owner_can_delete_image(self):
        self.delete_image(
            self.USERS[0],
            self.article1.id,
            self.article1.photos.all()[0].id
        )
        self.delete_image(
            self.USERS[0],
            self.article1.id,
            self.article1.thumbnail.id,
            is_thumbnail=True
        )

    def test_user_not_owner_cannot_delete(self):
        self.auth_user(self.USERS[1])

        photo_id = self.article1.photos.all()[0].id
        response = self.client.delete(reverse(
            'articles:images-detail',
            kwargs={
                'article_id': self.article1.id,
                'image_id': photo_id
            }
        ))

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(Photo.objects.filter(pk=photo_id).exists())

    def test_mod_and_admin_not_owners_can_delete(self):
        self.delete_image(
            self.MODS[0],
            self.article1.id,
            self.article1.photos.all()[0].id
        )
        self.delete_image(
            self.ADMINS[0],
            self.article1.id,
            self.article1.thumbnail.id,
            is_thumbnail=True
        )

    def test_article_not_exists(self):
        self.auth_user(self.USERS[0])

        photo_id = self.article1.photos.all()[0].id
        response = self.client.delete(reverse(
            'articles:images-detail',
            kwargs={
                'article_id': 99999,
                'image_id': photo_id
            }
        ))

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertTrue(Photo.objects.filter(pk=photo_id).exists())

    def test_image_not_exists(self):
        self.auth_user(self.USERS[0])

        response = self.client.delete(reverse(
            'articles:images-detail',
            kwargs={
                'article_id': self.article1.id,
                'image_id': 999999999
            }
        ))

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_image_belong_to_other_article_cannot_delete(self):
        self.auth_user(self.USERS[0])

        photo_id = self.article2.photos.all()[0].id
        response = self.client.delete(reverse(
            'articles:images-detail',
            kwargs={
                'article_id': self.article1.id,
                'image_id': photo_id
            }
        ))

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertTrue(Photo.objects.filter(pk=photo_id).exists())


class ArticleValidatorsTest(BaseViewTest):
    def setUp(self):
        super().setUp()

    def test_over_max_size_of_article(self):
        too_long_content = {
            'ops': [
                {
                    'attributes': {'bold': True},
                    'insert': '.' * MAX_ARTICLE_SIZE
                },
                {
                    'insert': '.'
                }
            ]
        }
        article_data = {
            'title': 'Title',
            'content': json.dumps(too_long_content),
        }

        self.auth_user(self.USERS[0])

        response = self.client.post(
            reverse('articles:article-list'),
            data=article_data,
            format='json'
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_equal_max_size_of_article(self):
        max_size_content = {
            'ops': [
                {
                    'attributes': {'bold': True},
                    'insert': '.' * (MAX_ARTICLE_SIZE - 1)
                },
                {
                    'insert': '.'
                }
            ]
        }
        article_data = {
            'title': 'Title',
            'content': json.dumps(max_size_content),
        }

        self.auth_user(self.USERS[0])

        response = self.client.post(
            reverse('articles:article-list'),
            data=article_data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class ImageValidatorsTest(CreateImageForArticleTest):
    def test_image_number_limit_validator(self):
        image_limit = MAX_IMAGES_PER_ARTICLE
        article = self.article1
        user = self.USERS[0]

        for _ in range(image_limit):
            self.upload_image(user, article)

        self.assertEqual(len(article.photos.all()), image_limit)

        # Try to create over limit
        self.auth_user(user)

        response = self.client.post(
            reverse(
                'articles:images-list',
                kwargs={'article_id': article.id}
            ),
            {'photo': self.create_test_image_file()},
            format='multipart'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(len(article.photos.all()), image_limit)

    def test_image_allowed_extension_validator(self):
        user = self.USERS[0]
        article = self.article1

        # Checking for safety.
        self.assertTupleEqual(('png', 'jpg'), ALLOWED_IMAGE_EXTENSION)

        # Allowed only these formats
        png = self.create_test_image_file(name='test.png', ext='png')
        jpg = self.create_test_image_file(name='test.jpg', ext='jpg')

        self.upload_image(user, article, png)
        self.upload_image(user, article, jpg)

        # Disallowed gif (as example) and others
        gif = self.create_test_image_file(name='test.gif', ext='gif')
        self.auth_user(user)

        response = self.client.post(
            reverse(
                'articles:images-list',
                kwargs={'article_id': article.id}
            ),
            {'photo': gif},
            format='multipart'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
