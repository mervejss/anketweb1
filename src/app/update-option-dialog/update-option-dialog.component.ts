import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-update-option-dialog',
  templateUrl: './update-option-dialog.component.html',
  styleUrls: ['./update-option-dialog.component.scss']

})
export class UpdateOptionDialogComponent implements OnInit {
  updatedOptionContent: string = '';
  updatedOptionLetter: string = '';
  updatedOptionStatus: string = '';

  

  constructor(
    public dialogRef: MatDialogRef<UpdateOptionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public option: any
  ) {}

  ngOnInit(): void {
    // Bu kısım eklendi
    if (this.option.is_correct) {
      this.updatedOptionStatus = 'Doğru';
    } else {
      this.updatedOptionStatus = 'Yanlış';
    }
    this.updatedOptionContent = this.option.option_text;
    this.updatedOptionLetter = this.option.option_letter;

  }

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
