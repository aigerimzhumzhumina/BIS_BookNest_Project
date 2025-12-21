from rest_framework import serializers
from .models import (
    Book, Genre, Trope, FavoriteBook, ReadingProgress, 
    Chart, ChartBook, Comment, BookCollection, CollectionBook
)
from accounts.serializers import UserSerializer


class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ['id', 'name']


class TropeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trope
        fields = ['id', 'name']


class BookSerializer(serializers.ModelSerializer):
    genre = serializers.SerializerMethodField()
    tropes = serializers.SerializerMethodField()
    
    class Meta:
        model = Book
        fields = [
            'id', 'title', 'author', 'cover', 'description',
            'genre', 'tropes', 'country', 'year', 'pages',
            'rating', 'age_rating', 'created_date'
        ]
    
    def get_genre(self, obj):
        return [bg.genre.name for bg in obj.book_genres.all()]
    
    def get_tropes(self, obj):
        return [bt.trope.name for bt in obj.book_tropes.all()]


class FavoriteBookSerializer(serializers.ModelSerializer):
    book = BookSerializer(read_only=True)
    
    class Meta:
        model = FavoriteBook
        fields = ['id', 'book', 'added_date']


class ReadingProgressSerializer(serializers.ModelSerializer):
    book = BookSerializer(read_only=True)
    progress = serializers.SerializerMethodField()
    total_pages = serializers.SerializerMethodField()
    
    class Meta:
        model = ReadingProgress
        fields = [
            'id', 'book', 'current_page', 'total_pages',
            'progress', 'last_read', 'is_current'
        ]
    
    def get_progress(self, obj):
        return obj.progress_percentage
    
    def get_total_pages(self, obj):
        return obj.book.pages


class ChartBookSerializer(serializers.ModelSerializer):
    book = BookSerializer(read_only=True)
    
    class Meta:
        model = ChartBook
        fields = ['id', 'book', 'order', 'added_date']


class ChartSerializer(serializers.ModelSerializer):
    books = serializers.SerializerMethodField()
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    
    class Meta:
        model = Chart
        fields = [
            'id', 'user_id', 'title', 'description',
            'cover_image', 'books', 'created_date', 'is_public'
        ]
        read_only_fields = ['created_date']
    
    def get_books(self, obj):
        chart_books = obj.chart_books.select_related('book').all()
        return [BookSerializer(cb.book).data for cb in chart_books]


class CommentSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    
    class Meta:
        model = Comment
        fields = ['id', 'user', 'comment', 'rating', 'created_date']
        read_only_fields = ['created_date']
    
    def get_user(self, obj):
        return {
            'username': obj.user.username,
            'avatar': obj.user.avatar.url if obj.user.avatar else '/media/avatars/default-avatar.png'
        }


class CollectionBookSerializer(serializers.ModelSerializer):
    book = BookSerializer(read_only=True)
    
    class Meta:
        model = CollectionBook
        fields = ['book', 'order']


class BookCollectionSerializer(serializers.ModelSerializer):
    books = serializers.SerializerMethodField()
    
    class Meta:
        model = BookCollection
        fields = ['id', 'title', 'description', 'image', 'books', 'created_date']
    
    def get_books(self, obj):
        collection_books = obj.collection_books.select_related('book').all()
        return [BookSerializer(cb.book).data for cb in collection_books]