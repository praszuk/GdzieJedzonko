# Generated by Django 3.0.1 on 2019-12-30 02:25

import articles.models
import articles.validators
from django.conf import settings
import django.contrib.postgres.fields.jsonb
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='BaseImage',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to=articles.models.generate_image_path, validators=[articles.validators.validate_image_size_limit, articles.validators.validate_image_file_extension])),
            ],
        ),
        migrations.CreateModel(
            name='Article',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100, unique=True, validators=[articles.validators.validate_title])),
                ('content', django.contrib.postgres.fields.jsonb.JSONField()),
                ('creation_date', models.DateTimeField(auto_now=True)),
                ('user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Thumbnail',
            fields=[
                ('baseimage_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='articles.BaseImage')),
                ('article', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='thumbnail', to='articles.Article')),
            ],
            bases=('articles.baseimage',),
        ),
        migrations.CreateModel(
            name='Photo',
            fields=[
                ('baseimage_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='articles.BaseImage')),
                ('article', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='photos', to='articles.Article', validators=[articles.validators.validate_image_number_limit])),
            ],
            bases=('articles.baseimage',),
        ),
    ]