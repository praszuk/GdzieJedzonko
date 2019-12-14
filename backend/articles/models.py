from django.db import models

from users.models import User

from .validators import (
    validate_image_size_limit,
    validate_image_number_limit,
    validate_image_file_extension
)


class Article(models.Model):
    title = models.CharField(max_length=100, unique=True, blank=False)
    content = models.TextField(max_length=3000, blank=False)
    creation_date = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)


class BaseImage(models.Model):
    image = models.ImageField(validators=(
        validate_image_size_limit,
        validate_image_file_extension
    ))

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


class Image(BaseImage):
    """
    Additional images to article (max 9).
    """
    article = models.ForeignKey(
        Article,
        on_delete=models.CASCADE,
        related_name='images',
        validators=(validate_image_number_limit,)
    )
