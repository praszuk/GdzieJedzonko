import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
@Component({
  selector: 'app-moderator-view',
  templateUrl: './moderator-view.component.html',
  styleUrls: ['./moderator-view.component.css']
})
export class ModeratorViewComponent implements OnInit {

  constructor(private location: Location) {
  }

  ngOnInit() {
  }

  previousPage() {
    this.location.back();
  }
}
