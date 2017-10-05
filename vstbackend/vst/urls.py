__author__ = 'lich'

from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'onlogin', views.onlogin, name='onlogin'),
    url(r'^attendee/(?P<aid>[0-9]+)/lecture/(?P<lid>[0-9]+)/review/$', views.ReviewListView.as_view()),
    url(r'^attendee/(?P<aid>[0-9]+)/lecture/$', views.AttendeeLectureListView.as_view()),
    url(r'^attendee/(?P<pk>[0-9]+)/$', views.AttendeeView.as_view()),
    url(r'^lecture/$', views.LectureListView.as_view()),
    url(r'^review/(?P<pk>[0-9]+)/$', views.ReviewDetailView.as_view()),
]