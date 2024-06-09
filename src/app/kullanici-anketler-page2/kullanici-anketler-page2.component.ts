import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AdminService } from '../services/admin.service';
import { SurveyService } from '../services/survey.service'; // SurveyService eklendi
import { NormalKullaniciService } from '../services/normal-kullanici.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-kullanici-anketler-page2',
  templateUrl: './kullanici-anketler-page2.component.html',
  styleUrls: ['./kullanici-anketler-page2.component.scss']
})
export class KullaniciAnketlerPage2Component {
  sonrakiAsama() {
    this.ikinciAsamayiTamamla();
  }

  ikinciAsamayiTamamla()
  {
      this.logUserActivityPhaseChange(this.normalKullaniciData.id, 3); // örnek olarak stage 1

      this._normalKullaniciAuth.setKullaniciAktifSayfa('kullanici-anketler-page3');
      console.log('2. AŞAMA TAMAMLA ! BUTONU ÇALIŞTIIII aktif sayfa ise : ',this._normalKullaniciAuth.getKullaniciAktifSayfa() )
      window.location.reload();
   }
  


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
    this.getUserSurveyOpenAnswers(); // Kullanıcı cevaplarını çek



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
        this.showSuccessAlert('Başarılı', 'Anket cevapları başarıyla güncellendi.');

        // Başka bir işlem yapılabilir, örneğin kullanıcıyı başka bir sayfaya yönlendirebilirsiniz
      },
      (error) => {
        console.error('Error saving user survey open answers:', error);
        // Hata durumunda kullanıcıya uygun bir mesaj gösterilebilir
      }
    );
  }
  getQuestions() {
    this._auth.getQuestions(this.ikinciAsamaSecilecekAnketId!).subscribe(
      (res: any) => {
        this.questionData = res;
        this.getQuestionOptionsForQuestions();
      },
      err => console.log('Soru verileri alınamadı', err)
    );
  }

  getQuestionOptionsForQuestions() {
    if (this.questionData && this.questionData.length > 0) {
      for (const question of this.questionData) {
        this.getQuestionOptions(question);
      }
    } else {
      console.log('Soru verileri bulunamadı veya boş.');
    }
  }

  getQuestionOptions(question: any) {
    this._auth.getQuestionOptions(question.id).subscribe(
      (res: any) => {
        this.questionOptionData.push({ questionId: question.id, options: res });
      },
      err => console.log('Seçenek verileri alınamadı', err)
    );
  }

  getUserSurveyOpenAnswers() {
    const userId = this.normalKullaniciData.id; // Kullanıcı kimliği
    const surveyId = this.ikinciAsamaSecilecekAnketId; // Anket kimliği
    
    this.surveyService.getUserSurveyOpenAnswers(userId, surveyId).subscribe(
      (response) => {
        console.log('Kullanıcı cevapları:', response);
        response.forEach((answer: any) => {
          // Cevabın hangi soruya ait olduğunu bul
          const question = this.questionData.find(q => q.id === answer.question_id);
          if (question && question.question_type === 'Açık Uçlu') {
            // Soru varsa ve açık uçlu ise, cevabı ilgili textarea alanına yerleştir
            this.answers[answer.question_id] = answer.answer;
          }
        });
      },
      (error) => {
        console.error('Kullanıcı cevapları alınamadı', error);
      }
    );
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
