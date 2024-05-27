import { Component, OnInit, OnDestroy } from '@angular/core';
import { SurveyService } from '../services/survey.service';
import { DomSanitizer } from '@angular/platform-browser';


declare var YT: any;


@Component({
  selector: 'app-admin-anket-sec',
  templateUrl: './admin-anket-sec.component.html',
  styleUrls: ['./admin-anket-sec.component.scss']
})
export class AdminAnketSecComponent implements OnInit, OnDestroy {

  constructor(private surveyService: SurveyService, public sanitizer: DomSanitizer) { }

  ucuncuAsamaYuklenenVideo: any;
  dorduncuAsamaYuklenenVideo: any;
  birinciAsamaSecilecekAnketId: any;
  ikinciAsamaSecilecekAnketId: any;
  besinciAsamaSecilecekAnketId: any;
  ucuncuAsamaBilgilendirmeMetni: any;
  dorduncuAsamaBilgilendirmeMetni: any;
  ucuncuAsamaVideo: any;
  dorduncuAsamaVideo: any;
  ucuncuAsamaVideoLink: any;
  dorduncuAsamaVideoLink: any;
  ucuncuAsamaVideoId: any;
  dorduncuAsamaVideoId: any;
  ucuncuAsamaVideoUrl: any;
  dorduncuAsamaVideoUrl: any;
  player: any;
  interval: any;
  
  ngOnInit(): void {
    // localStorage'dan veriyi çek
    this.ucuncuAsamaVideoUrl= this.surveyService.getUcuncuAsamaVideoUrl();
    this.dorduncuAsamaVideoUrl=this.surveyService.getDorduncuAsamaVideoUrl();
    console.log('GET ucuncuAsamaVideoUrl : ', this.ucuncuAsamaVideoUrl);
    console.log('GET dorduncuAsamaVideoUrl : ', this.dorduncuAsamaVideoUrl);
    this.ucuncuAsamaBilgilendirmeMetni= this.surveyService.getUcuncuAsamaBilgilendirmeMetni();
    this.dorduncuAsamaBilgilendirmeMetni= this.surveyService.getDorduncuAsamaBilgilendirmeMetni();
  }
  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
  ucuncuAsamaVideolariListele() {
    
    if (!this.ucuncuAsamaVideoUrl) {
      alert('Geçerli bir YouTube veya Google Drive video linki giriniz. Önceden yüklenmiş bir video bulunamadı !');
    } else {
      this.initYouTubePlayer(this.ucuncuAsamaVideoUrl);
    }
  }

  ucuncuAsamaVideoYukle() {
    
    this.ucuncuAsamaVideoUrl = this.createEmbedUrl(this.ucuncuAsamaVideoLink);
    if (!this.ucuncuAsamaVideoUrl) {
      alert('Geçerli bir YouTube veya Google Drive video linki giriniz.');
    } else {
      this.surveyService.setUcuncuAsamaVideoUrl(this.ucuncuAsamaVideoUrl);
      this.initYouTubePlayer(this.ucuncuAsamaVideoUrl);
    }
  }

  dorduncuAsamaVideolariListele() {
    
    if (!this.dorduncuAsamaVideoLink) {
      alert('Geçerli bir YouTube veya Google Drive video linki giriniz. Önceden yüklenmiş bir video bulunamadı !');
    } else {
      this.initYouTubePlayer(this.dorduncuAsamaVideoLink);
    }
  }

  dorduncuAsamaVideoYukle() {
    
    this.dorduncuAsamaVideoLink = this.createEmbedUrl(this.dorduncuAsamaVideoLink);
    if (!this.dorduncuAsamaVideoLink) {
      alert('Geçerli bir YouTube veya Google Drive video linki giriniz.');
    } else {
      this.surveyService.setDorduncuAsamaVideoUrl(this.dorduncuAsamaVideoLink);
      this.initYouTubePlayer(this.dorduncuAsamaVideoLink);
    }
  }

 
  createEmbedUrl(url: string): string | null {
    const youtubeId = this.extractYoutubeId(url);
    if (youtubeId) {
      return `https://www.youtube.com/embed/${youtubeId}`;
    }

    const driveId = this.extractDriveId(url);
    if (driveId) {
      return `https://drive.google.com/file/d/${driveId}/preview`;
    }

    return null;
  }

