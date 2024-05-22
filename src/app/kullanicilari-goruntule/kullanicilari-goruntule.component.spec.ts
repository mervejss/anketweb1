import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KullanicilariGoruntuleComponent } from './kullanicilari-goruntule.component';

describe('KullanicilariGoruntuleComponent', () => {
  let component: KullanicilariGoruntuleComponent;
  let fixture: ComponentFixture<KullanicilariGoruntuleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KullanicilariGoruntuleComponent]
    });
    fixture = TestBed.createComponent(KullanicilariGoruntuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
