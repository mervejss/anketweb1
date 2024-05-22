import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KullaniciAnketlerPage5Component } from './kullanici-anketler-page5.component';

describe('KullaniciAnketlerPage5Component', () => {
  let component: KullaniciAnketlerPage5Component;
  let fixture: ComponentFixture<KullaniciAnketlerPage5Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KullaniciAnketlerPage5Component]
    });
    fixture = TestBed.createComponent(KullaniciAnketlerPage5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
