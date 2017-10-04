from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
import requests
from rest_framework import mixins, generics
from vst.apps import VstConfig
from vst.models import Attendee
from vst.serializers import AttendeeSerializer

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


