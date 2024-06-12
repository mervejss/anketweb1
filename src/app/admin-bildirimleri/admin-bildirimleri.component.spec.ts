import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBildirimleriComponent } from './admin-bildirimleri.component';

describe('AdminBildirimleriComponent', () => {
  let component: AdminBildirimleriComponent;
  let fixture: ComponentFixture<AdminBildirimleriComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminBildirimleriComponent]
    });
    fixture = TestBed.createComponent(AdminBildirimleriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
