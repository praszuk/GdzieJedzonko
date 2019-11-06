from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import User
from .permissions import IsAdminUser
from .serializers import UserListSerializer


class UserList(generics.ListAPIView):
    permission_classes = (IsAuthenticated, IsAdminUser)
    queryset = User.objects.all()
    serializer_class = UserListSerializer
