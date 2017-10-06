from django.contrib import admin

from .models import Attendee, Lecture, Review, Announce

# Register your models here.

admin.site.register(Attendee)
admin.site.register(Lecture)
admin.site.register(Review)
admin.site.register(Announce)
