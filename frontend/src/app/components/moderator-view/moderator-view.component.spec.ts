import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeratorViewComponent } from './moderator-view.component';

describe('ModeratorViewComponent', () => {
  let component: ModeratorViewComponent;
  let fixture: ComponentFixture<ModeratorViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModeratorViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModeratorViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
