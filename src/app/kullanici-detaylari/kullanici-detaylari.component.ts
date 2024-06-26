import { Component, Input, OnChanges, SimpleChanges, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NormalKullaniciService } from '../services/normal-kullanici.service';
import Swal from 'sweetalert2';
import { SurveyService } from '../services/survey.service';

@Component({
  selector: 'app-kullanici-detaylari',
  templateUrl: './kullanici-detaylari.component.html',
  styleUrls: ['./kullanici-detaylari.component.scss']
})
export class KullaniciDetaylariComponent implements  OnInit,OnChanges {

  @Input() tiklananUserID: number | null = null; // Tıklanan kullanıcı ID'sini tutacak değişken
  activityLogs: any[] = [];
  userStage: any;
  video1Watched:any;
  video2Watched:any;
  userID: any;
  normalKullaniciData: any;
  kullaniciAktifSayfa : any; // Aktif sayfa bilgisini tutacak değişken

  stages: any[] = [
    { id: 1, name: '1. Aşama | (Çoktan Seçmeli) Anket', status: '', icon: '' },
    { id: 2, name: '2. Aşama | (Açık Uçlu) Anket', status: '', icon: '' },
    { id: 3, name: '3. Aşama | (Bilgilendirme Metni ve Videolar) Anket', status: '', icon: '' },
    { id: 4, name: '4. Aşama | (Bilgilendirme Metni ve Videolar) Anket', status: '', icon: '' },
    { id: 5, name: '5. Aşama | (Açık Uçlu) Anket', status: '', icon: '' },
  ];

  private _getUserActivityLogsUrl = 'http://localhost:3000/api/user-activity-logs';

  constructor(private http: HttpClient, private _auth: NormalKullaniciService, private cdr: ChangeDetectorRef, private surveyService:SurveyService) {}

  ngOnInit(): void {
    this.normalKullaniciData = this._auth.getUserData();
    this.userID = this.normalKullaniciData.id; // Kullanıcı ID'sini al

    this.getWatchVideo1();
    this.getWatchVideo2();
    console.log("this.video1Watched :: ", this.video1Watched)
    console.log("this.video2Watched :: ", this.video2Watched)

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tiklananUserID'] && this.tiklananUserID !== null) {
      this.getActivityLogs(this.tiklananUserID).subscribe(data => {
        // Tıklanan kullanıcı ID'sine sahip işlemleri filtreleme
        this.activityLogs = data.filter(log => log.user_id === this.tiklananUserID);
        this.userStage = this.getUserStage(this.activityLogs);
        console.log("userStage :: ", this.userStage)

        //this.video1Watched =  this.getWatchStatus('watch_video1');
        //this.video2Watched = this.getWatchStatus('watch_video2');
        this.updateStages();
        this.getWatchVideo1();
        this.getWatchVideo2();
       
      });
    }
}

// Diğer bileşen özelliklerinin üstüne ekleyin
tablesVisible: boolean[] = [true, true, true,true]; // Başlangıçta tabloları göster

// Buton tıklamasıyla tablo görünürlüğünü değiştiren fonksiyon
toggleTableVisibility(index: number): void {
  this.tablesVisible[index] = !this.tablesVisible[index];
}

  getActivityLogs(userId: number): Observable<any[]> {
    return this.http.get<any[]>(this._getUserActivityLogsUrl);
  }

  getActionDescription(action: string, stage: number): string {
    switch (action) {
      case 'login':
        return 'Kullanıcı Giriş Yaptı';
      case 'logout':
        return 'Kullanıcı Çıkış Yaptı';
      case 'Phase Change':
        return `Kullanıcı ${stage}. Aşamaya Geçiş Yaptı`;
      default:
        return action;
    }
  }

  getUserStage(logs: any[]): number | null {
    const phaseChangeLogs = logs.filter(log => log.action === 'Phase Change');
    if (phaseChangeLogs.length === 0) {
      return null;
    }
    const latestLog = phaseChangeLogs.reduce((prev, current) => {
      return (new Date(prev.created_at) > new Date(current.created_at)) ? prev : current;
    });
    return latestLog.stage;
}

