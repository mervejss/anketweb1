import { Component, OnInit } from '@angular/core';
import { SurveyService } from '../services/survey.service';
import { DomSanitizer } from '@angular/platform-browser';
import { NormalKullaniciService } from '../services/normal-kullanici.service';

// Component dosyanızda YouTube Iframe API'sını kullanma
declare var YT: any;
@Component({
  selector: 'app-kullanici-anketler-page3',
  templateUrl: './kullanici-anketler-page3.component.html',
  styleUrls: ['./kullanici-anketler-page3.component.scss']
})
export class KullaniciAnketlerPage3Component implements OnInit {
  constructor(private surveyService: SurveyService, public sanitizer: DomSanitizer, private _normalKullaniciAuth: NormalKullaniciService) { }

  normalKullaniciData: any;
  player: any;

  ucuncuAsamaVideoUrl: any;
  ucuncuAsamaBilgilendirmeMetni: any;
  ngOnInit(): void {
    // localStorage'dan veriyi çek
    this.ucuncuAsamaVideoUrl= this.surveyService.getUcuncuAsamaVideoUrl();
    console.log('GET ucuncuAsamaVideoUrl : ', this.ucuncuAsamaVideoUrl);
    this.ucuncuAsamaBilgilendirmeMetni= this.surveyService.getUcuncuAsamaBilgilendirmeMetni();
    this.normalKullaniciData = this._normalKullaniciAuth.getUserData();
    this.logUserActivityPhaseChange(this.normalKullaniciData.id, 3); // örnek olarak stage 1
    // YouTube player'i oluşturma
    this.player = new YT.Player('youtube-player', {
      events: {
        'onStateChange': this.onPlayerStateChange.bind(this)
      }
    });
  }

// Oynatıcı durumu değiştikçe bu fonksiyon çalışır
onPlayerStateChange(event: any) {
  if (event.data == YT.PlayerState.PLAYING) {
    // Oynatma başladığında yapılacak işlemler
    console.log("Oynatma başladı");
  } else if (event.data == YT.PlayerState.PAUSED) {
    // Duraklatıldığında yapılacak işlemler
    console.log("Duraklatıldı");

  } else if (event.data == YT.PlayerState.ENDED) {
    // Video sona erdiğinde yapılacak işlemler
    console.log("Video sona erdi");

  }
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
