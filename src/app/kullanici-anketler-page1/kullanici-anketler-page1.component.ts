import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AdminService } from '../services/admin.service';
import { SurveyService } from '../services/survey.service'; // SurveyService eklendi
import { NormalKullaniciService } from '../services/normal-kullanici.service';

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

    console.log(" ngOnInit() ÇALIŞTI VE secilenAnketId=>>>> " ,this.birinciAsamaSecilenAnketId )
    this.birinciAsamaSecilenAnketId= this.surveyService.getBirinciAsamaSecilecekAnketId();
    this.normalKullaniciData = this._normalKullaniciAuth.getUserData();
    this.logUserActivityPhaseChange(this.normalKullaniciData.id, 1); // örnek olarak stage 1
    this.getQuestions();
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
        this.saveUserSurveyAnswers(Number(questionId), optionId);
      }
    }
  }
  
  saveUserSurveyAnswers(questionId: number, questionOptionId: number) {
    // Kullanıcının anket cevaplarını kaydetmek için SurveyService'i kullan
    this.surveyService.saveUserSurveyAnswers(this.normalKullaniciData.id, this.birinciAsamaSecilenAnketId,  questionId,  questionOptionId).subscribe(
      (response) => {
        console.log('User survey answers saved successfully:', response);
        // Başka bir işlem yapılabilir, örneğin kullanıcıyı başka bir sayfaya yönlendirebilirsiniz
      },
      (error) => {
        console.error('Error saving user survey answers:', error);
        // Hata durumunda kullanıcıya uygun bir mesaj gösterilebilir
      }
    );
  }


  getQuestions() {
    console.log("getQuestions() ÇALIŞTI VE secilenAnketId=>>>> " ,this.birinciAsamaSecilenAnketId )
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


/*
  saveAnswer(questionId: number, optionId: number) {
    console.log("Question ID:", questionId);
    console.log("Option ID:", optionId);
  
    // Eğer daha önce bu soru için cevap verildiyse ve cevap değiştiyse updateUserSurveyAnswers çağrılır
    if (this.selectedAnswers.hasOwnProperty(questionId) && this.selectedAnswers[questionId] !== optionId) {
      console.log("Cevap değişti, updateUserSurveyAnswers çağrılıyor");
      this.updateUserSurveyAnswers(questionId, optionId);
    } else {
      console.log("Cevap değişmedi veya daha önce cevaplanmamış, saveUserSurveyAnswers çağrılıyor");
      this.saveUserSurveyAnswers(questionId, optionId);
    }
  
    // Seçilen cevabı kaydet
    this.selectedAnswers[questionId] = optionId;
    console.log("Selected Answers:", this.selectedAnswers);
  }
  
  saveUserSurveyAnswers(questionId: number, questionOptionId: number) {
    // Kullanıcının anket cevaplarını kaydetmek için SurveyService'i kullan
    this.surveyService.saveUserSurveyAnswers(this.normalKullaniciData.id, this.birinciAsamaSecilenAnketId,  questionId,  questionOptionId).subscribe(
      (response) => {
        console.log('User survey answers saved successfully:', response);
        // Başka bir işlem yapılabilir, örneğin kullanıcıyı başka bir sayfaya yönlendirebilirsiniz
      },
      (error) => {
        console.error('Error saving user survey answers:', error);
        // Hata durumunda kullanıcıya uygun bir mesaj gösterilebilir
      }
    );
  }
  
  
  updateUserSurveyAnswers(questionId: number, optionId: number) {
    // Kullanıcının anket cevaplarını güncellemek için SurveyService'i kullan
    this.surveyService.updateUserSurveyAnswers(this.normalKullaniciData.id, this.birinciAsamaSecilenAnketId, questionId, optionId).subscribe(
      (response) => {
        console.log('User survey answers updated successfully:', response);
        // Başka bir işlem yapılabilir, örneğin kullanıcıyı başka bir sayfaya yönlendirebilirsiniz
      },
      (error) => {
        console.error('Error updating user survey answers:', error);
        // Hata durumunda kullanıcıya uygun bir mesaj gösterilebilir
      }
    );
  }*/
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
 
  
  
}
