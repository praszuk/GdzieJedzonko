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


class Restaurant(Location):
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=100, blank=True)
    website = models.URLField(blank=True)
    is_approved = models.BooleanField(default=False)

    city = models.ForeignKey(City, on_delete=models.CASCADE)

    def __str__(self):
        return (
            f'id: {self.id}, '
            f'name: {self.name}, '
            f'address: {self.address}, '
            f'website: {self.website}, '
            f'is_approved: {self.is_approved}, '
            f'rating: {self.rating}'
            f'City: {self.city}, '
            + Location.__str__(self)
        )

    @property
    def rating(self):
        """
        Get average value from all articles,
        which are belonging to the restaurant
        :return: float with max 2 decimal places
        :rtype: float
        """
        avg = self.article_set.aggregate(models.Avg('rating'))['rating__avg']
        return round(avg, 2) if avg else 0
