from django.urls import path, include

from users.urls import role_list


urlpatterns = [
    # Auth
    path('api/sessions/', include('authentication.urls')),

    # Users
    path('api/users/', include('users.urls')),
    path('api/roles/', role_list, name='role-list'),
]