getWatchVideo1() {
  const user_id = this.tiklananUserID;
  const action = 'watch_video1';

  if (user_id === null) {
    console.error('Kullanıcı ID boş.');
    // Handle null case, maybe show an error message to the user
    return;
  }

  this.surveyService.getWatchStatus(user_id, action).subscribe(
    response => {
      console.log("getWatchVideo1() response :: ", response);

      this.video1Watched = response.video_1_watched;
      console.log("this.video1Watched :: ", this.video1Watched);
    },
    error => {
      console.error('Hata:', error);
    }
  );
}

getWatchVideo2() {
  const user_id = this.tiklananUserID;
  const action = 'watch_video2';

  if (user_id === null) {
    console.error('Kullanıcı ID boş.');
    // Handle null case, maybe show an error message to the user
    return;
  }

  this.surveyService.getWatchStatus(user_id, action).subscribe(
    response => {
      console.log("getWatchVideo2() response :: ", response);
      this.video2Watched = response.video_2_watched;
      console.log("this.video2Watched :: ", this.video2Watched);
    },
    error => {
      console.error('Hata:', error);
    }
  );
}




  updateStages(): void {
  
        if (this.userStage === null) {
            this.stages.forEach(stage => {
                stage.status = 'BU AŞAMA HENÜZ TAMAMLANMADI';
                stage.icon = 'close';
                stage.active = false; // Buton pasif
            });
        } else {
            this.stages.forEach(stage => {
                if (stage.id < this.userStage) {
                    stage.status = 'BU AŞAMA TAMAMLANDI';
                    stage.icon = 'check';
                    stage.active = false; // Buton pasif
                } else if (stage.id === this.userStage) {
                    stage.status = 'BU AŞAMA KULLANILIYOR';
                    stage.icon = 'sync';
                    stage.active = true; // Buton aktif
                }  else if (stage.id === 6) {
                  stage.status = 'BU AŞAMA TAMAMLANDI';
                  stage.icon = 'check';
                  stage.active = false; // Buton pasif
                } else {
                    stage.status = 'BU AŞAMA HENÜZ TAMAMLANMADI';
                    stage.icon = 'close';
                    stage.active = false; // Buton pasif
                }
            });
        }
        
   
}
  
  logUserActivityPhaseChange(id: any, stage: number): Promise<any> {
    return new Promise((resolve, reject) => {
      const activityLog = {
        user_id: id,
        stage: stage,
      };
      this.userStage=stage;

      this._auth.changeUserStage(activityLog).subscribe(
        (res: any) => {
          console.log('Activity logged or updated:', res);
          resolve(res); // İşlem başarıyla tamamlandığında 'resolve' çağrılır
        },
        error => {
          console.error('Error logging or updating activity:', error);
          reject(error); // Hata oluştuğunda 'reject' çağrılır
        }
      );
    });
  }
  ilkAsamayiAc()
  {
    this.logUserActivityPhaseChange(this.normalKullaniciData.id, 1); // örnek olarak stage 1

    this._auth.setKullaniciAktifSayfa('kullanici-anketler-page1');
    console.log('1. AŞAMA AÇ ! BUTONU ÇALIŞTIIII aktif sayfa ise : ',this._auth.getKullaniciAktifSayfa() )
    //window.location.reload();
  }

  birinciAsamayiTamamla()
  {
    this.logUserActivityPhaseChange(this.normalKullaniciData.id, 2); // örnek olarak stage 1

    this._auth.setKullaniciAktifSayfa('kullanici-anketler-page2');
    console.log('1. AŞAMA TAMAMLA ! BUTONU ÇALIŞTIIII aktif sayfa ise : ',this._auth.getKullaniciAktifSayfa() )
    //window.location.reload();

  }
  
  ikinciAsamayiTamamla()
  {
    this.logUserActivityPhaseChange(this.normalKullaniciData.id, 3); // örnek olarak stage 1

    this._auth.setKullaniciAktifSayfa('kullanici-anketler-page3');
    console.log('2. AŞAMA TAMAMLA ! BUTONU ÇALIŞTIIII aktif sayfa ise : ',this._auth.getKullaniciAktifSayfa() )
    //window.location.reload();

  }
  
  ucuncuAsamayiTamamla()
  {
    this.logUserActivityPhaseChange(this.normalKullaniciData.id, 4); // örnek olarak stage 1

    this._auth.setKullaniciAktifSayfa('kullanici-anketler-page4');
    console.log('3. AŞAMA TAMAMLA ! BUTONU ÇALIŞTIIII aktif sayfa ise : ',this._auth.getKullaniciAktifSayfa() )
    //window.location.reload();

  }
  
  dorduncuAsamayiTamamla()
  {
    this.logUserActivityPhaseChange(this.normalKullaniciData.id, 5); // örnek olarak stage 1

    this._auth.setKullaniciAktifSayfa('kullanici-anketler-page5');
    console.log('4. AŞAMA TAMAMLA ! BUTONU ÇALIŞTIIII aktif sayfa ise : ',this._auth.getKullaniciAktifSayfa() )
    //window.location.reload();

  }

  besinciAsamayiTamamla()
  {
    console.log('5. AŞAMA TAMAMLA ! BUTONU ÇALIŞTIIII ANKETLER BİTTİİİİ !!! ' )
    this.logUserActivityPhaseChange(this.normalKullaniciData.id, 6); // örnek olarak stage 1
    //window.location.reload();
  }
  
  selectedStage: number | null = null;

  selectStage(stage: number) {
    // Sadece bir checkbox seçilebilir, seçileni sakla
    this.selectedStage = stage;
  }
  

  onSelect() {
    console.log("this.selectedStage :: ", this.selectedStage)

      switch (this.selectedStage) {
        case 1:
          this.ilkAsamayiAc();
          break;
        case 2:
          this.birinciAsamayiTamamla();
          break;
        case 3:
          this.ikinciAsamayiTamamla();
          break;
        case 4:
          this.ucuncuAsamayiTamamla();
          break;
        case 5:
          this.dorduncuAsamayiTamamla();
          break;
      }
      this.updateStages();

    
      if (this.selectedStage===5)
      {
        this.showSuccessAlert('Başarılı', 'Tüm Anketler Başarıyla Tamamlandı !');

      }
      else
      {
        this.showSuccessAlert('Başarılı', 'Aşama başarıyla güncellendi ! Sayfayı Yenileyin !');

      }

  }   
  tamamla(stageId: number) {
    console.log("tamamla stageId :: ", stageId)

    switch (stageId) {
      case 1:
        this.birinciAsamayiTamamla();
        break;
      case 2:
        this.ikinciAsamayiTamamla();
        break;
      case 3:
        this.ucuncuAsamayiTamamla();
        break;
      case 4:
        this.dorduncuAsamayiTamamla();
        break;
      case 5:
        this.besinciAsamayiTamamla();
        break;
    }
    this.updateStages();

    if (stageId===5)
      {
        this.showSuccessAlert('Başarılı', 'Tüm Anketler Başarıyla Tamamlandı !');
  
      }
      else
      {
        this.showSuccessAlert('Başarılı', 'Aşama başarıyla güncellendi ! Sayfayı Yenileyin !');
  
      }
    
  }

  showSuccessAlert(title: string, message: string): void {
    Swal.fire({
      title: title,
      text: message,
      icon: 'success',
      confirmButtonText: 'Tamam'
    });
  }

  showErrorAlert(title: string, message: string): void {
    Swal.fire({
      title: title,
      text: message,
      icon: 'error',
      confirmButtonText: 'Tamam'
    });
  }
}
