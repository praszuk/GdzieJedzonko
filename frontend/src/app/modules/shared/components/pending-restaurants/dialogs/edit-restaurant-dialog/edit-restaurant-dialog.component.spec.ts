import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRestaurantDialogComponent } from './edit-restaurant-dialog.component';

describe('EditRestaurantDialogComponent', () => {
  let component: EditRestaurantDialogComponent;
  let fixture: ComponentFixture<EditRestaurantDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditRestaurantDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRestaurantDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
