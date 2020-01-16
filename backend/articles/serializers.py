from bleach import clean as bleach_clean

from django.shortcuts import get_object_or_404
from rest_framework import serializers

from .constants import MAX_ARTICLE_SIZE
from .models import Article, BaseImage, Photo, Thumbnail

from users.models import User
from restaurants.models import Restaurant
from restaurants.serializers import RestaurantSerializer


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


class PhotoSerializer(BaseImageSerializer):
    class Meta:
        model = Photo
        fields = ('id', 'image', 'article')
        extra_kwargs = {'article': {'write_only': True}}


class ThumbnailSerializer(BaseImageSerializer):
    class Meta:
        model = Thumbnail
        fields = ('id', 'image', 'article')
        extra_kwargs = {'article': {'write_only': True}}


class ArticleSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True, many=False)
    photos = PhotoSerializer(many=True, required=False)
    thumbnail = ThumbnailSerializer(many=False, required=False)
    restaurant = RestaurantSerializer(many=False, read_only=True)
    restaurant_id = serializers.PrimaryKeyRelatedField(
        source='restaurant',
        queryset=Restaurant.objects.all(),
        write_only=True
    )

    class Meta:
        model = Article
        depth = 1
        fields = '__all__'
        read_only_fields = ('id', 'creation_date', 'photos', 'thumbnail')

    def validate_title(self, title):
        return bleach_clean(title)

    def validate_content(self, content: dict):
        if type(content) != dict or 'ops' not in content:
            raise serializers.ValidationError('Bad format of data.')

        '''
            Iterate over quill prepared objects.
            Each object can contain:
            - insert key with plain text data 
            - attributes (describe format of insert like bold) with insert
        '''
        size = 0
        for obj in content['ops']:
            if 'insert' in obj:
                size += len(obj['insert'])
                obj['insert'] = bleach_clean(obj['insert'])

        if size > MAX_ARTICLE_SIZE:
            raise serializers.ValidationError(
                f'Article too long! Max {MAX_ARTICLE_SIZE} characters allowed'
            )

        return content

    def create(self, validated_data):
        # if self.context['request'].user.is_authenticated:
        #     user = self.context['request'].user
        # else:
        #     user = None
        validated_data['user'] = self.context['request'].user

        return Article.objects.create(**validated_data)


class ArticleListSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True, many=False)
    thumbnail = ThumbnailSerializer(many=False, required=False)

    class Meta:
        model = Article
        depth = 1
        exclude = ('content', 'restaurant')
        read_only_fields = ('id', 'creation_date', 'thumbnail')
