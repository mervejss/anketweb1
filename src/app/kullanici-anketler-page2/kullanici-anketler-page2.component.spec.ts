import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KullaniciAnketlerPage2Component } from './kullanici-anketler-page2.component';

describe('KullaniciAnketlerPage2Component', () => {
  let component: KullaniciAnketlerPage2Component;
  let fixture: ComponentFixture<KullaniciAnketlerPage2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KullaniciAnketlerPage2Component]
    });
    fixture = TestBed.createComponent(KullaniciAnketlerPage2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
