from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html
from .models import User, Genre, Trope, Book

class GenreAdmin(admin.ModelAdmin):
    list_display = ['name_ru', 'name_en', 'name_kk']
    fields = ['name_ru', 'name_en', 'name_kk']


class TropeAdmin(admin.ModelAdmin):
    list_display = ['name_ru', 'name_en', 'name_kk']
    fields = ['name_ru', 'name_en', 'name_kk']


class BookAdmin(admin.ModelAdmin):
    fieldsets = (
        ('Basic Info', {
            'fields': ('title', 'author', 'cover_image')
        }),
        ('Description (Multilingual)', {
            'fields': ('description_ru', 'description_en', 'description_kk')
        }),
        ('Additional Info (Multilingual)', {
            'fields': ('country_ru', 'country_en', 'country_kk', 'year', 'pages', 'rating', 'age_rating')
        })
    )

class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'username', 'avatar_preview', 'role', 'is_staff', 'is_active', 'created_date')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'role')
    search_fields = ('email', 'username')
    ordering = ('-created_date',)
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('username', 'avatar', 'role', 'age', 'city', 'bio')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'created_date')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password1', 'password2', 'avatar', 'role', 'is_staff', 'is_active'),
        }),
    )

    def avatar_preview(self, obj):
        if obj.avatar:
            return format_html('<img src="{}" width="50" height="50" style="border-radius: 50%;" />', obj.avatar.url)
        return format_html('<img src="/media/avatars/default-avatar.png" width="50" height="50" style="border-radius: 50%;" />')
    avatar_preview.short_description = 'Avatar'
    
    readonly_fields = ('created_date', 'last_login')

admin.site.register(User, UserAdmin)
admin.site.register(Genre, GenreAdmin)
admin.site.register(Trope, TropeAdmin)
admin.site.register(Book, BookAdmin)