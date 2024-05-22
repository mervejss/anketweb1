import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRehberComponent } from './admin-rehber.component';

describe('AdminRehberComponent', () => {
  let component: AdminRehberComponent;
  let fixture: ComponentFixture<AdminRehberComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminRehberComponent]
    });
    fixture = TestBed.createComponent(AdminRehberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
