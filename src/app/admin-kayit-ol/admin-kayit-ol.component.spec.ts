import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminKayitOlComponent } from './admin-kayit-ol.component';

describe('AdminKayitOlComponent', () => {
  let component: AdminKayitOlComponent;
  let fixture: ComponentFixture<AdminKayitOlComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminKayitOlComponent]
    });
    fixture = TestBed.createComponent(AdminKayitOlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
