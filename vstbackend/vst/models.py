from django.db import models
from datetime import datetime

# Create your models here.


class Attendee(models.Model):
    openid = models.CharField(max_length=50)
    nickname = models.CharField(max_length=50, blank=True)
    avatar_path = models.CharField(max_length=1024, blank=True)
    avatar_url = models.CharField(max_length=1024, blank=True)
    attend_count = models.IntegerField(default=0)
    create_date = models.DateTimeField('date created', auto_now_add=True, blank=True)
    update_date = models.DateTimeField('when the attendee is login/updated', auto_now=True)

    @property
    def on_top(self):
        for c, a in enumerate(Attendee.objects.order_by('-attend_count')[:10]):
            if a.id == self.id:
                return c+1
        else:
            return -1


    def __str__(self):
        return ':'.join([self.openid, self.nickname])


class Lecture(models.Model):
    title = models.CharField(max_length=1024)
    create_date = models.DateTimeField('date created', auto_now_add=True, blank=True)
    scheduled_date = models.DateTimeField('when the lecture happen')
    teacher_name = models.CharField(max_length=50)
    room = models.CharField(max_length=100)
    attendees = models.ManyToManyField(Attendee, blank=True)
    scan_code = models.CharField(max_length=1024)

    class Meta:
        ordering = ["scheduled_date"]

    @property
    def attendee_cnt(self):
        return self.attendees.count()

    def __str__(self):
        return self.title


class Review(models.Model):
    lecture = models.ForeignKey(Lecture, on_delete=models.CASCADE)
    reviewer = models.ForeignKey(Attendee)
    score = models.IntegerField(default=0)
    comment = models.CharField(max_length=1024)
    create_date = models.DateTimeField('when the review is added', auto_now_add=True, blank=True)
    update_date = models.DateTimeField('when the review is updated', auto_now=True)

    def __str__(self):
        return ':'.join([self.score, self.comment])
