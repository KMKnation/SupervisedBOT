# chat/views.py
from django.shortcuts import render



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
    return render(request, 'chat/manager.html',{
        'agent_id': agent_id
    })


from rest_framework.exceptions import ParseError
from rest_framework.parsers import FileUploadParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

class MyUploadView(APIView):
    parser_class = (FileUploadParser,)

    def put(self, request, format=None):
        if 'file' not in request.data:
            raise ParseError("Empty content")

        f = request.data['file']

        mymodel.my_file_field.save(f.name, f, save=True)
        return Response(status=status.HTTP_201_CREATED)