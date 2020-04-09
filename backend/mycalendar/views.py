from django.shortcuts import render
from . import models


# Create your views here.
def get_calendar(request):
    all_events = Events.objects.all()
