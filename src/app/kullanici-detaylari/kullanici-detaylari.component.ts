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
  userStage: number | null = null;
  video1Watched: boolean | null = null;
  video2Watched: boolean | null = null;

  private _getUserActivityLogsUrl = 'http://localhost:3000/api/user-activity-logs';

  constructor(private http: HttpClient) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tiklananUserID'] && this.tiklananUserID !== null) {
      this.getActivityLogs(this.tiklananUserID).subscribe(data => {
        this.activityLogs = data.filter(log => log.user_id === this.tiklananUserID);
        this.userStage = this.getUserStage(this.activityLogs);
        this.video1Watched = this.getVideoWatchedStatus(this.activityLogs, 3);
        this.video2Watched = this.getVideoWatchedStatus(this.activityLogs, 4);
      });
    }
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
    const phaseChangeLog = logs.find(log => log.action === 'Phase Change');
    return phaseChangeLog ? phaseChangeLog.stage : null;
  }

  getVideoWatchedStatus(logs: any[], stage: number): boolean | null {
    const watchVideoLog = logs.find(log => log.action === 'watch_video' && log.stage === stage);
    return stage === 3 ? watchVideoLog?.video_1_watched : watchVideoLog?.video_2_watched;
  }
}
