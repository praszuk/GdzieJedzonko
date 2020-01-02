from bleach import clean as bleach_clean

from django.shortcuts import get_object_or_404
from rest_framework import serializers

from articles.models import Article
from users.models import User
from .constants import MAX_COMMENT_SIZE
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
        fields = ('id', 'creation_date', 'content', 'user')
        read_only_fields = ('id', 'creation_date', 'user')
        extra_kwargs = {'article': {'write_only': True}}

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

        if size > MAX_COMMENT_SIZE:
            raise serializers.ValidationError(
                f'Article too long! Max {MAX_COMMENT_SIZE} characters allowed'
            )

        return content

    def create(self, validated_data):
        # if self.context['request'].user.is_authenticated:
        #     user = self.context['request'].user
        # else:
        #     user = None
        user = self.context['request'].user
        content = validated_data['content']
        article = get_object_or_404(Article, id=self.context['article_id'])

        return Comment.objects.create(
            content=content,
            user=user,
            article=article
        )
