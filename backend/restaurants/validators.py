from django.core.exceptions import ValidationError


def validate_lat(lat):
    lat = float(lat)
    if lat < -90 or lat > 90:
        raise ValidationError('Latitude must be between -90, 90')


def validate_lon(lon):
    lon = float(lon)
    if lon < -180 or lon > 180:
        raise ValidationError('Latitude must be between -180, 180')
