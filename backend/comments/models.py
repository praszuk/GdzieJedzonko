from django.contrib.postgres.fields import JSONField
from django.db import models

from articles.models import Article
from users.models import User


class Comment(models.Model):
    content = JSONField()
    creation_date = models.DateTimeField(auto_now=True)

    article = models.ForeignKey(Article, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return (
            f'id: {self.id}, '
            f'creation_date: {self.creation_date}, '
            f'article_id: {self.article.id}'
            f'user_id: {self.user.id}, '
            f'content: {self.content}'
        )
