import { Component, OnInit, OnDestroy } from '@angular/core';
import { SurveyService } from '../services/survey.service';
import { DomSanitizer } from '@angular/platform-browser';
import { NormalKullaniciService } from '../services/normal-kullanici.service';

declare var YT: any;

@Component({
  selector: 'app-kullanici-anketler-page4',
  templateUrl: './kullanici-anketler-page4.component.html',
  styleUrls: ['./kullanici-anketler-page4.component.scss']
})
export class KullaniciAnketlerPage4Component implements OnInit{
  constructor(private surveyService: SurveyService, public sanitizer: DomSanitizer, private _normalKullaniciAuth: NormalKullaniciService) { }

  dorduncuAsamaBilgilendirmeMetni: any;
  normalKullaniciData: any;
  dorduncuAsamaVideoUrls: string[] = [];

  players: any = {}; // players nesnesini başlatın
  interval: any;

  dorduncuAsamaVideoCurrentTime: any; // currentTime değişkeni


  ngOnInit(): void {
    // localStorage'dan veriyi çek
    this.dorduncuAsamaVideoUrls = this.surveyService.getDorduncuAsamaVideoUrls() || [];
    this.dorduncuAsamaBilgilendirmeMetni= this.surveyService.getDorduncuAsamaBilgilendirmeMetni();
    this.normalKullaniciData = this._normalKullaniciAuth.getUserData();
    this.logUserActivityPhaseChange(this.normalKullaniciData.id, 4); // örnek olarak stage 1
    this.dorduncuAsamaVideolariListele();

  }
  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
  dorduncuAsamaVideolariListele() {

    if (this.dorduncuAsamaVideoUrls.length === 0) {
        alert('Önceden yüklenmiş bir video bulunamadı!');
    } else {
        this.dorduncuAsamaVideoUrls.forEach((videoUrl, index) => {
            const playerId = 'dorduncu-player-' + index; // Her video için benzersiz playerId oluşturuluyor
            //this.initYouTubePlayer(videoUrl, playerId, this.ucuncuAsamaVideoCurrentTime);
            const videoId = this.extractYoutubeId(videoUrl);
            if (videoId) {
              const startTime = Math.floor(this.surveyService.getDorduncuAsamaVideoCurrentTime(videoId)); // her video için ayrı startTime
              this.initYouTubePlayer(videoUrl, playerId, startTime);
            }
            //this.initYouTubePlayer(videoUrl, playerId,15);
        });
    }
  }

  extractYoutubeId(url: string): string | null {
    const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    return (match && match[1]) ? match[1] : null;
  }

  initYouTubePlayer(videoUrl: string, playerId: string, startTime: number) {
    //const videoId = this.extractYoutubeId(videoUrl);
    //if (!videoId) return;
    const videoId = this.extractYoutubeId(videoUrl);
    if (!videoId) return;

    this.players[playerId] = new YT.Player(playerId, {
      height: '315',
      width: '560',
      videoId: videoId,
      playerVars: {
        'controls': 0,
        'disablekb': 1,
        'fs': 1,
        'modestbranding': 1,
        'rel': 0,
        'showinfo': 0,
        'iv_load_policy': 3,
        'playsinline': 1,
        'start': startTime

      },
      events: {
        'onStateChange': (event: any) => this.onPlayerStateChange(event, playerId, videoId) // Fonksiyonu değiştir
      }
    });
  }

  onPlayerStateChange(event: any, playerId: string, videoId: string) { // playerId parametresini ekleyin
    if (event.data == YT.PlayerState.PLAYING) {
      this.startTracking(playerId, videoId); // videoId parametresini ekleyin
    } else {
      this.stopTracking(playerId); // Fonksiyonu değiştir
    }
  }

  startTracking(playerId: string, videoId: string) { // playerId parametresini ekleyin
    this.interval = setInterval(() => {
      const currentTime = this.players[playerId].getCurrentTime(); // players[playerId] şeklinde güncelleyin
      const duration = this.players[playerId].getDuration(); // players[playerId] şeklinde güncelleyin
      console.log('Current Time: ', currentTime);
      this.surveyService.setDorduncuAsamaVideoCurrentTime(videoId, currentTime); // videoId parametresini ekleyin

      if (Math.abs(currentTime - duration) < 3) {
        console.log('VİDEO BİTTİ');
        this.stopTracking(playerId); // Fonksiyonu değiştir
      }
    }, 1000);
  }

  stopTracking(playerId: string) { // playerId parametresini ekleyin
    if (this.interval) {
      clearInterval(this.interval);
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
