import { Component, OnInit } from '@angular/core';
import { SurveyService } from '../services/survey.service';
import { MatDialog } from '@angular/material/dialog';
import { SurveyDialogComponent } from '../survey-dialog/survey-dialog.component';
import { AdminService } from '../services/admin.service';
import { QuestionDialogComponent } from '../question-dialog/question-dialog.component';

@Component({
  selector: 'app-admin-anket-ekle-duzenle',
  templateUrl: './admin-anket-ekle-duzenle.component.html',
  styleUrls: ['./admin-anket-ekle-duzenle.component.scss']
})
export class AdminAnketEkleDuzenleComponent implements OnInit {
  surveys: any[] = [];
  aktifSayfa: string = ''; // Aktif sayfa bilgisini tutacak değişken
  tiklananAnketId: number | null = null; // Tıklanan anketin ID'sini saklayacak değişken
  adminData: any;
  adminId: number = 5; // Varsayılan admin ID

  constructor(private _auth: AdminService,private surveyService: SurveyService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getSurveys();
    this.adminData = this._auth.getAdminData();
    this.adminId= this.adminData.id ;

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
  openDialog(): void {
    const dialogRef = this.dialog.open(SurveyDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Anket Adı:', result);
        // Yeni anketi oluşturmak için bir servisi burada çağırabilirsiniz
        this.anketOlustur(result,);
      }
    });
  }

  anketOlustur(anketAdi: any) {
    console.log('this.adminData.adminId', this.adminId);
    
    this.surveyService.createSurvey(anketAdi, this.adminId)
      .subscribe(
        (response) => {
          console.log('Anket oluşturuldu:', response);
          alert(`"${anketAdi}" isimli anket ADMIN ID: "${this.adminId}" admin tarafından başarıyla oluşturuldu!`);
          // İsteğin başarılı bir şekilde tamamlandığında burada ilgili işlemleri yapabilirsiniz
        },
        (error) => {
          console.error('Anket oluşturulurken bir hata oluştu:', error);
          // Hata durumunda burada ilgili işlemleri yapabilirsiniz
        }
      );
  }

  openQuestionDialog(surveyId: number): void {
    const dialogRef = this.dialog.open(QuestionDialogComponent, {
      data: { surveyId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Anket Sorusu:', result);
        this.soruEkle(result);
      }
    });
  }

  soruEkle(questionData: any): void {
    console.log('Soru Ekleniyor:', questionData);
    this.anketSorusuOlustur(questionData.surveyId, questionData.content, questionData.type);
  }

  anketSorusuOlustur(surveyId: any, content: any, type: any): void {
    this.surveyService.createQuestion(surveyId, content, type).subscribe(
      response => {
        console.log('Soru oluşturuldu:', response);
        alert(`"${content}" içeriği ile "${type}" tipinde soru anket ID: "${surveyId}" için başarıyla eklendi!`);
      },
      error => {
        console.error('Soru oluşturulurken bir hata oluştu:', error);
      }
    );
  }

}
