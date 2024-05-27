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
  players: any = {}; // players nesnesini başlatın

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

  ucuncuAsamaVideoUrls: string[] = [];
  dorduncuAsamaVideoUrls: string[] = [];


  player: any;
  interval: any;
  
  ngOnInit(): void {
    this.ucuncuAsamaVideoUrls = this.surveyService.getUcuncuAsamaVideoUrls() || [];
    this.dorduncuAsamaVideoUrls = this.surveyService.getDorduncuAsamaVideoUrls() || [];
    this.ucuncuAsamaBilgilendirmeMetni = this.surveyService.getUcuncuAsamaBilgilendirmeMetni();
    this.dorduncuAsamaBilgilendirmeMetni = this.surveyService.getDorduncuAsamaBilgilendirmeMetni();
  }

  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
  
  ucuncuAsamaVideoYukle() {
    const videoUrl = this.createEmbedUrl(this.ucuncuAsamaVideoLink);
    if (!videoUrl) {
        alert('Geçerli bir YouTube veya Google Drive video linki giriniz.');
    } else {
        const playerId = 'ucuncu-player-' + this.ucuncuAsamaVideoUrls.length; // Benzersiz playerId oluşturuluyor

        this.ucuncuAsamaVideoUrls.push(videoUrl);
        this.surveyService.setUcuncuAsamaVideoUrls(this.ucuncuAsamaVideoUrls);
        this.initYouTubePlayer(videoUrl, playerId);
    }
}

dorduncuAsamaVideoYukle() {
    const videoUrl = this.createEmbedUrl(this.dorduncuAsamaVideoLink);
    if (!videoUrl) {
        alert('Geçerli bir YouTube veya Google Drive video linki giriniz.');
    } else {
        const playerId = 'dorduncu-player-' + this.dorduncuAsamaVideoUrls.length; // Benzersiz playerId oluşturuluyor

        this.dorduncuAsamaVideoUrls.push(videoUrl);
        this.surveyService.setDorduncuAsamaVideoUrls(this.dorduncuAsamaVideoUrls);
        this.initYouTubePlayer(videoUrl, playerId);
    }
}


ucuncuAsamaVideolariListele() {
  if (this.ucuncuAsamaVideoUrls.length === 0) {
      alert('Önceden yüklenmiş bir video bulunamadı!');
  } else {
      this.ucuncuAsamaVideoUrls.forEach((videoUrl, index) => {
          const playerId = 'ucuncu-player-' + index; // Her video için benzersiz playerId oluşturuluyor
          this.initYouTubePlayer(videoUrl, playerId);
      });
  }
}

dorduncuAsamaVideolariListele() {
  if (this.dorduncuAsamaVideoUrls.length === 0) {
      alert('Önceden yüklenmiş bir video bulunamadı!');
  } else {
      this.dorduncuAsamaVideoUrls.forEach((videoUrl, index) => {
          const playerId = 'dorduncu-player-' + index; // Her video için benzersiz playerId oluşturuluyor
          this.initYouTubePlayer(videoUrl, playerId);
      });
  }
}



  ucuncuAsamaVideolariSil() {
    if (confirm('Tüm 3. aşama videolarını silmek istediğinize emin misiniz?')) {
      this.ucuncuAsamaVideoUrls = [];
      this.surveyService.setUcuncuAsamaVideoUrls(this.ucuncuAsamaVideoUrls);
      alert('Tüm 3. aşama videoları silindi.');
    }
  }

  dorduncuAsamaVideolariSil() {
    if (confirm('Tüm 4. aşama videolarını silmek istediğinize emin misiniz?')) {
      this.dorduncuAsamaVideoUrls = [];
      this.surveyService.setDorduncuAsamaVideoUrls(this.dorduncuAsamaVideoUrls);
      alert('Tüm 4. aşama videoları silindi.');
    }
  }

  
  ucuncuAsamaVideoKaldir(index: number) {
    if (confirm('Bu videoyu silmek istediğinize emin misiniz?')) {
      this.ucuncuAsamaVideoUrls.splice(index, 1);
      this.surveyService.setUcuncuAsamaVideoUrls(this.ucuncuAsamaVideoUrls);
      const playerId = 'ucuncu-player-' + index;

      this.players[playerId].destroy(); // Videoyu kaldırdığınızda player'ı da yok edin

    }
  }

  dorduncuAsamaVideoKaldir(index: number) {
    if (confirm('Bu videoyu silmek istediğinize emin misiniz?')) {
      this.dorduncuAsamaVideoUrls.splice(index, 1);
      this.surveyService.setDorduncuAsamaVideoUrls(this.dorduncuAsamaVideoUrls);
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

  initYouTubePlayer(videoUrl: string, playerId: string) {
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
        'playsinline': 1
      },
      events: {
        'onStateChange': (event: any) => this.onPlayerStateChange(event, playerId) // Fonksiyonu değiştir
      }
    });
  }
  

  // onPlayerStateChange fonksiyonunda
onPlayerStateChange(event: any, playerId: string) { // playerId parametresini ekleyin
  if (event.data == YT.PlayerState.PLAYING) {
    this.startTracking(playerId); // Fonksiyonu değiştir
  } else {
    this.stopTracking(playerId); // Fonksiyonu değiştir
  }
}

// startTracking fonksiyonunda
startTracking(playerId: string) { // playerId parametresini ekleyin
  this.interval = setInterval(() => {
    const currentTime = this.players[playerId].getCurrentTime(); // players[playerId] şeklinde güncelleyin
    const duration = this.players[playerId].getDuration(); // players[playerId] şeklinde güncelleyin
    console.log('Current Time: ', currentTime);
    if (Math.abs(currentTime - duration) < 3) {
      console.log('VİDEO BİTTİ');
      this.stopTracking(playerId); // Fonksiyonu değiştir
    }
  }, 1000);
}

// stopTracking fonksiyonunda
stopTracking(playerId: string) { // playerId parametresini ekleyin
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