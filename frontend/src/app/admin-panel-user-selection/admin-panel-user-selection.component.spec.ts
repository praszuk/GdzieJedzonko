import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPanelUserSelectionComponent } from './admin-panel-user-selection.component';

describe('AdminPanelUserSelectionComponent', () => {
  let component: AdminPanelUserSelectionComponent;
  let fixture: ComponentFixture<AdminPanelUserSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminPanelUserSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPanelUserSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
