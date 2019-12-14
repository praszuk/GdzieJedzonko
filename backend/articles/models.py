from django.db import models

import os

from uuid import uuid4

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


def generate_image_path(instance, filename):
    """
        Generating random uuid for new image file
        Modified: https://stackoverflow.com/a/15141228
    """
    ext = filename.split('.')[-1]

    # get filename
    if instance.pk:
        filename = '{}.{}'.format(instance.pk, ext)
    else:
        # set filename as random string
        filename = '{}.{}'.format(uuid4().hex, ext)

    # return the whole path to the file
    return os.path.join('articles', filename)


class BaseImage(models.Model):
    image = models.ImageField(upload_to=generate_image_path, validators=(
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
