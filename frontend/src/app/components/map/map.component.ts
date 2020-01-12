import {Component, OnInit} from '@angular/core';
import {latLng, tileLayer, Map} from 'leaflet';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  xCord: number;
  yCord: number;
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
    this.getLocation();
  }

  getLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.xCord = position.coords.longitude;
          this.yCord = position.coords.latitude;
        },
        () => this.setDefaultGeoLocation());
    } else {
      this.setDefaultGeoLocation();
    }
  }

  onMapReady(map: L.Map) {
    this.map = map;
  }

  setDefaultGeoLocation() {
    // this.map.flyTo(latLng(this.xCord, this.yCord));
    this.snackBar.open('Nie udało się ustalić twojej lokalizacji.', '', {
      duration: 4000,
      panelClass: ['snack-bar-multiline']
    });
  }

}
