import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAnaSayfaComponent } from './admin-ana-sayfa.component';

describe('AdminAnaSayfaComponent', () => {
  let component: AdminAnaSayfaComponent;
  let fixture: ComponentFixture<AdminAnaSayfaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminAnaSayfaComponent]
    });
    fixture = TestBed.createComponent(AdminAnaSayfaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
