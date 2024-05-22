import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KullaniciAnketlerPage3Component } from './kullanici-anketler-page3.component';

describe('KullaniciAnketlerPage3Component', () => {
  let component: KullaniciAnketlerPage3Component;
  let fixture: ComponentFixture<KullaniciAnketlerPage3Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KullaniciAnketlerPage3Component]
    });
    fixture = TestBed.createComponent(KullaniciAnketlerPage3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
