import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AdminService } from '../services/admin.service';
import { SurveyService } from '../services/survey.service';
import { OptionDialogComponent } from '../option-dialog/option-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { UpdateDialogComponent } from '../update-dialog/update-dialog.component';
import { UpdateOptionDialogComponent } from '../update-option-dialog/update-option-dialog.component';

@Component({
  selector: 'app-admin-anketler-page1',
  templateUrl: './admin-anketler-page1.component.html',
  styleUrls: ['./admin-anketler-page1.component.scss']
})
export class AdminAnketlerPage1Component implements OnInit {
  @Input() tiklananAnketId: number | null = null; // Tıklanan anketin ID'sini tutacak değişken

  questionData: any[] = [];
  questionOptionData: any[] = [];
  
  constructor(private http: HttpClient, private router: Router, private _auth: AdminService,private surveyService: SurveyService, public dialog: MatDialog) { }

  ngOnInit(): void {
    
  }

  openUpdateOptionDialog(option: any): void {
    console.log('Güncellenmiş Anket Sorusu Seçeneği option.option_text :', option.option_text);
    console.log(' Anket Sorusu Seçeneği option.question_id :', option.question_id);
    console.log(' Anket Sorusu Seçeneği option.content :', option.option_text);
    console.log(' Anket Sorusu Seçeneği option.letter :', option.option_letter);
    console.log(' Anket Sorusu Seçeneği option.status :', option.is_correct);
    console.log('this.tiklananAnketId :', this.tiklananAnketId);
  
    const dialogRef = this.dialog.open(UpdateOptionDialogComponent, {
      data: option
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Güncellenmiş Anket Sorusu Seçeneği:', result);
        this.updateOption(result);
      }
    });
  }
  updateOption(updatedOptionData: any): void {
    console.log('Anket Sorusu Seçeneği Güncelleniyor:', updatedOptionData);
    this.soruSecenegiGuncelle(
      updatedOptionData.questionId,
      updatedOptionData.optionId,
      updatedOptionData.content,
      updatedOptionData.letter,
      updatedOptionData.status
    );
  }
  
  soruSecenegiGuncelle(questionId: any, optionId: any, content: any, letter: any, status: any) {
    if(status=="Yanlış")
      {
        
        status=false;
      }
      else 
        {
          status=true;
          
        }
    this.surveyService.updateQuestionOption(optionId, questionId, content, letter, status)
      .subscribe(
        (response) => {
          console.log('Soru seçeneği güncellendi:', response);
          alert('Soru seçeneği başarıyla güncellendi!');
        },
        (error) => {
          console.error('Soru seçeneği güncellenirken bir hata oluştu:', error);
          alert('Soru seçeneği güncellenirken bir hata oluştu.');
        }
      );
  }

  openUpdateDialog(question: any): void {
    console.log('Güncellenmiş Anket Sorusu:', question.question_text);

    const dialogRef = this.dialog.open(UpdateDialogComponent, {
      data: question
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Güncellenmiş Anket Sorusu:', result);
        this.updateQuestion(result);
      }
    });
  }
  
  updateQuestion(updatedQuestionData: any): void {
    console.log('Anket Sorusu Güncelleniyor:', updatedQuestionData);
    this.anketSorusuGuncelle(updatedQuestionData.questionId,this.tiklananAnketId,updatedQuestionData.content,updatedQuestionData.type)
  }
  anketSorusuGuncelle(questionId: any, surveyId: any, content: any, type: any) {
    this.surveyService.updateQuestion(questionId, surveyId, content, type)
      .subscribe(
        (response) => {
          console.log('Soru güncellendi:', response);
          // İsteğin başarılı bir şekilde tamamlandığında burada ilgili işlemleri yapabilirsiniz
          alert('Soru başarıyla güncellendi!');
        },
        (error) => {
          console.error('Soru güncellenirken bir hata oluştu:', error);
          // Hata durumunda burada ilgili işlemleri yapabilirsiniz
          alert('Soru güncellenirken bir hata oluştu.');
        }
      );
  }

  openOptionDialog(questionId: number): void {
    const dialogRef = this.dialog.open(OptionDialogComponent, {
      data: { questionId }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Anket Sorusu Seçeneği:', result);
        this.optionEkle(result);
      }
    });
  }
  
  optionEkle(optionData: any): void {
    console.log('Anket Sorusu Seçeneği Ekleniyor:', optionData);
    console.log('optionData.questionId:', optionData.questionId);
    console.log('optionData.content:', optionData.content);
    console.log('optionData.letter:', optionData.letter);
    console.log('optionData.status:', optionData.status);


    this.soruSecenegiOlustur(optionData.questionId, optionData.content, optionData.letter, optionData.status);
  }
  
  soruSecenegiOlustur(questionId: any, soruSecenekIcerigi: any, soruSecenekSikki: any, soruSecenekDurumu: any) {
    console.log('soruSecenegiOlustur:');
    
    console.log('questionId:', questionId);
    console.log('soruSecenekIcerigi:', soruSecenekIcerigi);
    console.log('soruSecenekSikki:', soruSecenekSikki);
    console.log('soruSecenekDurumu:', soruSecenekDurumu);
    if(soruSecenekDurumu=="Yanlış")
      {
        
        soruSecenekDurumu=false;
      }
      else 
        {
        soruSecenekDurumu=true;
          
        }
    console.log('soruSecenekDurumu:', soruSecenekDurumu);

    this.surveyService.createQuestionOption(questionId, soruSecenekIcerigi, soruSecenekSikki, soruSecenekDurumu)
      .subscribe(
        (response) => {
          console.log('Soru seçeneği oluşturuldu:', response);
          alert('Soru seçeneği başarıyla oluşturuldu!');
          // Refresh question options
          this.getQuestionOptionsForQuestions();
        },
        (error) => {
          console.error('Soru seçeneği oluşturulurken bir hata oluştu:', error);
        }
      );
  }
  
  deleteOption(optionId: number): void {
    if (confirm('Bu seçeneği silmek istediğinize emin misiniz?')) {
      this.surveyService.deleteQuestionOption(optionId).subscribe(
        () => {
          // Silme işlemi başarılı olduğunda questionOptionData listesinden de ilgili seçeneği kaldır
          this.questionOptionData = this.questionOptionData.filter(option => option.id !== optionId);
          console.log('Seçenek başarıyla silindi.');
          this.getQuestionOptionsForQuestions();

        },
        error => {
          console.error('Seçenek silinirken hata oluştu:', error);
        }
      );
    }
  }
  
  deleteQuestion(questionId: number): void {
    if (confirm('Bu soruyu silmek istediğinize emin misiniz?')) {
      this.surveyService.deleteQuestion(questionId).subscribe(
        () => {
          // Silme işlemi başarılı olduğunda questionData listesinden de ilgili soruyu kaldır
          this.questionData = this.questionData.filter(question => question.id !== questionId);
          console.log('Soru başarıyla silindi.');
        },
        error => {
          console.error('Soru silinirken hata oluştu:', error);
        }
      );
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tiklananAnketId'] && changes['tiklananAnketId'].currentValue !== changes['tiklananAnketId'].previousValue) {
      // Anket ID'si değiştiğinde sadece bu blok çalışır
          // Soru ve seçenek verilerini temizle

      this.clearDataAndReload();
          // Soru ve seçenekleri yeniden yükle

      this.getQuestions();
    }
  }
  

  editQuestion(): void {
    console.log("ICONA TIKLANDIIII !!");

  }

  clearDataAndReload(): void {
    // Soru ve seçenek verilerini temizle
    this.questionData = [];
    this.questionOptionData = [];
   
  }

  getQuestions() {
    this._auth.getQuestions(this.tiklananAnketId!)
        .subscribe(
          (res: any) => {
            console.log("Soru verileri alındı", res);

                this.questionData = res;
                this.getQuestionOptionsForQuestions();
            },
            err => console.log("Soru verileri alınamadı", err)
        );
}

  getQuestionOptionsForQuestions() {
    if (this.questionData && this.questionData.length > 0) {
      for (const question of this.questionData) {
        this.getQuestionOptions(question);
      }
    } else {
      console.log("Soru verileri bulunamadı veya boş.");
    }
  }

  getQuestionOptions(question: any) {
    this._auth.getQuestionOptions(question.id)
    .subscribe(
        (res: any) => {
          console.log("Seçenek verileri alındı", res);
          console.log("SURVEYYYYYYYYYYYYYYY IDDDDDDD :::: ", this.tiklananAnketId);

          // Her bir sorunun seçeneklerini ilgili diziye ekleyin
          this.questionOptionData.push({ questionId: question.id, options: res });
        },
        err => console.log("Seçenek verileri alınamadı", err)
    );
  }  
}