import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  private aboutUs: string = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sodales congue lorem cursus lacinia. Maecenas dictum ut ipsum quis auctor. Praesent maximus blandit justo eu mollis. Integer lacus ligula, accumsan sit amet neque pharetra, sollicitudin placerat ex. Mauris vel posuere justo. Maecenas et commodo tortor. Cras faucib"
  contactPhone: string = "342-523-523";
  contactEmail: string = "contact@gdzieJedzonko.tk";
  constructor() { }

  ngOnInit() {
  }

}
