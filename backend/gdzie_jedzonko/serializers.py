from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers

from django.utils import timezone

from .models import User


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['role'] = user.role

        return token


class RoleSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()

    def to_representation(self, data):
        """
        :param data: Role.items() one item (key, value) pair where value is id
        :return: dict i.e. {'id': 1, 'name': 'USER'}
        :rtype: dict[int, str]
        """
        return {'id': data[1], 'name': data[0]}


class UserSerializer(serializers.ModelSerializer):

    def create(self, validated_data):

        if 'role' in validated_data:
            validated_data.pop('role')

        return User.objects.create_user(**validated_data)

    def validate_birth_date(self, birth_date):
        if birth_date > timezone.now().date():
            raise serializers.ValidationError("Cannot be greater than today")

        return birth_date

    class Meta:
        model = User
        depth = 1
        exclude = ('last_login',)
        extra_kwargs = {'password': {'write_only': True, 'min_length': 6}}
