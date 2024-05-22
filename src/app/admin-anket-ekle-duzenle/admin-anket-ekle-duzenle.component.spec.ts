import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAnketEkleDuzenleComponent } from './admin-anket-ekle-duzenle.component';

describe('AdminAnketEkleDuzenleComponent', () => {
  let component: AdminAnketEkleDuzenleComponent;
  let fixture: ComponentFixture<AdminAnketEkleDuzenleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminAnketEkleDuzenleComponent]
    });
    fixture = TestBed.createComponent(AdminAnketEkleDuzenleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
