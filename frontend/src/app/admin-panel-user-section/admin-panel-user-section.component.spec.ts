import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPanelUserSectionComponent } from './admin-panel-user-section.component';

describe('AdminPanelUserSelectionComponent', () => {
  let component: AdminPanelUserSectionComponent;
  let fixture: ComponentFixture<AdminPanelUserSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminPanelUserSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPanelUserSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
