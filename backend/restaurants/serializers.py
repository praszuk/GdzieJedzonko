from bleach import clean as bleach_clean

from rest_framework import serializers

from .models import City


class CitySerializer(serializers.ModelSerializer):

    class Meta:
        model = City
        depth = 1
        fields = '__all__'

    def validate_name(self, name):
        return bleach_clean(name)
