from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.http import Http404
import requests
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from vst.apps import VstConfig
from vst.models import Attendee, Lecture, Review
from vst.serializers import AttendeeSerializer, LectureSerializer, ReviewSerializer


def get_attendee(aid):
    try:
        attendee = Attendee.objects.get(id=aid)
    except Attendee.DoesNotExist:
        raise Http404
    else:
        return attendee

def get_lecture(lid):
    try:
        lecture = Lecture.objects.get(id=lid)
    except Lecture.DoesNotExist:
        raise Http404
    else:
        return lecture

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


@csrf_exempt
@api_view(['GET'])
def onQRCodeScaned(request):
    if request.method == 'GET':
        qrCode = request.GET['code']
        aid = request.GET['aid']
        if not qrCode.startswith('VMW_TRAINING_'):
            return Response(status = status.HTTP_400_BAD_REQUEST)
        try:
            lecture = Lecture.objects.get(scan_code=qrCode)
            attendee = get_attendee(aid)
        except Lecture.DoesNotExist:
            return Response(status = status.HTTP_404_NOT_FOUND)
        else:
            try:
                attendee.lecture_set.get(id=lecture.id)
            except Lecture.DoesNotExist:
                attendee.lecture_set.add(lecture)
                attendee.attend_count += 1
                attendee.save()
            serializer = LectureSerializer(lecture)
            return Response(serializer.data)
    else:
        return Response(status = status.HTTP_405_METHOD_NOT_ALLOWED)

class AttendeeView(generics.UpdateAPIView):

    queryset = Attendee.objects.all()
    serializer_class = AttendeeSerializer


class AttendeeLectureListView(generics.ListAPIView):
    serializer_class = LectureSerializer

    def get_queryset(self):
        aid = self.kwargs['aid']
        attendee = get_attendee(aid)
        limit = self.request.query_params.get('limit', 3)
        return attendee.lecture_set.order_by('-scheduled_date')[:limit]

class LectureListView(generics.ListAPIView):

    serializer_class = LectureSerializer

    def get_queryset(self):
        limit = self.request.query_params.get('limit', 3)
        return Lecture.objects.order_by('-scheduled_date')[:limit]

class ReviewListView(generics.ListAPIView):

    serializer_class = ReviewSerializer

    def get_queryset(self):
        aid = self.kwargs['aid']
        lid = self.kwargs['lid']
        attendee = get_attendee(aid)
        lecture = get_lecture(lid)
        Review.objects.get_or_create(reviewer=attendee, lecture=lecture)
        return Review.objects.filter(reviewer=attendee, lecture=lecture)


class ReviewDetailView(generics.UpdateAPIView):

    serializer_class = ReviewSerializer
    queryset = Review.objects.all()
