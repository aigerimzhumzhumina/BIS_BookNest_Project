from django.contrib import admin
from .models import (
    Book, Genre, Trope, BookGenre, BookTrope,
    FavoriteBook, ReadingProgress, Chart, ChartBook,
    Comment, BookCollection, CollectionBook
)


class BookGenreInline(admin.TabularInline):
    model = BookGenre
    extra = 1


class BookTropeInline(admin.TabularInline):
    model = BookTrope
    extra = 1


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'year', 'pages', 'rating', 'age_rating', 'country')
    list_filter = ('year', 'age_rating', 'country')
    search_fields = ('title', 'author', 'description')
    inlines = [BookGenreInline, BookTropeInline]
    ordering = ('-created_date',)


@admin.register(Genre)
class GenreAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)


@admin.register(Trope)
class TropeAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)


@admin.register(FavoriteBook)
class FavoriteBookAdmin(admin.ModelAdmin):
    list_display = ('user', 'book', 'added_date')
    list_filter = ('added_date',)
    search_fields = ('user__username', 'book__title')
    ordering = ('-added_date',)


@admin.register(ReadingProgress)
class ReadingProgressAdmin(admin.ModelAdmin):
    list_display = ('user', 'book', 'current_page', 'is_current', 'last_read')
    list_filter = ('is_current', 'last_read')
    search_fields = ('user__username', 'book__title')
    ordering = ('-last_read',)


class ChartBookInline(admin.TabularInline):
    model = ChartBook
    extra = 1


@admin.register(Chart)
class ChartAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'is_public', 'created_date')
    list_filter = ('is_public', 'created_date')
    search_fields = ('title', 'user__username')
    inlines = [ChartBookInline]
    ordering = ('-created_date',)


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('user', 'book', 'rating', 'created_date')
    list_filter = ('rating', 'created_date')
    search_fields = ('user__username', 'book__title', 'comment')
    ordering = ('-created_date',)


class CollectionBookInline(admin.TabularInline):
    model = CollectionBook
    extra = 1


@admin.register(BookCollection)
class BookCollectionAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_date')
    search_fields = ('title', 'description')
    inlines = [CollectionBookInline]
    ordering = ('-created_date',)