import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GirisYapComponent } from './giris-yap.component';

describe('GirisYapComponent', () => {
  let component: GirisYapComponent;
  let fixture: ComponentFixture<GirisYapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GirisYapComponent]
    });
    fixture = TestBed.createComponent(GirisYapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
