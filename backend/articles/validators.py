from django.core.exceptions import ValidationError
from django.core.validators import FileExtensionValidator


def validate_image_size_limit(image):
    limit_mb = 10

    if image.size > limit_mb * 1024 ** 2:
        raise ValidationError(
            f'Image file size cannot be greater than {limit_mb} MB.'
        )


def validate_image_number_limit(article):
    if article.images.count() == 9:
        raise ValidationError('The article cannot contain more than 9 images.')


def validate_image_file_extension(value):
    """
        Override of validate_image_file_extension from django.core.validators
        with PNG and JPG format
    """
    return FileExtensionValidator(allowed_extensions=('png', 'jpg'))(value)
