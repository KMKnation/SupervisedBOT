from django.shortcuts import render, redirect


def home(request):
    # return redirect('manager/1')
    return redirect('chat/store')