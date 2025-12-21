import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'booknest_backend.settings')
django.setup()

from books.models import Genre, Trope

# Create genres
genres = [
    "Fantasy", "Science Fiction", "Mystery", "Thriller", "Romance",
    "Historical Fiction", "Horror", "Adventure", "Drama", "Poetry",
    "Biography", "Autobiography", "Self-Help", "Philosophy",
    "Young Adult", "Children's Literature", "Non-Fiction", "Graphic Novel"
]

for genre_name in genres:
    Genre.objects.get_or_create(name=genre_name)
    print(f"Created genre: {genre_name}")

# Create tropes
tropes = [
    "Enemies to Lovers", "Friends to Lovers", "Chosen One",
    "Coming of Age", "Love Triangle", "Slow Burn",
    "Forbidden Love", "Found Family", "Good vs Evil",
    "Redemption Arc", "Fish Out of Water", "Unreliable Narrator",
    "Hero's Journey", "Rags to Riches", "Second Chance",
    "Secret Identity", "Mentor and Student", "Betrayal"
]

for trope_name in tropes:
    Trope.objects.get_or_create(name=trope_name)
    print(f"Created trope: {trope_name}")

print("Data population completed!")




