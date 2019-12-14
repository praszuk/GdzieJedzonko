from rest_framework import serializers

from .models import Article, BaseImage, Image
from users.models import User


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        depth = 1
        fields = ('id', 'first_name', 'last_name')


class BaseImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = BaseImage
        fields = ('id', 'image', 'article')
        extra_kwargs = {'article': {'write_only': True}}
        abstract = True


class ImageSerializer(BaseImageSerializer):
    class Meta:
        model = Image
        fields = ('id', 'image', 'article')
        extra_kwargs = {'article': {'write_only': True}}


class ArticleSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True, many=False)
    images = ImageSerializer(many=True)

    class Meta:
        model = Article
        depth = 1
        fields = '__all__'
        read_only_fields = ('id', 'creation_date', 'images')

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
