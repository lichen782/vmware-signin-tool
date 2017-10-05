# -*- coding: utf-8 -*-
# Generated by Django 1.11.5 on 2017-10-05 12:34
from __future__ import unicode_literals

from django.db import migrations, models
import vst.models


class Migration(migrations.Migration):

    dependencies = [
        ('vst', '0003_auto_20171005_1502'),
    ]

    operations = [
        migrations.AlterField(
            model_name='lecture',
            name='scan_code',
            field=models.CharField(default=vst.models.auto_generate_qrcode, max_length=1024, unique=True),
        ),
    ]
