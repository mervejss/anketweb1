import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KullaniciAnketlerPage1Component } from './kullanici-anketler-page1.component';

describe('KullaniciAnketlerPage1Component', () => {
  let component: KullaniciAnketlerPage1Component;
  let fixture: ComponentFixture<KullaniciAnketlerPage1Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KullaniciAnketlerPage1Component]
    });
    fixture = TestBed.createComponent(KullaniciAnketlerPage1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
