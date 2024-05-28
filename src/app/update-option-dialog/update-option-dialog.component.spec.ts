import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateOptionDialogComponent } from './update-option-dialog.component';

describe('UpdateOptionDialogComponent', () => {
  let component: UpdateOptionDialogComponent;
  let fixture: ComponentFixture<UpdateOptionDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateOptionDialogComponent]
    });
    fixture = TestBed.createComponent(UpdateOptionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