  extractYoutubeId(url: string): string | null {
    const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    return (match && match[1]) ? match[1] : null;
  }

  extractDriveId(url: string): string | null {
    const regExp = /^(?:https?:\/\/)?(?:www\.)?drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\/?.*$/;
    const match = url.match(regExp);
    return (match && match[1]) ? match[1] : null;
  }

  initYouTubePlayer(videoUrl: string) {
    if (this.player) {
      this.player.destroy();
    }

    const videoId = this.extractYoutubeId(videoUrl);
    if (!videoId) return;

    this.player = new YT.Player('youtube-player', {
      height: '315',
      width: '560',
      videoId: videoId,
      playerVars: {
        'controls': 0, // Kontrolleri gizler
        'disablekb': 1,// Klavye kontrollerini devre dışı bırakır
        'fs': 1, // Tam ekran butonunu devre dışı bırakır
        'modestbranding': 1, // Minimal YouTube marka bilinci oluşturma
        'rel': 0, // Sonunda ilgili video yok
        'showinfo': 0, // Video başlığını gizler
        'iv_load_policy': 3, // Ek açıklamaları gizler
        'playsinline': 1 // Ek açıklamaları gizler
      },
      events: {
        'onStateChange': this.onPlayerStateChange.bind(this)
      }
    });
  }

  onPlayerStateChange(event: any) {
    if (event.data == YT.PlayerState.PLAYING) {
      this.startTracking();
    } else {
      this.stopTracking();
    }
  }

  startTracking() {
    this.interval = setInterval(() => {
      const currentTime = this.player.getCurrentTime();
      const duration = this.player.getDuration();
      console.log('Current Time: ', currentTime);
           if (Math.abs(currentTime - duration) < 3) { // Checking if current time is within 1 second of the duration

        console.log('VİDEO BİTTİ');
        this.stopTracking(); // Stop tracking when video ends
      }
      // You can send this data to your backend here
    }, 1000);
  }
  stopTracking() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  birinciAsamaAnketSorusuSec() {
    // Seçilen anket ID'sini servise set et
    console.log('SEÇİLEN ANKET ID Sİ : ', this.birinciAsamaSecilecekAnketId);
    alert('Kullanıcılara gösterilecek (Çoktan Seçmeli) ANKET başarıyla seçildi !');
    this.surveyService.setBirinciAsamaSecilecekAnketId(this.birinciAsamaSecilecekAnketId);
  }

  ikinciAsamaAnketSorusuSec() {
    // Seçilen anket ID'sini servise set et
    console.log('SEÇİLEN ANKET ID Sİ : ', this.ikinciAsamaSecilecekAnketId);
    alert('Kullanıcılara gösterilecek (Açık Uçlu) ANKET başarıyla seçildi !');
    this.surveyService.setIkinciAsamaSecilecekAnketId(this.ikinciAsamaSecilecekAnketId);
  }

  ucuncuAsamaAnketSorusuSec() {
    this.surveyService.setUcuncuAsamaBilgilendirmeMetni(this.ucuncuAsamaBilgilendirmeMetni);

    console.log('SEÇİLEN Bilgilendirme Metni : ', this.ucuncuAsamaBilgilendirmeMetni);
    alert('Kullanıcılara gösterilecek Bilgilendirme Metni başarıyla seçildi !');
  }

  dorduncuAsamaAnketSorusuSec() {
    this.surveyService.setDorduncuAsamaBilgilendirmeMetni(this.dorduncuAsamaBilgilendirmeMetni);

    console.log('SEÇİLEN Bilgilendirme Metni : ', this.dorduncuAsamaBilgilendirmeMetni);
    alert('Kullanıcılara gösterilecek Bilgilendirme Metni başarıyla seçildi !');
  }

  besinciAsamaAnketSorusuSec() {
    // Seçilen anket ID'sini servise set et
    console.log('SEÇİLEN ANKET ID Sİ : ', this.besinciAsamaSecilecekAnketId);
    alert('Kullanıcılara gösterilecek (Çoktan Seçmeli) ANKET başarıyla seçildi !');
    this.surveyService.setBesinciAsamaSecilecekAnketId(this.besinciAsamaSecilecekAnketId);
  }
}