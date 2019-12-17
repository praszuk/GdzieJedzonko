import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPanelUsersComponent } from './admin-panel-users.component';

describe('AdminPanelUsersComponent', () => {
  let component: AdminPanelUsersComponent;
  let fixture: ComponentFixture<AdminPanelUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminPanelUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPanelUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
