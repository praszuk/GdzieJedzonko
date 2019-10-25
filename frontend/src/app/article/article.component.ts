import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {
  id: string;
  title: string;
  text: string;
  creationDate;
  tags: string [];
  subsription: any;
  constructor(private Activatedroute: ActivatedRoute) { }

  ngOnInit() {
    this.testValues();
    this.subsription = this.Activatedroute.paramMap.subscribe( params => {
      this.id = params.get('id');
      }
    );
  }

  ngOnDestroy() {
    this.subsription.unsubscribe();
  }

  testValues() {
    this.title = 'Test title';
    // tslint:disable-next-line:max-line-length
    this.text = ' Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec aliquet vel ligula vitae bibendum. Nam eu magna tincidunt, congue elit a, rhoncus est. Suspendisse ac libero odio. Quisque odio tortor, volutpat vitae justo vulputate, volutpat suscipit ex. Sed ac aliquet mi, ac porta erat. Aliquam condimentum nulla sit amet erat tempor, at consectetur est gravida. Nullam at lacus elit. Maecenas lacinia risus eros, nec consectetur dui varius nec. In sit amet molestie eros, at ornare purus. Cras non libero eros. Aenean tempus porttitor mauris, ut cursus augue congue vel. Vivamus viverra efficitur ante, nec dapibus nisi condimentum nec. Aliquam eget finibus massa, ut ullamcorper odio. Cras eget ex et urna semper maximus blandit sit amet nunc. Praesent sit amet euismod metus.\n' +
      '\n' +
      // tslint:disable-next-line:max-line-length
      'Suspendisse orci leo, laoreet nec ornare vitae, volutpat sit amet erat. Aenean ac magna laoreet, pellentesque diam eget, interdum mi. Cras sed eleifend neque. Nam sit amet eros sit amet lacus semper malesuada. Vestibulum a ante non lorem maximus rhoncus non ut risus. Etiam pellentesque neque non est dictum, non facilisis dui vestibulum. Praesent lobortis, urna vitae condimentum egestas, ipsum lacus viverra turpis, commodo cursus turpis sem non tellus. Duis placerat leo et diam sollicitudin malesuada. Suspendisse tempus accumsan aliquam. Maecenas nunc nisi, malesuada vel lorem nec, accumsan varius felis. Nam iaculis eros vitae imperdiet volutpat. Suspendisse orci sem, aliquet sit amet congue nec, euismod id nulla. Vestibulum scelerisque quam ultricies ligula mattis, vitae posuere mauris gravida. Aenean gravida facilisis arcu, ut venenatis lacus luctus nec. Sed vel euismod dui. Etiam turpis magna, volutpat vitae mollis et, rutrum non ';
    this.creationDate = '2019-10-25';
    this.tags = ['one', 'two', 'three'];
  }

}
