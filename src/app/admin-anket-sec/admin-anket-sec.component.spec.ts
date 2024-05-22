import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAnketSecComponent } from './admin-anket-sec.component';

describe('AdminAnketSecComponent', () => {
  let component: AdminAnketSecComponent;
  let fixture: ComponentFixture<AdminAnketSecComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminAnketSecComponent]
    });
    fixture = TestBed.createComponent(AdminAnketSecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
