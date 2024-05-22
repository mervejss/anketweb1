import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NormalKullaniciAnaSayfaComponent } from './normal-kullanici-ana-sayfa.component';

describe('NormalKullaniciAnaSayfaComponent', () => {
  let component: NormalKullaniciAnaSayfaComponent;
  let fixture: ComponentFixture<NormalKullaniciAnaSayfaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NormalKullaniciAnaSayfaComponent]
    });
    fixture = TestBed.createComponent(NormalKullaniciAnaSayfaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
