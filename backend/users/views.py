from rest_framework import viewsets

from .models import User, Role
from .permissions import UserPermission, IsAuthenticated
from .serializers import UserSerializer, RoleSerializer


class RoleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Role.items()
    serializer_class = RoleSerializer
    permission_classes = [IsAuthenticated]


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [UserPermission]
