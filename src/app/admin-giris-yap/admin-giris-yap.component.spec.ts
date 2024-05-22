import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminGirisYapComponent } from './admin-giris-yap.component';

describe('AdminGirisYapComponent', () => {
  let component: AdminGirisYapComponent;
  let fixture: ComponentFixture<AdminGirisYapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminGirisYapComponent]
    });
    fixture = TestBed.createComponent(AdminGirisYapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
