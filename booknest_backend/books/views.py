from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db.models import Q, Avg
from django.shortcuts import get_object_or_404
from .models import (
    Book, Genre, Trope, FavoriteBook, ReadingProgress,
    Chart, ChartBook, Comment, BookCollection
)
from .serializers import (
    BookSerializer, FavoriteBookSerializer, ReadingProgressSerializer,
    ChartSerializer, CommentSerializer, BookCollectionSerializer
)


class BookListView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        try:
            page = int(request.GET.get('page', 1))
            page_size = int(request.GET.get('page_size', 20))
            
            books = Book.objects.all()
            total = books.count()
            
            start = (page - 1) * page_size
            end = start + page_size
            
            books = books[start:end]
            serializer = BookSerializer(books, many=True)
            
            return Response({
                'books': serializer.data,
                'total': total
            })
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class BookDetailView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, pk):
        try:
            book = get_object_or_404(Book, pk=pk)
            serializer = BookSerializer(book)
            return Response(serializer.data)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_404_NOT_FOUND)


class BookSearchView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        try:
            query = request.GET.get('query', '')
            genres = request.GET.get('genres', '').split(',') if request.GET.get('genres') else []
            tropes = request.GET.get('tropes', '').split(',') if request.GET.get('tropes') else []
            countries = request.GET.get('countries', '').split(',') if request.GET.get('countries') else []
            authors = request.GET.get('authors', '').split(',') if request.GET.get('authors') else []
            age_rating = request.GET.get('age_rating', '').split(',') if request.GET.get('age_rating') else []
            year_from = request.GET.get('year_from')
            year_to = request.GET.get('year_to')
            pages_from = request.GET.get('pages_from')
            pages_to = request.GET.get('pages_to')
            sort_by = request.GET.get('sort_by', 'rating')
            page = int(request.GET.get('page', 1))
            page_size = int(request.GET.get('page_size', 20))
            
            books = Book.objects.all()
            
            # Text search
            if query:
                books = books.filter(
                    Q(title__icontains=query) | 
                    Q(author__icontains=query) |
                    Q(description__icontains=query)
                )
            
            # Genre filter
            if genres and genres[0]:
                books = books.filter(book_genres__genre__name__in=genres).distinct()
            
            # Trope filter
            if tropes and tropes[0]:
                books = books.filter(book_tropes__trope__name__in=tropes).distinct()
            
            # Country filter
            if countries and countries[0]:
                books = books.filter(country__in=countries)
            
            # Author filter
            if authors and authors[0]:
                books = books.filter(author__in=authors)
            
            # Age rating filter
            if age_rating and age_rating[0]:
                books = books.filter(age_rating__in=age_rating)
            
            # Year range filter
            if year_from:
                books = books.filter(year__gte=int(year_from))
            if year_to:
                books = books.filter(year__lte=int(year_to))
            
            # Pages range filter
            if pages_from:
                books = books.filter(pages__gte=int(pages_from))
            if pages_to:
                books = books.filter(pages__lte=int(pages_to))
            
            # Sorting
            if sort_by == 'rating':
                books = books.order_by('-rating')
            elif sort_by == 'title':
                books = books.order_by('title')
            elif sort_by == 'year':
                books = books.order_by('-year')
            elif sort_by == 'pages':
                books = books.order_by('-pages')
            
            total = books.count()
            
            # Pagination
            start = (page - 1) * page_size
            end = start + page_size
            books = books[start:end]
            
            serializer = BookSerializer(books, many=True)
            
            return Response({
                'books': serializer.data,
                'total': total
            })
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class FavoriteBooksView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            favorites = FavoriteBook.objects.filter(user=request.user).select_related('book')
            serializer = FavoriteBookSerializer(favorites, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def post(self, request):
        try:
            book_id = request.data.get('book_id')
            book = get_object_or_404(Book, pk=book_id)
            
            favorite, created = FavoriteBook.objects.get_or_create(
                user=request.user,
                book=book
            )
            
            serializer = FavoriteBookSerializer(favorite)
            return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)


class FavoriteBookDetailView(APIView):
    permission_classes = [IsAuthenticated]
    
    def delete(self, request, pk):
        try:
            favorite = FavoriteBook.objects.filter(user=request.user, book_id=pk).first()
            if favorite:
                favorite.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
            return Response({
                'error': 'Favorite not found'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)


class CheckFavoriteView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, pk):
        try:
            is_favorite = FavoriteBook.objects.filter(user=request.user, book_id=pk).exists()
            return Response({'is_favorite': is_favorite})
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)


