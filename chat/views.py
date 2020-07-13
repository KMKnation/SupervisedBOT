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