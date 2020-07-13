# chat/views.py
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.parsers import FileUploadParser
from rest_framework.response import Response
from rest_framework.views import APIView


def index(request):
    return render(request, 'chat/index.html')


def room(request, room_name):
    return render(request, 'chat/room.html', {
        'room_name': room_name
    })


def bot(request, room_name):
    return render(request, 'chat/bot.html', {
        'room_name': room_name
    })


def agent(request, agent_id):
    return render(request, 'chat/manager.html', {
        'agent_id': agent_id
    })


from .serializers import FileSerializer


class FileUploadView(APIView):
    parser_class = (FileUploadParser,)

    @csrf_exempt
    def post(self, request, *args, **kwargs):

        file_serializer = FileSerializer(data=request.data)

        if file_serializer.is_valid():
            file_serializer.save()
            return Response(file_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
