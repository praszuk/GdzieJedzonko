from django.db import models

from .validators import validate_lat, validate_lon


class Location(models.Model):
    lat = models.DecimalField(
        max_digits=7, decimal_places=5, validators=[validate_lat]
    )
    lon = models.DecimalField(
        max_digits=8, decimal_places=5, validators=[validate_lon]
    )

    class Meta:
        abstract = True

    def __str__(self):
        return f'lat: {self.lat}, lon: {self.lon}'


class City(Location):
    name = models.CharField(max_length=100)

    def __str__(self):
        return f'name: {self.name}, ' + Location.__str__(self)
