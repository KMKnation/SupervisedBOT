from django.urls import path

from chat.views import FileUploadView
from . import views

urlpatterns = [
    # path('', views.index, name='index'),
    # path('<str:room_name>/', views.room, name='room'),
    path('<str:room_name>/', views.bot, name='bot'),
]

