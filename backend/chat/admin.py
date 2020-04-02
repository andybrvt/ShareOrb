from django.contrib import admin;
from .models import Message;
from .models import Chat;
from .models import Contact;
# Register your models here.
admin.site.register(Contact)
admin.site.register(Message)
admin.site.register(Chat)
