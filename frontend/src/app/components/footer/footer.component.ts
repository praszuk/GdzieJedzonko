import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  aboutUs = 'Jesteśmy grupą informatyków, projektantów i przedsiębiorców. Naszym celem jest wspomożenie rozwoju' +
    ' branży gastronomicznej w Polsce i na świecie. Poprzez serwis „GdzieJedzonko”, chcemy zgromadzić ludzi, którzy mają' +
    ' zamiłowanie do ustawicznego ulepszania polskich restauracji. Wierzymy, że wspólnie jesteśmy w stanie zgromadzić' +
    ' społeczność, która istotnie przyczyni się do poprawy jakości rodzimych przedsiębiorstw gastronomicznych.';
  contactPhone = '342-523-523';
  contactEmail = 'contact@gdzieJedzonko.tk';

  constructor() {
  }

  ngOnInit() {
  }

}
