from django.contrib.auth.models import BaseUserManager
from django.db import models

class UserManager(BaseUserManager, models.Manager):
    """
    Custom manager for the Usuario model.
    """

    def _create_user(self, email_user, password, is_staff, is_superuser, **extra_fields):
        if not email_user:
            raise ValueError('El usuario debe tener un email')
        email_user = self.normalize_email(email_user)
        user = self.model(
            email_user=email_user,
            is_staff=is_staff,
            is_superuser=is_superuser,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, nombres, apellidos, email_user, password=None, **extra_fields):
        """
        Create and return a regular user with the given nombres, apellidos, email and password.
        """
        if not nombres:
            raise ValueError('El usuario debe tener un nombre')
        if not apellidos:
            raise ValueError('El usuario debe tener apellidos')
        return self._create_user(email_user, password, False, False, nombres=nombres, apellidos=apellidos, **extra_fields)

    def create_superuser(self, email_user, password=None, **extra_fields):
        """
        Create and return a superuser with the given email and password.
        """
        extra_fields.setdefault('nombres', 'Admin')
        extra_fields.setdefault('apellidos', 'Admin')
        return self._create_user(email_user, password, True, True, **extra_fields)