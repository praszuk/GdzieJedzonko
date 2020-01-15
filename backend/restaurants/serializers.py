from bleach import clean as bleach_clean

from rest_framework import serializers

from .models import City, Restaurant


class CitySerializer(serializers.ModelSerializer):

    class Meta:
        model = City
        depth = 1
        fields = '__all__'

    def validate_name(self, name):
        return bleach_clean(name)


class RestaurantListSerializer(serializers.ModelSerializer):

    class Meta:
        model = Restaurant
        depth = 1
        fields = ('id', 'name', 'lat', 'lon')


# TODO for detail and create action
class RestaurantSerializer(serializers.ModelSerializer):

    class Meta:
        model = Restaurant
        depth = 1
        fields = '__all__'
