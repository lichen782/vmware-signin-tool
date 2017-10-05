# -*- coding: utf-8 -*-
# Generated by Django 1.11.5 on 2017-10-05 07:02
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vst', '0002_auto_20171004_1529'),
    ]

    operations = [
        migrations.AlterField(
            model_name='review',
            name='comment',
            field=models.CharField(blank=True, max_length=1024),
        ),
        migrations.AlterField(
            model_name='review',
            name='score',
            field=models.FloatField(default=0),
        ),
    ]
