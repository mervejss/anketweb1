import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-kullanici-detaylari',
  templateUrl: './kullanici-detaylari.component.html',
  styleUrls: ['./kullanici-detaylari.component.scss']
})
export class KullaniciDetaylariComponent implements OnChanges {
  @Input() tiklananUserID: number | null = null; // Tıklanan kullanıcı ID'sini tutacak değişken
  activityLogs: any[] = [];
  userStage: any;
  video1Watched: boolean | null = null;
  video2Watched: boolean | null = null;
  userID: any;
  stages: any[] = [
    { id: 1, name: '1. Aşama | (Çoktan Seçmeli) Anket', status: '', icon: '' },
    { id: 2, name: '2. Aşama | (Açık Uçlu) Anket', status: '', icon: '' },
    { id: 3, name: '3. Aşama | (Bilgilendirme Metni ve Videolar) Anket', status: '', icon: '' },
    { id: 4, name: '4. Aşama | (Bilgilendirme Metni ve Videolar) Anket', status: '', icon: '' },
    { id: 5, name: '5. Aşama | (Açık Uçlu) Anket', status: '', icon: '' },
  ];

  private _getUserActivityLogsUrl = 'http://localhost:3000/api/user-activity-logs';

  constructor(private http: HttpClient) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tiklananUserID'] && this.tiklananUserID !== null) {
      this.getActivityLogs(this.tiklananUserID).subscribe(data => {
        // Tıklanan kullanıcı ID'sine sahip işlemleri filtreleme
        this.activityLogs = data.filter(log => log.user_id === this.tiklananUserID);
        this.userStage = this.getUserStage(this.activityLogs);
        this.video1Watched = this.getVideoWatchedStatus(this.activityLogs, 3);
        this.video2Watched = this.getVideoWatchedStatus(this.activityLogs, 4);
        this.updateStages();
      });
    }
  }
// Diğer bileşen özelliklerinin üstüne ekleyin
tablesVisible: boolean[] = [true, true, true]; // Başlangıçta tabloları göster

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
    // En son tarihli 'Phase Change' işlemini bulma
    const phaseChangeLogs = logs.filter(log => log.action === 'Phase Change');
    if (phaseChangeLogs.length === 0) {
      return null;
    }
    const latestLog = phaseChangeLogs.reduce((prev, current) => {
      return (new Date(prev.created_at) > new Date(current.created_at)) ? prev : current;
    });
    return latestLog.stage;
  }

  getVideoWatchedStatus(logs: any[], stage: number): boolean | null {
    // En son tarihli 'watch_video' işlemini bulma
    const watchVideoLogs = logs.filter(log => log.action === 'watch_video' && log.stage === stage);
    if (watchVideoLogs.length === 0) {
      return null;
    }
    const latestLog = watchVideoLogs.reduce((prev, current) => {
      return (new Date(prev.created_at) > new Date(current.created_at)) ? prev : current;
    });
    return stage === 3 ? latestLog.video_1_watched : latestLog.video_2_watched;
  }

  updateStages(): void {
    if (this.userStage === null) {
      this.stages.forEach(stage => {
        stage.status = 'BU AŞAMA HENÜZ TAMAMLANMADI';
        stage.icon = 'close';
      });
    } else {
      this.stages.forEach(stage => {
        if (stage.id < this.userStage) {
          stage.status = 'BU AŞAMA TAMAMLANDI';
          stage.icon = 'check';
        } else if (stage.id === this.userStage) {
          stage.status = 'BU AŞAMA KULLANILIYOR';
          stage.icon = 'sync';
        } else {
          stage.status = 'BU AŞAMA HENÜZ TAMAMLANMADI';
          stage.icon = 'close';
        }
      });
    }
  }
  
}
