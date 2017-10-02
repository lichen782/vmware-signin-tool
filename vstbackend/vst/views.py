from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
import requests
from vst.apps import VstConfig

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
        return JsonResponse({'openid': openid})
    else:
        return JsonResponse({'message': 'failed to fetch openid'},
                            status=openidResponse.status_code)


