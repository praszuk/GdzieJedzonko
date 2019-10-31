from rest_framework import generics

from .models import User
from .serializers import UserListSerializer


class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserListSerializer
