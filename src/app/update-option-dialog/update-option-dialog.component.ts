import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-update-option-dialog',
  templateUrl: './update-option-dialog.component.html',
})
export class UpdateOptionDialogComponent {
  updatedOptionContent: string = '';
  updatedOptionLetter: string = '';
  updatedOptionStatus: string = '';

  

  constructor(
    public dialogRef: MatDialogRef<UpdateOptionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public option: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  
  updateOption(): void {

    const updatedOptionData = {
      questionId: this.option.question_id,
      optionId: this.option.id,
      content: this.updatedOptionContent,
      letter: this.updatedOptionLetter,
      status: this.updatedOptionStatus
      
    };
    
    this.dialogRef.close(updatedOptionData);
  }
}