from django.contrib import admin

from .models import Attendee, Lecture, Review

# Register your models here.

admin.site.register(Attendee)
admin.site.register(Lecture)
admin.site.register(Review)
