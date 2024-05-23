import { Component, OnInit } from '@angular/core';
import { SurveyService } from '../services/survey.service';
import { DomSanitizer } from '@angular/platform-browser';
import { NormalKullaniciService } from '../services/normal-kullanici.service';

@Component({
  selector: 'app-kullanici-anketler-page3',
  templateUrl: './kullanici-anketler-page3.component.html',
  styleUrls: ['./kullanici-anketler-page3.component.scss']
})
export class KullaniciAnketlerPage3Component implements OnInit {
  constructor(private surveyService: SurveyService, public sanitizer: DomSanitizer, private _normalKullaniciAuth: NormalKullaniciService) { }

  normalKullaniciData: any;

  ucuncuAsamaVideoUrl: any;
  ucuncuAsamaBilgilendirmeMetni: any;
  ngOnInit(): void {
    // localStorage'dan veriyi çek
    this.ucuncuAsamaVideoUrl= this.surveyService.getUcuncuAsamaVideoUrl();
    console.log('GET ucuncuAsamaVideoUrl : ', this.ucuncuAsamaVideoUrl);
    this.ucuncuAsamaBilgilendirmeMetni= this.surveyService.getUcuncuAsamaBilgilendirmeMetni();
    this.normalKullaniciData = this._normalKullaniciAuth.getUserData();
    this.logUserActivityPhaseChange(this.normalKullaniciData.id, 3); // örnek olarak stage 1

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
}