class CurrentBookView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            current_reading = ReadingProgress.objects.filter(
                user=request.user,
                is_current=True
            ).select_related('book').first()
            
            if not current_reading:
                return Response({
                    'error': 'No current book'
                }, status=status.HTTP_404_NOT_FOUND)
            
            serializer = ReadingProgressSerializer(current_reading)
            return Response(serializer.data)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ReadingProgressView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            book_id = request.data.get('book_id')
            current_page = request.data.get('current_page', 1)
            
            book = get_object_or_404(Book, pk=book_id)
            
            # Set all other books as not current
            ReadingProgress.objects.filter(user=request.user).update(is_current=False)
            
            # Create or update reading progress
            progress, created = ReadingProgress.objects.update_or_create(
                user=request.user,
                book=book,
                defaults={
                    'current_page': current_page,
                    'is_current': True
                }
            )
            
            serializer = ReadingProgressSerializer(progress)
            return Response(serializer.data)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)


class UserChartsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            charts = Chart.objects.filter(user=request.user).prefetch_related('chart_books__book')
            serializer = ChartSerializer(charts, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def post(self, request):
        try:
            title = request.data.get('title')
            description = request.data.get('description', '')
            is_public = request.data.get('is_public', False)
            
            chart = Chart.objects.create(
                user=request.user,
                title=title,
                description=description,
                is_public=is_public
            )
            
            serializer = ChartSerializer(chart)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)


class ChartDetailView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, pk):
        try:
            chart = get_object_or_404(Chart, pk=pk, user=request.user)
            serializer = ChartSerializer(chart)
            return Response(serializer.data)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_404_NOT_FOUND)
    
    def patch(self, request, pk):
        try:
            chart = get_object_or_404(Chart, pk=pk, user=request.user)
            
            if 'title' in request.data:
                chart.title = request.data['title']
            if 'description' in request.data:
                chart.description = request.data['description']
            if 'is_public' in request.data:
                chart.is_public = request.data['is_public']
            
            chart.save()
            serializer = ChartSerializer(chart)
            return Response(serializer.data)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        try:
            chart = get_object_or_404(Chart, pk=pk, user=request.user)
            chart.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)


class ChartBooksView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, chart_pk):
        try:
            chart = get_object_or_404(Chart, pk=chart_pk, user=request.user)
            book_id = request.data.get('book_id')
            book = get_object_or_404(Book, pk=book_id)
            
            chart_book, created = ChartBook.objects.get_or_create(
                chart=chart,
                book=book
            )
            
            serializer = ChartSerializer(chart)
            return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)


class ChartBookDetailView(APIView):
    permission_classes = [IsAuthenticated]
    
    def delete(self, request, chart_pk, book_pk):
        try:
            chart = get_object_or_404(Chart, pk=chart_pk, user=request.user)
            chart_book = ChartBook.objects.filter(chart=chart, book_id=book_pk).first()
            
            if chart_book:
                chart_book.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
            
            return Response({
                'error': 'Book not found in chart'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)


class ChartCoverUploadView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, chart_pk):
        try:
            chart = get_object_or_404(Chart, pk=chart_pk, user=request.user)
            
            if 'cover' not in request.FILES:
                return Response({
                    'error': 'No cover file provided'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            chart.cover_image = request.FILES['cover']
            chart.save()
            
            return Response({
                'cover_url': chart.cover_image.url if chart.cover_image else None
            })
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)


class BookCommentsView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, book_pk):
        try:
            comments = Comment.objects.filter(book_id=book_pk).select_related('user')
            serializer = CommentSerializer(comments, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def post(self, request, book_pk):
        if not request.user.is_authenticated:
            return Response({
                'error': 'Authentication required'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        try:
            book = get_object_or_404(Book, pk=book_pk)
            comment_text = request.data.get('comment')
            rating = request.data.get('rating')
            
            comment = Comment.objects.create(
                user=request.user,
                book=book,
                comment=comment_text,
                rating=rating
            )
            
            # Update book rating
            avg_rating = Comment.objects.filter(
                book=book,
                rating__isnull=False
            ).aggregate(Avg('rating'))['rating__avg']
            
            if avg_rating:
                book.rating = round(avg_rating, 2)
                book.save()
            
            serializer = CommentSerializer(comment)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)


class CollectionsView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        try:
            collections = BookCollection.objects.all().prefetch_related('collection_books__book')
            serializer = BookCollectionSerializer(collections, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CollectionDetailView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, pk):
        try:
            collection = get_object_or_404(BookCollection, pk=pk)
            serializer = BookCollectionSerializer(collection)
            return Response(serializer.data)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_404_NOT_FOUND)


class FiltersView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, filter_type):
        try:
            if filter_type == 'genres':
                genres = Genre.objects.values_list('name', flat=True)
                return Response(list(genres))
            elif filter_type == 'tropes':
                tropes = Trope.objects.values_list('name', flat=True)
                return Response(list(tropes))
            elif filter_type == 'countries':
                countries = Book.objects.values_list('country', flat=True).distinct()
                return Response(list(countries))
            elif filter_type == 'authors':
                authors = Book.objects.values_list('author', flat=True).distinct()
                return Response(list(authors))
            else:
                return Response({
                    'error': 'Invalid filter type'
                }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)