from rest_framework import serializers

from .models import Article
from users.models import User


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        depth = 1
        fields = ('id', 'first_name', 'last_name')


class ArticleSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True, many=False)

    class Meta:
        model = Article
        depth = 1
        fields = '__all__'
        read_only_fields = ('id', 'creation_date')
