from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator

class Book(models.Model):
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    cover = models.ImageField(upload_to='book_covers/', blank=True, null=True)
    description = models.TextField()
    country = models.CharField(max_length=100)
    year = models.IntegerField()
    pages = models.IntegerField()
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    age_rating = models.CharField(max_length=10, choices=[
        ('0+', '0+'),
        ('6+', '6+'),
        ('12+', '12+'),
        ('16+', '16+'),
        ('18+', '18+')
    ])
    created_date = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'book'
        ordering = ['-created_date']
    
    def __str__(self):
        return self.title


class Genre(models.Model):
    name = models.CharField(max_length=100, unique=True)
    
    class Meta:
        db_table = 'genre'
    
    def __str__(self):
        return self.name


class Trope(models.Model):
    name = models.CharField(max_length=100, unique=True)
    
    class Meta:
        db_table = 'trope'
    
    def __str__(self):
        return self.name


class BookGenre(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='book_genres')
    genre = models.ForeignKey(Genre, on_delete=models.CASCADE)
    
    class Meta:
        db_table = 'book_genre'
        unique_together = ('book', 'genre')


class BookTrope(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='book_tropes')
    trope = models.ForeignKey(Trope, on_delete=models.CASCADE)
    
    class Meta:
        db_table = 'book_trope'
        unique_together = ('book', 'trope')


class FavoriteBook(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='favorite_books')
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    added_date = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'favorite_book'
        unique_together = ('user', 'book')
        ordering = ['-added_date']
    
    def __str__(self):
        return f"{self.user.username} - {self.book.title}"


class ReadingProgress(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reading_progress')
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    current_page = models.IntegerField(default=0)
    last_read = models.DateTimeField(auto_now=True)
    is_current = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'reading_progress'
        unique_together = ('user', 'book')
        ordering = ['-last_read']
    
    def __str__(self):
        return f"{self.user.username} - {self.book.title} - Page {self.current_page}"
    
    @property
    def progress_percentage(self):
        if self.book.pages > 0:
            return round((self.current_page / self.book.pages) * 100, 1)
        return 0


class Chart(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='charts')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    cover_image = models.ImageField(upload_to='chart_covers/', blank=True, null=True)
    is_public = models.BooleanField(default=False)
    created_date = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'chart'
        ordering = ['-created_date']
    
    def __str__(self):
        return f"{self.user.username} - {self.title}"


class ChartBook(models.Model):
    chart = models.ForeignKey(Chart, on_delete=models.CASCADE, related_name='chart_books')
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    order = models.IntegerField(default=0)
    added_date = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'chart_book'
        unique_together = ('chart', 'book')
        ordering = ['order', '-added_date']
    
    def __str__(self):
        return f"{self.chart.title} - {self.book.title}"


class Comment(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='comments')
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='comments')
    comment = models.TextField()
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        blank=True,
        null=True
    )
    created_date = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'comment'
        ordering = ['-created_date']
    
    def __str__(self):
        return f"{self.user.username} - {self.book.title}"


class BookCollection(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    image = models.ImageField(upload_to='collection_images/', blank=True, null=True)
    created_date = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'book_collection'
        ordering = ['-created_date']
    
    def __str__(self):
        return self.title


class CollectionBook(models.Model):
    collection = models.ForeignKey(BookCollection, on_delete=models.CASCADE, related_name='collection_books')
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    order = models.IntegerField(default=0)
    
    class Meta:
        db_table = 'collection_book'
        unique_together = ('collection', 'book')
        ordering = ['order']