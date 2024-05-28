import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionDialogComponent } from './option-dialog.component';

describe('OptionDialogComponent', () => {
  let component: OptionDialogComponent;
  let fixture: ComponentFixture<OptionDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OptionDialogComponent]
    });
    fixture = TestBed.createComponent(OptionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
