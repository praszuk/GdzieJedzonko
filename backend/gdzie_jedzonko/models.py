from django_enumfield import enum

from django.conf import settings
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models


class Role(enum.Enum):
    USER = 1
    MODERATOR = 2
    ADMIN = 3

    __labels__ = {
        USER: 'User',
        MODERATOR: 'Moderator',
        ADMIN: 'Admin',
    }


class UserManager(BaseUserManager):

    def create_user(self,
                    email,
                    password,
                    first_name,
                    last_name,
                    role=Role.USER,
                    birth_date=None,
                    commit=True):

        if not email:
            raise ValueError('Email is required!')

        if not password:
            raise ValueError('Password is required!')

        if not role:
            raise ValueError('Role is required!')

        if not first_name:
            raise ValueError('First name is required!')

        if not last_name:
            raise ValueError('Last name is required!')

        user = self.model(
            email=self.normalize_email(email),
            role=role,
            first_name=first_name,
            last_name=last_name,
            birth_date=birth_date
        )
        user.set_password(password)

        if commit:
            user.save()

        return user


class User(AbstractBaseUser):
    email = models.EmailField(unique=True)
    role = enum.EnumField(Role, default=Role.USER)
    first_name = models.CharField(max_length=50, blank=False)
    last_name = models.CharField(max_length=50, blank=False)

    birth_date = models.DateField(blank=True, null=True)

    date_joined = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'

    def __str__(self):
        date_joined = self.date_joined.strftime(settings.DATETIME_FORMAT)

        return (
            f'email: {self.email}, '
            f'role: {self.role}, '
            f'first_name: {self.first_name}, '
            f'last_name: {self.last_name}, '
            f'birth_date: {self.birth_date}, '
            f'date_joined: {date_joined}'
        )
