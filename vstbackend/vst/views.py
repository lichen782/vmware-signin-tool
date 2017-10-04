from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.http import Http404
import requests
from rest_framework import mixins, generics
from vst.apps import VstConfig
from vst.models import Attendee, Lecture
from vst.serializers import AttendeeSerializer, LectureSerializer

# Create your views here.

@csrf_exempt
def onlogin(request):
    OPENID_URL = "https://api.weixin.qq.com/sns/jscode2session"
    code = request.GET['js_code']
    openidResponse = requests.get(url=OPENID_URL,
                                  params={'appid': VstConfig.appid,
                                          'secret': VstConfig.appsecret,
                                          'js_code': code,
                                          'grant_type': 'authorization_code'})
    if openidResponse.status_code == 200:
        openid = openidResponse.json()['openid']
        attendee, created = Attendee.objects.get_or_create(openid=openid)
        return JsonResponse({'openid': openid, 'id': attendee.id})
    else:
        return JsonResponse({'message': 'failed to fetch openid'},
                            status=openidResponse.status_code)


class AttendeeView(generics.UpdateAPIView):

    queryset = Attendee.objects.all()
    serializer_class = AttendeeSerializer


class AttendeeLectureListView(generics.ListAPIView):
    serializer_class = LectureSerializer

    def get_attendee(self, aid):
        try:
            attendee = Attendee.objects.get(id=aid)
        except Attendee.DoesNotExist:
            raise Http404
        else:
            return attendee

    def get_queryset(self):
        aid = self.kwargs['aid']
        attendee = self.get_attendee(aid)
        limit = self.request.query_params.get('limit', 3)
        return attendee.lecture_set.order_by('-scheduled_date')[:limit]

