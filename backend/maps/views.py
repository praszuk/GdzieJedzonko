import json
import requests

from django.conf import settings
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.views import Response


OSM_API_URL = 'https://nominatim.openstreetmap.org/search'


@api_view(['GET'])
def coordinates(request):
    address = request.query_params.get('address')
    if address:
        params = {
            'q': address,
            'format': 'json',
            'polygon': 0,
            'addressdetails': 0
        }
        headers = {'User-Agent': settings.USER_AGENT_API}
        response = requests.get(OSM_API_URL, params=params, headers=headers)

        try:
            data = json.loads(response.content)
            coordinates_data = {
                'lat': data[0]['lat'],
                'lon': data[0]['lon'],
            }
            return Response(coordinates_data, status.HTTP_200_OK)
        except IndexError:
            return Response({}, status.HTTP_404_NOT_FOUND)

        except ValueError:
            pass

    return Response({}, status.HTTP_400_BAD_REQUEST)
