__author__ = 'lich'

from rest_framework import serializers
from vst.models import Attendee, Lecture

class AttendeeSerializer(serializers.ModelSerializer):


    class Meta:
        model = Attendee
        fields = ('id', 'nickname', 'attend_count', 'avatar_path', 'avatar_url', 'on_top')


class LectureSerializer(serializers.ModelSerializer):


    class Meta:
        model = Lecture
        fields = ('id', 'title', 'scheduled_date', 'teacher_name', 'room', 'attendee_cnt')