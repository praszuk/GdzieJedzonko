from rest_framework import serializers

from .models import User


class UserListSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        depth = 1
        exclude = ('password', 'last_login')
