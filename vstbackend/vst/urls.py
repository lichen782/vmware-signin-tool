__author__ = 'lich'

from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'onlogin', views.onlogin, name='onlogin'),
    url(r'^attendee/(?P<pk>[0-9]+)/$', views.AttendeeView.as_view()),
]