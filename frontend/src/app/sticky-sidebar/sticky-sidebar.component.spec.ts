import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StickySidebarComponent } from './sticky-sidebar.component';

describe('StickySidebarComponent', () => {
  let component: StickySidebarComponent;
  let fixture: ComponentFixture<StickySidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StickySidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StickySidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
