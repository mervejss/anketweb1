import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NormalKullaniciService } from '../services/normal-kullanici.service';

@Component({
  selector: 'app-normal-kullanici-ana-sayfa',
  templateUrl: './normal-kullanici-ana-sayfa.component.html',
  styleUrls: ['./normal-kullanici-ana-sayfa.component.scss']
})
export class NormalKullaniciAnaSayfaComponent implements OnInit {

  normalKullaniciData: any;
  kullaniciAktifSayfa : any; // Aktif sayfa bilgisini tutacak değişken
  userStage: any;
  userId: any;


  constructor(private http: HttpClient, private router: Router, private _auth: NormalKullaniciService) {}
  

  ngOnInit(): void {
    this.normalKullaniciData = this._auth.getUserData();
    this.userId = this.normalKullaniciData.id; // Kullanıcı ID'sini al
    this.getUserStage(this.userId);
  }

  cevaplariGoruntule(): void {
    this.kullaniciAktifSayfa = 'normal-kullanici-cevaplar-goruntule'; // Başında / olmadan rotayı belirtin

}

  getUserStage(userId: number) {
    this._auth.getUserStage(userId).subscribe(
      (res: any) => {
        console.log('res', res);
        this.userStage = res.stage;
        console.log('User stage:', this.userStage);
        this.setAktifSayfa();
      },
      error => {
        console.error('Error fetching user stage:', error);
      }
    );
  }
  setAktifSayfa() {
    if (this.userStage == 1) {
      this.kullaniciAktifSayfa = 'kullanici-anketler-page1';
    } else if (this.userStage == 2) {
      this.kullaniciAktifSayfa = 'kullanici-anketler-page2';
    } else if (this.userStage == 3) {
      this.kullaniciAktifSayfa = 'kullanici-anketler-page3';
    } else if (this.userStage == 4) {
      this.kullaniciAktifSayfa = 'kullanici-anketler-page4';
    } else if (this.userStage == 5) {
      this.kullaniciAktifSayfa = 'kullanici-anketler-page5';
    }
    console.log("this.kullaniciAktifSayfa:", this.kullaniciAktifSayfa);
  }

  logUserActivityPhaseChange(id: any, stage: number) {
    const activityLog = {
      user_id: id,
      stage: stage,
      
    };

    this._auth.changeUserStage(activityLog).subscribe(
      (res: any) => {
        console.log('Activity logged or updated:', res);
      },
      error => {
        console.error('Error logging or updating activity:', error);
      }
    );
  }
  ilkAsamayiAc()
  {
    this.logUserActivityPhaseChange(this.normalKullaniciData.id, 1); // örnek olarak stage 1

    //this._auth.setKullaniciAktifSayfa('kullanici-anketler-page1');
    console.log('1. AŞAMA AÇ ! BUTONU ÇALIŞTIIII aktif sayfa ise : ',this._auth.getKullaniciAktifSayfa() )
    window.location.reload();
  }
  birinciAsamayiTamamla()
  {
    this.logUserActivityPhaseChange(this.normalKullaniciData.id, 2); // örnek olarak stage 1

    this._auth.setKullaniciAktifSayfa('kullanici-anketler-page2');
    console.log('1. AŞAMA TAMAMLA ! BUTONU ÇALIŞTIIII aktif sayfa ise : ',this._auth.getKullaniciAktifSayfa() )
    window.location.reload();
  }
  
  ikinciAsamayiTamamla()
  {
    this.logUserActivityPhaseChange(this.normalKullaniciData.id, 3); // örnek olarak stage 1

    this._auth.setKullaniciAktifSayfa('kullanici-anketler-page3');
    console.log('2. AŞAMA TAMAMLA ! BUTONU ÇALIŞTIIII aktif sayfa ise : ',this._auth.getKullaniciAktifSayfa() )
    window.location.reload();
  }
  
  ucuncuAsamayiTamamla()
  {
    this.logUserActivityPhaseChange(this.normalKullaniciData.id, 4); // örnek olarak stage 1

    this._auth.setKullaniciAktifSayfa('kullanici-anketler-page4');
    console.log('3. AŞAMA TAMAMLA ! BUTONU ÇALIŞTIIII aktif sayfa ise : ',this._auth.getKullaniciAktifSayfa() )
    window.location.reload();
  }
  
  dorduncuAsamayiTamamla()
  {
    this.logUserActivityPhaseChange(this.normalKullaniciData.id, 5); // örnek olarak stage 1

    this._auth.setKullaniciAktifSayfa('kullanici-anketler-page5');
    console.log('4. AŞAMA TAMAMLA ! BUTONU ÇALIŞTIIII aktif sayfa ise : ',this._auth.getKullaniciAktifSayfa() )
    window.location.reload();
  }
  
  


}
