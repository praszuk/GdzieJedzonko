import {Component, Input, OnInit} from '@angular/core';
import {latLng, tileLayer, Map, marker, icon, Layer, LayerGroup} from 'leaflet';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Restaurant} from '../../models/restaurant.model';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  @Input() coordinates;
  @Input() height: number;
  markerLayer: LayerGroup = new LayerGroup<any>();
  layerr: Layer = new Layer();
  lat: number;
  lon: number;
  map: Map;

  icon = {
    icon: icon({
      iconSize: [25, 41],
      iconAnchor: [13, 0],
      iconUrl: './node_modules/leaflet/dist/images/marker-icon.png',
      shadowUrl: './node_modules/leaflet/dist/images/marker-shadow.png'
    })
  };

  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      })
    ],
    zoom: 15,
    center: latLng([52.229958, 21.012008])
  };

  constructor(private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    if (this.coordinates) {
      this.lat = parseFloat(this.coordinates.lat);
      this.lon = parseFloat(this.coordinates.lon);
      this.map.flyTo(latLng(this.lat, this.lon));
    } else {
      this.getLocation();
    }
  }

  getLocation() {
    if (window.navigator && window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(
        position => {
          this.map.flyTo(latLng(position.coords.latitude, position.coords.longitude), 13);
        },
        error => {
          this.snackBar.open('Nie udało się ustalić twojej lokalizacji.', '', {
            duration: 4000,
            panelClass: ['snack-bar-multiline']
          });
        }
      );
    }
  }

  setLocation(lat: string, lon: string) {
    this.lat = Number(lat);
    this.lon = Number(lon);
    const position = latLng(this.lat, this.lon);
    this.map.flyTo(position);
    const markerPosition = marker(position, {
      icon: icon({
        iconSize: [25, 41],
        iconAnchor: [13, 41],
        shadowSize: [0, 0],
        iconUrl: 'marker-icon.png'
      })
    }).addTo(this.map);
    markerPosition.bindPopup('<b>Restaurant infromation!</b>');
  }


  goToLocation(lat: string, lon: string) {
    this.lat = Number(lat);
    this.lon = Number(lon);
    const position = latLng(this.lat, this.lon);
    this.map.flyTo(position, 13);
  }

  setRestaurantMarkers(restaurants: Restaurant[]) {
    this.markerLayer.clearLayers();
    restaurants.forEach(restaurant => {
      const position = latLng(Number(restaurant.lat), Number(restaurant.lon));
      const markerPosition = marker(position, {
        icon: icon({
          iconSize: [30, 46],
          iconAnchor: [13, 41],
          shadowSize: [0, 0],
          iconUrl: 'marker-icon.png'
        })
      }).addTo(this.markerLayer);

      markerPosition.bindPopup('<b>Restaurant infromation!</b>', {
        offset: [2, -15]
    });
    });
    this.markerLayer.addTo(this.map);
  }

  onMapReady(map: Map) {
    this.map = map;
  }

}
