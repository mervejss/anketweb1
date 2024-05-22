import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-admin-anketler-page1',
  templateUrl: './admin-anketler-page1.component.html',
  styleUrls: ['./admin-anketler-page1.component.scss']
})
export class AdminAnketlerPage1Component implements OnInit {
  @Input() tiklananAnketId: number | null = null; // Tıklanan anketin ID'sini tutacak değişken

  questionData: any[] = [];
  questionOptionData: any[] = [];
  
  constructor(private http: HttpClient, private router: Router, private _auth: AdminService) { }

  ngOnInit(): void {
    
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