# Generated by Django 4.2.3 on 2025-03-13 05:29

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("sports_facility", "0007_alter_sports_complex_options_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="sports_complex",
            name="uid",
            field=models.CharField(blank=True, max_length=10, null=True, unique=True),
        ),
        migrations.CreateModel(
            name="Camera",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("ip_url", models.CharField(blank=True, max_length=255, null=True)),
                ("description", models.TextField(blank=True, null=True)),
                ("is_active", models.BooleanField(default=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "sports_complex",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="cameras",
                        to="sports_facility.sports_complex",
                    ),
                ),
            ],
        ),
    ]
