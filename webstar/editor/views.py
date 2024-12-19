from django.shortcuts import render


def index(request):
    return render(request, "editor/index.html")


def room(request, room_name):
    return render(request, "editor/room.html", {"room_name": room_name})
