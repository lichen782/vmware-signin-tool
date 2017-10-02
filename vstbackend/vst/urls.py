__author__ = 'lich'

from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'onlogin', views.onlogin, name='onlogin'),
]