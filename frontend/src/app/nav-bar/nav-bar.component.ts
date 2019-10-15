import {Component, HostBinding, OnInit} from '@angular/core';
import {fromEvent} from "rxjs";
import {distinctUntilChanged, filter, map, pairwise, share, throttleTime} from "rxjs/operators";
import {animate, state, style, transition, trigger} from "@angular/animations";

enum Direction {
  Up = 'Up',
  Down = 'Down'
}

enum VisibilityState {
  Visible = 'visible',
  Hidden = 'hidden'
}

@Component({
  selector: 'nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
  animations: [
    trigger('toggle', [
      state(
        VisibilityState.Hidden,
        style({ opacity: 0, transform: 'translateY(-100%)' })
      ),
      state(
        VisibilityState.Visible,
        style({ opacity: 1, transform: 'translateY(0)' })
      ),
      transition('* => *', animate('200ms ease-in'))
    ])
  ]
})
export class NavBarComponent implements OnInit {
  loggedIn: boolean = false;
  username: string = 'Test username';
  private isVisible = true;
  constructor() { }

  ngOnInit() {

    /**
     * Hiding navbar when scrolling down.
      */
    const scroll$ = fromEvent(window, 'scroll').pipe(
      throttleTime(10) ,map(() => window.pageYOffset), pairwise(),
      map(([y1, y2]): Direction => (y2 < y1 ? Direction.Up : Direction.Down)),
      distinctUntilChanged(),
      share()
    );

    const scrollUp$ = scroll$.pipe(
      filter(direction => direction === Direction.Up)
    );

    const scrollDown$ = scroll$.pipe(
      filter(direction => direction === Direction.Down)
    );

    scrollUp$.subscribe(() => (this.isVisible = true));
    scrollDown$.subscribe(() => (this.isVisible = false));
  }

  @HostBinding('@toggle')
  get toggle(): VisibilityState {
    return this.isVisible ? VisibilityState.Visible : VisibilityState.Hidden;
  }

}
