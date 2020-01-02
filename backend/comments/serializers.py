from rest_framework import serializers

from users.models import User

from .models import Comment


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        depth = 1
        fields = ('id', 'first_name', 'last_name')


class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True, many=False)

    class Meta:
        model = Comment
        depth = 1
        exclude = ('article', )
        read_only_fields = ('id', 'creation_date', 'user')
