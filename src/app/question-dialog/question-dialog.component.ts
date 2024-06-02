import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-question-dialog',
  templateUrl: './question-dialog.component.html',
  styleUrls: ['./question-dialog.component.scss']

})
export class QuestionDialogComponent {
  questionContent: string = '';
  questionType: string = 'Açık Uçlu';

  constructor(
    public dialogRef: MatDialogRef<QuestionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  addQuestion(): void {
    const questionData = {
      surveyId: this.data.surveyId,
      content: this.questionContent,
      type: this.questionType
    };
    this.dialogRef.close(questionData);
  }
}
