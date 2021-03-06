from bleach import clean as bleach_clean

from rest_framework import serializers

from articles.serializers import ArticleListSerializer
from .models import City, Restaurant


class CitySerializer(serializers.ModelSerializer):

    class Meta:
        model = City
        depth = 1
        fields = '__all__'

    def validate_name(self, name):
        return bleach_clean(name)


class RestaurantListSerializer(serializers.ModelSerializer):
    rating = serializers.ReadOnlyField()

    class Meta:
        model = Restaurant
        depth = 1
        fields = ('id', 'name', 'lat', 'lon', 'address', 'rating')


class RestaurantSerializer(serializers.ModelSerializer):
    article_set = ArticleListSerializer(read_only=True, many=True)
    rating = serializers.ReadOnlyField()

    class Meta:
        model = Restaurant
        depth = 0
        fields = '__all__'

    def validate_name(self, name):
        return bleach_clean(name)

    def validate_address(self, address):
        return bleach_clean(address)

    def create(self, validated_data):
        validated_data.pop('is_approved', None)
        return Restaurant.objects.create(**validated_data)
