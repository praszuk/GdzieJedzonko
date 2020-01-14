from rest_framework import serializers

from .models import City


class CitySerializer(serializers.ModelSerializer):

    class Meta:
        model = City
        depth = 1
        fields = '__all__'
