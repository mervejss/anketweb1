import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAnketEkleComponent } from './admin-anket-ekle.component';

describe('AdminAnketEkleComponent', () => {
  let component: AdminAnketEkleComponent;
  let fixture: ComponentFixture<AdminAnketEkleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminAnketEkleComponent]
    });
    fixture = TestBed.createComponent(AdminAnketEkleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
