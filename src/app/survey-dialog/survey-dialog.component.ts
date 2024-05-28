import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-survey-dialog',
  templateUrl: './survey-dialog.component.html',
})
export class SurveyDialogComponent {
  surveyName: string = '';

  constructor(public dialogRef: MatDialogRef<SurveyDialogComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  createSurvey(): void {
    this.dialogRef.close(this.surveyName);
  }
}
