from django.db import models

from users.models import User


class Article(models.Model):
    title = models.CharField(max_length=100, unique=True, blank=False)
    content = models.TextField(max_length=3000, blank=False)
    creation_date = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)


class Image(models.Model):
    image = models.ImageField()

    class Meta:
        abstract = True


class Thumbnail(Image):
    """
    Main photo for article. It will be used as thumbnail with articles list.
    """
    article = models.OneToOneField(
        Article,
        on_delete=models.CASCADE,
        related_name='thumbnail'
    )


class Photo(Image):
    """
    Additional photos to article (max 10).
    """
    article = models.ForeignKey(
        Article,
        on_delete=models.CASCADE,
        related_name='images'
    )
