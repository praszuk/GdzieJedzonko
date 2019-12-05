from django.db import models

from users.models import User


class Image(models.Model):
    image = models.ImageField()


class Article(models.Model):
    title = models.CharField(max_length=100, unique=True, blank=False)
    content = models.TextField(max_length=3000, blank=False)
    creation_date = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    thumbnail = models.OneToOneField(
        Image,
        on_delete=models.SET_NULL,
        null=True,
        related_name='thumbnail'
    )
    images = models.ForeignKey(
        Image,
        on_delete=models.SET_NULL,
        null=True,
        related_name='images'
    )
