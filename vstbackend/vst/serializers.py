__author__ = 'lich'

from rest_framework import serializers
from vst.models import Attendee

class AttendeeSerializer(serializers.ModelSerializer):


    class Meta:
        model = Attendee
        fields = ('id', 'nickname', 'attend_count', 'avatar_path', 'avatar_url', 'on_top')
