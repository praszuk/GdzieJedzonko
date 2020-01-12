import {Component, Input, OnInit} from '@angular/core';
import {latLng, tileLayer, Map} from 'leaflet';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  @Input() coordinates;
  lat: number;
  lon: number;
  map: Map;

  options = {
    layers: [
      tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
      })
    ],
    zoom: 15,
    center: latLng([52.229958, 21.012008])
  };

  constructor(private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    if (this.coordinates) {
      this.lat = this.coordinates.lat;
      this.lon = this.coordinates.lon;
      this.map.flyTo(latLng(this.lat, this.lon));
    } else {
      this.getLocation();
    }
  }

  getLocation() {
    if (window.navigator && window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(
        position => {
          console.log(position);
          this.map.flyTo(latLng(position.coords.latitude, position.coords.longitude));
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

  onMapReady(map: L.Map) {
    this.map = map;
  }

}
