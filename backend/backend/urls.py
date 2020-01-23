from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from users.urls import role_list


urlpatterns = [
    # Auth
    path('api/sessions/', include('authentication.urls')),

    # Users
    path('api/users/', include('users.urls')),
    path('api/roles/', role_list, name='role-list'),

    # Articles
    path('api/articles/', include('articles.urls')),

    # Restaurants
    path('api/restaurants/', include('restaurants.urls')),

    # Maps - External tool
    path('api/maps/', include('maps.urls')),
]

if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )
