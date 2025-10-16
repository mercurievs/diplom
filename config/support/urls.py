from django.urls import path
from . import views

app_name = 'support_app'

urlpatterns = [
    path('', views.edit_profile_view, name='edit_profile'),
]
