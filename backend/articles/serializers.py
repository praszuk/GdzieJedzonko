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

    def validate_title(self, title):
        if not all(c.isalnum() or c.isspace() for c in title):
            raise serializers.ValidationError(
                "Only letters, numbers and spaces are allowed."
            )
        return title

    def create(self, validated_data):
        # if self.context['request'].user.is_authenticated:
        #     user = self.context['request'].user
        # else:
        #     user = None
        user = self.context['request'].user
        title = validated_data['title']
        content = validated_data['content']

        return Article.objects.create(title=title, content=content, user=user)


class ArticleListSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True, many=False)

    class Meta:
        model = Article
        depth = 1
        exclude = ('content', )
        read_only_fields = ('id', 'creation_date')
