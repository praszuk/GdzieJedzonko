from django.contrib.postgres.fields import JSONField
from django.db import models

import os

from uuid import uuid4

from users.models import User

from .validators import (
    validate_image_size_limit,
    validate_image_number_limit,
    validate_image_file_extension,
    validate_title
)


class Article(models.Model):
    title = models.CharField(
        max_length=100, unique=True, blank=False, validators=(validate_title,)
    )
    content = JSONField()
    creation_date = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return (
            f'id: {self.id}, '
            f'title: {self.title}, '
            f'creation_date: {self.creation_date}, '
            f'user_id: {self.user.id}, '
            f'content: {self.content}'
        )


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


class Thumbnail(BaseImage):
    """
    Main photo for article. It will be used as thumbnail with articles list.
    """
    article = models.OneToOneField(
        Article,
        on_delete=models.CASCADE,
        related_name='thumbnail'
    )


class Photo(BaseImage):
    """
    Additional images to article (max 9).
    """
    article = models.ForeignKey(
        Article,
        on_delete=models.CASCADE,
        related_name='photos',
        validators=(validate_image_number_limit,)
    )
