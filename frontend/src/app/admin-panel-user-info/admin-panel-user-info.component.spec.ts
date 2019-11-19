import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPanelUserInfoComponent } from './admin-panel-user-info.component';

describe('AdminPanelUserInfoComponent', () => {
  let component: AdminPanelUserInfoComponent;
  let fixture: ComponentFixture<AdminPanelUserInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminPanelUserInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPanelUserInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
