import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KullaniciDetaylariComponent } from './kullanici-detaylari.component';

describe('KullaniciDetaylariComponent', () => {
  let component: KullaniciDetaylariComponent;
  let fixture: ComponentFixture<KullaniciDetaylariComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KullaniciDetaylariComponent]
    });
    fixture = TestBed.createComponent(KullaniciDetaylariComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
