from django_enumfield import enum

from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager


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
                    role=Role.USER,
                    first_name=None,
                    last_name=None,
                    birth_date=None,
                    commit=True):

        if not email:
            raise ValueError('Email is required!')

        if not password:
            raise ValueError('Password is required!')

        if not role:
            raise ValueError('Role is required!')

        if not first_name:
            first_name = ''

        if not last_name:
            last_name = ''

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

    first_name = models.TextField(max_length=50, blank=True)
    last_name = models.TextField(max_length=50, blank=True)
    birth_date = models.DateField(blank=True, null=True)

    date_joined = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
