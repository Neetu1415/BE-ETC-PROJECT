# Generated by Django 5.1.5 on 2025-02-06 06:48

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_user_role_user_stadium'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='role',
        ),
        migrations.RemoveField(
            model_name='user',
            name='stadium',
        ),
    ]
