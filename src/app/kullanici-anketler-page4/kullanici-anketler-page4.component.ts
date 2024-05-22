import { Component, OnInit } from '@angular/core';
import { SurveyService } from '../services/survey.service';
import { DomSanitizer } from '@angular/platform-browser';
import { NormalKullaniciService } from '../services/normal-kullanici.service';

@Component({
  selector: 'app-kullanici-anketler-page4',
  templateUrl: './kullanici-anketler-page4.component.html',
  styleUrls: ['./kullanici-anketler-page4.component.scss']
})
export class KullaniciAnketlerPage4Component implements OnInit{
  constructor(private surveyService: SurveyService, public sanitizer: DomSanitizer, private _normalKullaniciAuth: NormalKullaniciService) { }

  dorduncuAsamaVideoUrl: any;
  dorduncuAsamaBilgilendirmeMetni: any;
  normalKullaniciData: any;

  ngOnInit(): void {
    // localStorage'dan veriyi çek
    this.dorduncuAsamaVideoUrl=this.surveyService.getDorduncuAsamaVideoUrl();
    console.log('GET dorduncuAsamaVideoUrl : ', this.dorduncuAsamaVideoUrl);
    this.dorduncuAsamaBilgilendirmeMetni= this.surveyService.getDorduncuAsamaBilgilendirmeMetni();
    this.normalKullaniciData = this._normalKullaniciAuth.getUserData();
    this.logUserActivityPhaseChange(this.normalKullaniciData.id, 4); // örnek olarak stage 1

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
