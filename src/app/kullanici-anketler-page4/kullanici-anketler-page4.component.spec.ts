import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KullaniciAnketlerPage4Component } from './kullanici-anketler-page4.component';

describe('KullaniciAnketlerPage4Component', () => {
  let component: KullaniciAnketlerPage4Component;
  let fixture: ComponentFixture<KullaniciAnketlerPage4Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KullaniciAnketlerPage4Component]
    });
    fixture = TestBed.createComponent(KullaniciAnketlerPage4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
