import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-location-map-dialog',
  templateUrl: './location-map-dialog.component.html',
  styleUrls: ['./location-map-dialog.component.css']
})
export class LocationMapDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
  }

}
