# -*- coding: utf-8 -*-
# Generated by Django 1.10.4 on 2017-01-07 20:27
from __future__ import unicode_literals

from django.db import migrations
import django.db.models.deletion
import keops.models.fields


class Migration(migrations.Migration):

    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
        ('base', '0003_auto_20170107_1816'),
    ]

    operations = [
        migrations.AddField(
            model_name='menu',
            name='action',
            field=keops.models.fields.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='base.Action'),
        ),
        migrations.AddField(
            model_name='windowaction',
            name='model',
            field=keops.models.fields.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='+', to='contenttypes.ContentType'),
        ),
        migrations.AddField(
            model_name='windowaction',
            name='source_model',
            field=keops.models.fields.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='+', to='contenttypes.ContentType'),
        ),
    ]