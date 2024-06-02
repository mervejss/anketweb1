import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-option-dialog',
  templateUrl: './option-dialog.component.html',
  styleUrls: ['./option-dialog.component.scss']

})
export class OptionDialogComponent {
  optionContent: string = '';
  optionLetter: string = '';
  optionStatus: string = 'Doğru';

  constructor(
    public dialogRef: MatDialogRef<OptionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  addOption(): void {
    const optionData = {
      questionId: this.data.questionId,
      content: this.optionContent,
      letter: this.optionLetter,
      status: this.optionStatus
    };
    this.dialogRef.close(optionData);
  }
}
