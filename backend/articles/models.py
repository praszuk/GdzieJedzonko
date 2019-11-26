from django.db import models


class Article(models.Model):
    title = models.CharField(max_length=100, unique=True, blank=False)
    content = models.TextField(max_length=3000, blank=False)
    creation_date = models.DateTimeField(auto_now=True)
