import { Component, OnInit } from '@angular/core';
import { SurveyService } from '../services/survey.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-admin-anket-sec',
  templateUrl: './admin-anket-sec.component.html',
  styleUrls: ['./admin-anket-sec.component.scss']
})
export class AdminAnketSecComponent implements OnInit {

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

  ngOnInit(): void {
    // localStorage'dan veriyi çek
    //this.ucuncuAsamaYuklenenVideo = this.surveyService.getUcuncuAsamaYuklenenVideo();
    //this.dorduncuAsamaYuklenenVideo = this.surveyService.getDorduncuAsamaYuklenenVideo();
    this.ucuncuAsamaVideoUrl= this.surveyService.getUcuncuAsamaVideoUrl();
    this.dorduncuAsamaVideoUrl=this.surveyService.getDorduncuAsamaVideoUrl();
    console.log('GET ucuncuAsamaVideoUrl : ', this.ucuncuAsamaVideoUrl);
    console.log('GET dorduncuAsamaVideoUrl : ', this.dorduncuAsamaVideoUrl);
    this.ucuncuAsamaBilgilendirmeMetni= this.surveyService.getUcuncuAsamaBilgilendirmeMetni();
    this.dorduncuAsamaBilgilendirmeMetni= this.surveyService.getDorduncuAsamaBilgilendirmeMetni();


  }

  ucuncuAsamaVideoGoster() {
    this.ucuncuAsamaVideoUrl = this.createEmbedUrl(this.ucuncuAsamaVideoLink);
    if (!this.ucuncuAsamaVideoUrl) {
      alert('Geçerli bir YouTube veya Google Drive video linki giriniz.');
    }
    else {
      console.log('SET ucuncuAsamaVideoUrl : ', this.ucuncuAsamaVideoUrl);
      this.surveyService.setUcuncuAsamaVideoUrl(this.ucuncuAsamaVideoUrl);
    }

  }

  dorduncuAsamaVideoGoster() {
    this.dorduncuAsamaVideoUrl = this.createEmbedUrl(this.dorduncuAsamaVideoLink);
    if (!this.dorduncuAsamaVideoUrl) {
      alert('Geçerli bir YouTube veya Google Drive video linki giriniz.');
    }else {
      console.log('SET dorduncuAsamaVideoUrl : ', this.dorduncuAsamaVideoUrl);

      this.surveyService.setDorduncuAsamaVideoUrl(this.dorduncuAsamaVideoUrl);
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
