import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AdminService } from '../services/admin.service';
import { SurveyService } from '../services/survey.service'; // SurveyService eklendi
import { NormalKullaniciService } from '../services/normal-kullanici.service';

@Component({
  selector: 'app-kullanici-anketler-page2',
  templateUrl: './kullanici-anketler-page2.component.html',
  styleUrls: ['./kullanici-anketler-page2.component.scss']
})
export class KullaniciAnketlerPage2Component {


  ikinciAsamaSecilecekAnketId: any;
  normalKullaniciData: any;

  questionData: any[] = [];
  questionOptionData: any[] = [];
  answers: { [key: number]: string } = {}; // Soru ID'lerini anahtar olarak kullanarak metinleri saklamak için

  constructor(private http: HttpClient, private router: Router, private _auth: AdminService, private surveyService: SurveyService, private _normalKullaniciAuth: NormalKullaniciService) { } // SurveyService eklendi

  ngOnInit() {
    console.log(" ngOnInit() ÇALIŞTI VE secilenAnketId=>>>> " ,this.ikinciAsamaSecilecekAnketId )
    this.ikinciAsamaSecilecekAnketId= this.surveyService.getIkinciAsamaSecilecekAnketId();
    this.normalKullaniciData = this._normalKullaniciAuth.getUserData();
    this.logUserActivityPhaseChange(this.normalKullaniciData.id, 2); // örnek olarak stage 1


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
  anketCevaplariniKaydet(questionId: number, answer: string) 
  {
    this.answers[questionId] = answer;
  }
  anketiTamamla() 
  {
    console.log('Girilen Metinler:', this.answers);
    // Her soru için cevapları kaydet
  for (const questionId in this.answers) {
    if (this.answers.hasOwnProperty(questionId)) {
      const answer = this.answers[questionId];
      this.saveUserSurveyOpenAnswers(Number(questionId), answer);
    }
  }
  }


  saveUserSurveyOpenAnswers(questionId: number, answer: string) {
    // Kullanıcının anket cevaplarını kaydetmek için SurveyService'i kullan
    this.surveyService.saveUserSurveyOpenAnswers(this.normalKullaniciData.id, this.ikinciAsamaSecilecekAnketId,  questionId,  answer).subscribe(
      (response) => {
        console.log('User survey open answers saved successfully:', response);
        // Başka bir işlem yapılabilir, örneğin kullanıcıyı başka bir sayfaya yönlendirebilirsiniz
      },
      (error) => {
        console.error('Error saving user survey open answers:', error);
        // Hata durumunda kullanıcıya uygun bir mesaj gösterilebilir
      }
    );
  }
  getQuestions() {
    console.log("getQuestions() ÇALIŞTI VE secilenAnketId=>>>> " ,this.ikinciAsamaSecilecekAnketId )
    this._auth.getQuestions(this.ikinciAsamaSecilecekAnketId!)
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
        console.log("SURVEYYYYYYYYYYYYYYY IDDDDDDD :::: ", this.ikinciAsamaSecilecekAnketId);

        // Her bir sorunun seçeneklerini ilgili diziye ekleyin
        this.questionOptionData.push({ questionId: question.id, options: res });
      },
      err => console.log("Seçenek verileri alınamadı", err)
  );
} 
 
}
