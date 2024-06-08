import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AdminService } from '../services/admin.service';
import { SurveyService } from '../services/survey.service'; // SurveyService eklendi
import { NormalKullaniciService } from '../services/normal-kullanici.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-kullanici-anketler-page1',
  templateUrl: './kullanici-anketler-page1.component.html',
  styleUrls: ['./kullanici-anketler-page1.component.scss']
})
export class KullaniciAnketlerPage1Component implements OnInit {

  birinciAsamaSecilenAnketId:any;
  normalKullaniciData: any;

  questionData: any[] = [];
  questionOptionData: any[] = [];

  constructor(private http: HttpClient, private router: Router, private _auth: AdminService, private surveyService: SurveyService, private _normalKullaniciAuth: NormalKullaniciService) { } // SurveyService eklendi

  ngOnInit() {
    console.log(" ngOnInit() ÇALIŞTI VE secilenAnketId=>>>> ", this.birinciAsamaSecilenAnketId)
    this.birinciAsamaSecilenAnketId = this.surveyService.getBirinciAsamaSecilecekAnketId();
    this.normalKullaniciData = this._normalKullaniciAuth.getUserData();
    this.logUserActivityPhaseChange(this.normalKullaniciData.id, 1); // örnek olarak stage 1
    this.getQuestions();
    this.loadSelectedAnswers(); // Load selected answers on init

    console.log("Selected Answers:", this.selectedAnswers);
  }
  loadSelectedAnswers() {
    this.surveyService.getUserSurveyAnswersBefore(this.normalKullaniciData.id, this.birinciAsamaSecilenAnketId)
      .subscribe(
        (res: any) => {
          console.log("User survey answers loaded", res);
          res.forEach((answer: any) => {
            this.selectedAnswers[answer.question_id] = answer.question_option_id;
          });
        },
        err => console.error("Error loading user survey answers", err)
      );
  }
  getQuestions() {
    console.log("getQuestions() ÇALIŞTI VE secilenAnketId=>>>> ", this.birinciAsamaSecilenAnketId)
    this._auth.getQuestions(this.birinciAsamaSecilenAnketId!)
      .subscribe(
        (res: any) => {
          console.log("Soru verileri alındı", res);
          this.questionData = res;
          this.getQuestionOptionsForQuestions();
        },
        err => console.log("Soru verileri alınamadı", err)
      );
  }
  
 
  logUserActivityPhaseChange(id: any, stage: number) {
    const activityLog = {
      user_id: id,
      stage: stage,
      
    };

    this._normalKullaniciAuth.changeUserStage(activityLog).subscribe(
      (res: any) => {
        console.log('Activity logged or updated:', res);
      },
      error => {
        console.error('Error logging or updating activity:', error);
      }
    );
  }

  selectedAnswers: { [key: number]: number } = {};

  saveAnswer(questionId: number, optionId: number) {
    this.selectedAnswers[questionId] = optionId;
     
 console.log("Question ID:", questionId);
    console.log("Option ID:", optionId);
    console.log("Selected Answers:", this.selectedAnswers);
  }
  
  anketiTamamla() {
    for (const questionId in this.selectedAnswers) {
      if (this.selectedAnswers.hasOwnProperty(questionId)) {
        const optionId = this.selectedAnswers[questionId];
        // Önce varolan bir cevap var mı kontrol edelim
        this.checkAndUpdateUserSurveyAnswer(Number(questionId), optionId);

      }
    }
  }
  
  saveUserSurveyAnswers(questionId: number, questionOptionId: number) {
    // Kullanıcının anket cevaplarını kaydetmek için SurveyService'i kullan
    this.surveyService.saveUserSurveyAnswers(this.normalKullaniciData.id, this.birinciAsamaSecilenAnketId,  questionId,  questionOptionId).subscribe(
      (response) => {
        console.log('User survey answers saved successfully:', response);
        this.showSuccessAlert('Başarılı', 'Anket cevapları başarıyla kaydedildi.');

        // Başka bir işlem yapılabilir, örneğin kullanıcıyı başka bir sayfaya yönlendirebilirsiniz
      },
      (error) => {
        console.error('Error saving user survey answers:', error);
        // Hata durumunda kullanıcıya uygun bir mesaj gösterilebilir
      }
    );
  }

  checkAndUpdateUserSurveyAnswer(questionId: number, optionId: number) {
    // Kullanıcının daha önce bu soruya cevap verip vermediğini kontrol et
    this.surveyService.getUserSurveyAnswer(this.normalKullaniciData.id, this.birinciAsamaSecilenAnketId, questionId).subscribe(
      (response: any) => {
        if (response) {
          // Eğer cevap varsa, güncelleme yap
          this.updateUserSurveyAnswer(response.id, optionId);
        } else {
          // Eğer cevap yoksa, yeni cevap ekle
          this.saveUserSurveyAnswers(questionId, optionId);
        }
      },
      (error) => {
        console.error('Error checking user survey answer:', error);
      }
    );
  }

  updateUserSurveyAnswer(answerId: number, questionOptionId: number) {
  // Kullanıcının anket cevabını güncellemek için SurveyService'i kullan
  this.surveyService.updateUserSurveyAnswer(answerId, questionOptionId).subscribe(
    (response) => {
      console.log('User survey answer updated successfully:', response);
      this.showSuccessAlert('Başarılı', 'Anket cevapları başarıyla güncellendi.');

      // Başka bir işlem yapılabilir
    },
    (error) => {
      console.error('Error updating user survey answer:', error);
      // Hata durumunda kullanıcıya uygun bir mesaj gösterilebilir
    }
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
        console.log("SURVEYYYYYYYYYYYYYYY IDDDDDDD :::: ", this.birinciAsamaSecilenAnketId);

        // Her bir sorunun seçeneklerini ilgili diziye ekleyin
        this.questionOptionData.push({ questionId: question.id, options: res });
      },
      err => console.log("Seçenek verileri alınamadı", err)
  );
} 
 
  
sonrakiAsama() 
{
  this.birinciAsamayiTamamla();
}

birinciAsamayiTamamla()
{
  this.logUserActivityPhaseChange(this.normalKullaniciData.id, 2); // örnek olarak stage 1

  this._normalKullaniciAuth.setKullaniciAktifSayfa('kullanici-anketler-page2');
  console.log('1. AŞAMA TAMAMLA ! BUTONU ÇALIŞTIIII aktif sayfa ise : ',this._normalKullaniciAuth.getKullaniciAktifSayfa() )
  window.location.reload();
}
showSuccessAlert(title: string, message: string): void {
  Swal.fire({
    title: title,
    text: message,
    icon: 'success',
    confirmButtonText: 'Tamam'
  });
}

showErrorAlert(title: string, message: string): void {
  Swal.fire({
    title: title,
    text: message,
    icon: 'error',
    confirmButtonText: 'Tamam'
  });
}
}
