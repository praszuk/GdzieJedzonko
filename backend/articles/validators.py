from django.core.exceptions import ValidationError
from django.core.validators import FileExtensionValidator

import re

from .constants import (
    MAX_IMAGES_PER_ARTICLE,
    MAX_IMAGE_FILE_SIZE_MB,
    ALLOWED_IMAGE_EXTENSION
)


def validate_rating(rating):
    if rating > 5 or rating < 0:
        raise ValidationError('Rating must be in range 0-5.')


def validate_title(title):
    reg = re.compile('^[\w\,\.\-\!\?\d\s]+$')
    if not reg.match(title):
        raise ValidationError('Incorrect characters in title!')


def validate_image_size_limit(image):
    if image.size > MAX_IMAGE_FILE_SIZE_MB * 1024 ** 2:
        raise ValidationError(
            f'Image size cannot be greater than {MAX_IMAGE_FILE_SIZE_MB} MB.'
        )


def validate_image_number_limit(article):
    if article.photos.count() == MAX_IMAGES_PER_ARTICLE:
        raise ValidationError('The article cannot contain more than 9 images.')


def validate_image_file_extension(value):
    """
        Override of validate_image_file_extension from django.core.validators
        with PNG and JPG format
    """
    return FileExtensionValidator(
        allowed_extensions=ALLOWED_IMAGE_EXTENSION
    )(value)
