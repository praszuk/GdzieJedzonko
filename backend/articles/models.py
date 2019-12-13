from django.core.exceptions import ValidationError
from django.db import models

from users.models import User


class Article(models.Model):
    title = models.CharField(max_length=100, unique=True, blank=False)
    content = models.TextField(max_length=3000, blank=False)
    creation_date = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)


def image_size_limit(image):
    limit_mb = 10

    if image.size > limit_mb * 1024 ** 2:
        raise ValidationError(
            f'Image file size cannot be greater than {limit_mb} MB.'
        )


class BaseImage(models.Model):
    image = models.ImageField(validators=(image_size_limit, ))

    class Meta:
        abstract = True


class Thumbnail(BaseImage):
    """
    Main photo for article. It will be used as thumbnail with articles list.
    """
    article = models.OneToOneField(
        Article,
        on_delete=models.CASCADE,
        related_name='thumbnail'
    )


def image_number_limit(article):
    if article.images.count() == 9:
        raise ValidationError('The article cannot contain more than 9 images.')


class Image(BaseImage):
    """
    Additional images to article (max 9).
    """
    article = models.ForeignKey(
        Article,
        on_delete=models.CASCADE,
        related_name='images',
        validators=(image_number_limit, )
    )
