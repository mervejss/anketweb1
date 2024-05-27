import { Component, OnInit } from '@angular/core';
import { SurveyService } from '../services/survey.service';

@Component({
  selector: 'app-admin-anket-ekle-duzenle',
  templateUrl: './admin-anket-ekle-duzenle.component.html',
  styleUrls: ['./admin-anket-ekle-duzenle.component.scss']
})
export class AdminAnketEkleDuzenleComponent implements OnInit {
  surveys: any[] = [];
  aktifSayfa: string = ''; // Aktif sayfa bilgisini tutacak değişken
  tiklananAnketId: number | null = null; // Tıklanan anketin ID'sini saklayacak değişken

  constructor(private surveyService: SurveyService) { }

  ngOnInit(): void {
    this.getSurveys();
  }

  deleteSurvey(surveyId: number): void {
    if (confirm('Bu ankete ait tüm verileri silmek istediğinize emin misiniz?')) {
      // SurveyService üzerinden ilgili anketi silme işlemi yapılmalı
      this.surveyService.deleteSurvey(surveyId).subscribe(
        () => {
          // Silme işlemi başarılı olduğunda surveys listesinden de ilgili anketi kaldır
          this.surveys = this.surveys.filter(survey => survey.id !== surveyId);
          console.log('Anket başarıyla silindi.');
        },
        error => {
          console.error('Anket silinirken hata oluştu:', error);
        }
      );
    }
  }

  getSurveys(): void {
    this.surveyService.getAllSurveys().subscribe(
      surveys => {
        this.surveys = surveys;
      },
      error => {
        console.error('Error fetching surveys:', error);
      }
    );
  }

  // Tıklanabilir anket containerları
  onSurveyClick(surveyId: number): void {
    this.tiklananAnketId = surveyId; // Tıklanan anketin ID'sini sakla
    console.log(this.tiklananAnketId);
    this.aktifSayfa = 'admin-anketler-page1'; // Aktif sayfayı güncelle
  }
  
}
