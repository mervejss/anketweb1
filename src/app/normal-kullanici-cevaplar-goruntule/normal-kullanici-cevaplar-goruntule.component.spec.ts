import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NormalKullaniciCevaplarGoruntuleComponent } from './normal-kullanici-cevaplar-goruntule.component';

describe('NormalKullaniciCevaplarGoruntuleComponent', () => {
  let component: NormalKullaniciCevaplarGoruntuleComponent;
  let fixture: ComponentFixture<NormalKullaniciCevaplarGoruntuleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NormalKullaniciCevaplarGoruntuleComponent]
    });
    fixture = TestBed.createComponent(NormalKullaniciCevaplarGoruntuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
