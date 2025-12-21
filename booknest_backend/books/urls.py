from django.urls import path
from .views import (
    BookListView, BookDetailView, BookSearchView,
    FavoriteBooksView, FavoriteBookDetailView, CheckFavoriteView,
    CurrentBookView, ReadingProgressView,
    UserChartsView, ChartDetailView, ChartBooksView, ChartBookDetailView,
    ChartCoverUploadView, BookCommentsView,
    CollectionsView, CollectionDetailView, FiltersView
)

urlpatterns = [
    # Books
    path('books/', BookListView.as_view(), name='book-list'),
    path('books/<int:pk>/', BookDetailView.as_view(), name='book-detail'),
    path('books/search/', BookSearchView.as_view(), name='book-search'),
    path('books/<int:book_pk>/comments/', BookCommentsView.as_view(), name='book-comments'),
    
    # User endpoints (они здесь!)
    path('user/favorites/', FavoriteBooksView.as_view(), name='favorites'),
    path('user/favorites/<int:pk>/', FavoriteBookDetailView.as_view(), name='favorite-detail'),
    path('user/favorites/<int:pk>/check/', CheckFavoriteView.as_view(), name='check-favorite'),
    path('user/current-book/', CurrentBookView.as_view(), name='current-book'),
    path('user/reading-progress/', ReadingProgressView.as_view(), name='reading-progress'),
    path('user/charts/', UserChartsView.as_view(), name='user-charts'),
    path('user/charts/<int:pk>/', ChartDetailView.as_view(), name='chart-detail'),
    path('user/charts/<int:chart_pk>/books/', ChartBooksView.as_view(), name='chart-books'),
    path('user/charts/<int:chart_pk>/books/<int:book_pk>/', ChartBookDetailView.as_view(), name='chart-book-detail'),
    path('user/charts/<int:chart_pk>/cover/', ChartCoverUploadView.as_view(), name='chart-cover-upload'),
    
    # Collections
    path('collections/', CollectionsView.as_view(), name='collections'),
    path('collections/<int:pk>/', CollectionDetailView.as_view(), name='collection-detail'),
    
    # Filters 
    path('filters/tropes/', FiltersView.as_view(), kwargs={'filter_type': 'tropes'}),
    path('filters/genres/', FiltersView.as_view(), kwargs={'filter_type': 'genres'}),
    path('filters/authors/', FiltersView.as_view(), kwargs={'filter_type': 'authors'}),
    path('filters/countries/', FiltersView.as_view(), kwargs={'filter_type': 'countries'}),
]