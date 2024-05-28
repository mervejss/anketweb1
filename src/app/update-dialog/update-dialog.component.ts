import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-update-dialog',
  templateUrl: './update-dialog.component.html',
})
export class UpdateDialogComponent {
  updatedQuestionContent: string = '';
  updatedQuestionType: string = '';

  constructor(
    public dialogRef: MatDialogRef<UpdateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public question: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  updateQuestion(): void {
    const updatedQuestionData = {
      surveyId: this.question.surveyId,
      questionId: this.question.id,
      content: this.updatedQuestionContent,
      type: this.updatedQuestionType
    };
    this.dialogRef.close(updatedQuestionData);
  }
}
