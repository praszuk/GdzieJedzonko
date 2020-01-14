from django.db import models


class Location(models.Model):
    lat = models.DecimalField(max_digits=8, decimal_places=5)
    lon = models.DecimalField(max_digits=8, decimal_places=5)

    class Meta:
        abstract = True
