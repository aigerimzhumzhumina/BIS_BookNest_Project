from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone

from .utils import auto_translate

class Genre(models.Model):
    name_ru = models.CharField(max_length=100)
    name_en = models.CharField(max_length=100)
    name_kk = models.CharField(max_length=100)
    
    def __str__(self):
        return self.name_ru
    
    def get_name(self, language='ru'):
        return getattr(self, f'name_{language}', self.name_ru)

class Trope(models.Model):
    name_ru = models.CharField(max_length=100)
    name_en = models.CharField(max_length=100)
    name_kk = models.CharField(max_length=100)
    
    def __str__(self):
        return self.name_ru
    
    def get_name(self, language='ru'):
        return getattr(self, f'name_{language}', self.name_ru)

class Book(models.Model):
    title = models.CharField(max_length=200)
    author = models.CharField(max_length=200)
    description_ru = models.TextField()
    description_en = models.TextField(blank=True, null=True)
    description_kk = models.TextField(blank=True, null=True)
    genre = models.ManyToManyField(Genre, blank=True)
    tropes = models.ManyToManyField(Trope, blank=True)
    country_ru = models.TextField()
    country_en = models.TextField(blank=True, null=True)
    country_kk = models.TextField(blank=True, null=True)
    year = models.IntegerField()
    pages = models.IntegerField()
    rating = models.FloatField(default=0.0)
    cover_image = models.ImageField(upload_to='book_covers/', null=True, blank=True)
    age_rating = models.CharField(max_length=50, null=True, blank=True)
    
    def get_description(self, language='ru'):
        desc = getattr(self, f'description_{language}', None)
        return desc if desc else self.description_ru
    
    def save(self, *args, **kwargs):
        # Автоматический перевод при сохранении
        if not self.description_en:
            self.description_en = auto_translate(self.description_ru, 'en')
        if not self.description_kk:
            self.description_kk = auto_translate(self.description_ru, 'kk')
        
        super().save(*args, **kwargs)

class UserManager(BaseUserManager):
    def create_user(self, email, username, password=None, **extra_fields):
        if not email:
            raise ValueError('Users must have an email address')
        if not username:
            raise ValueError('Users must have a username')
        
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'admin')
        
        return self.create_user(email, username, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('user', 'User'),
    )
    
    id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(max_length=255, unique=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')
    created_date = models.DateTimeField(default=timezone.now)
    last_login = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    age = models.IntegerField(null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    bio = models.TextField(max_length=500, null=True, blank=True)
    
    objects = UserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    class Meta:
        db_table = 'user'
    
    def __str__(self):
        return self.email
    
    @property
    def avatar_url(self):
        if self.avatar:
            return self.avatar.url
        return '/media/avatars/default-avatar.png'