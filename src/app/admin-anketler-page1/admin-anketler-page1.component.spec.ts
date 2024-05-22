import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAnketlerPage1Component } from './admin-anketler-page1.component';

describe('AdminAnketlerPage1Component', () => {
  let component: AdminAnketlerPage1Component;
  let fixture: ComponentFixture<AdminAnketlerPage1Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminAnketlerPage1Component]
    });
    fixture = TestBed.createComponent(AdminAnketlerPage1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
