//C:\angular\anketweb-main\src\app\services\normal-kullanici.service.ts
import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class NormalKullaniciService {

  private kullaniciAktifSayfa: string ; // Varsayılan değeri atadım

  private _httpUrl = "http://207.154.196.66";
private _registerUrl = `${this._httpUrl}/api/users`;
private _loginUrl = `${this._httpUrl}/api/login`;
private _normalKullaniciInfoUrl = `${this._httpUrl}/api/normalKullaniciInfo`;
private _anketSorulari1Url = `${this._httpUrl}/api/questions`;
private _anketSecenekleri1Url = `${this._httpUrl}/api/questionOptions`;
private _user_activity_logsUrl = `${this._httpUrl}/api/user_activity_logs`;
private _user_asama_degisiklikUrl = `${this._httpUrl}/api/user_asama_degisiklik`;
private _getUserStageUrl = `${this._httpUrl}/api/user_stage`;
private _getUserActivityLogsUrl = `${this._httpUrl}/api/user-activity-logs`;


  _normalKullaniciData: any;
  _questionData: any;
  _questionOptionData: any;
  sozlesmeOnayDurumu: string ; // boolean türünde tanımlıyoruz


  getActivityLogs(): Observable<any[]> {
    return this.http.get<any[]>(this._getUserActivityLogsUrl);
  }

  constructor(private http: HttpClient, private _router: Router) {
    this._normalKullaniciData = JSON.parse(localStorage.getItem('normalKullaniciData') || '{}');
    this._questionData = JSON.parse(localStorage.getItem('questionData') || '{}');
    this._questionOptionData = JSON.parse(localStorage.getItem('questionOptionData') || '{}');
    //this._sozlesmeOnaylandi = JSON.parse(localStorage.getItem('sozlesmeOnaylandi') || '{}');
    const aktifSayfa = localStorage.getItem('kullaniciAktifSayfa');
    this.kullaniciAktifSayfa = aktifSayfa ? aktifSayfa : 'kullanici-anketler-page1'; // null yerine varsayılan değeri atıyorum
    
    const storedValue = localStorage.getItem('sozlesmeOnayDurumu');
    this.sozlesmeOnayDurumu = storedValue ? storedValue : 'false'; // null yerine varsayılan değeri atıyorum
    }

    getUserStage(userId: number): Observable<any> {
      return this.http.get<any>(`${this._getUserStageUrl}/${userId}`);
    }

  // Kullanıcı durumunu değiştirmek için 
  changeUserStage(activityLog: any): Observable<any> {
    return this.http.post<any>(this._user_asama_degisiklikUrl, activityLog);
  }
    
    // Yeni bir kullanıcı aktivite kaydı eklemek için API çağrısı
  addUserActivityLogLogin(activityLog: any): Observable<any> {
    return this.http.post<any>(this._user_activity_logsUrl, activityLog);
  }

  getKullaniciAktifSayfa(): string | null {
    return this.kullaniciAktifSayfa;
  }

  setKullaniciAktifSayfa(data: string): void {
    if (typeof data === 'string') {
      this.kullaniciAktifSayfa = data;
      localStorage.setItem('kullaniciAktifSayfa', data);
    } else {
      console.error('Invalid data type. Expected string.');
    }
  }

  
  setOnayDurumu(durum: string) {
    this.sozlesmeOnayDurumu = durum;
    localStorage.setItem('sozlesmeOnayDurumu', JSON.stringify(durum));
  }
  
  getOnayDurumu(): boolean { // boolean türünde bir değer döndürmesi gerekiyor
    return JSON.parse(localStorage.getItem('sozlesmeOnayDurumu') || ''); 
  }
  
  
  getQuestions() {
    return this.http.get<any>(this._anketSorulari1Url);
  }

  
  getQuestionOptions(questionId: number) {
    return this.http.post<any>(this._anketSecenekleri1Url, { question_id: questionId });
  }
  
  
  setQuestionData(data: any) {
    this._questionData = data;
    localStorage.setItem('questionData', JSON.stringify(data));
  }

  getQuestionData() {
    return this._questionData;
  }

  registerUser(user: any) {
    return this.http.post<any>(this._registerUrl, user);
  }

  loginUser(user: any) {
    return this.http.post(this._loginUrl, user);
  }

  getUserInfo(user: any) {
    return this.http.post(this._normalKullaniciInfoUrl, user);
  }

  logoutUser() {
    localStorage.removeItem('token');
    this._router.navigate(['/']);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  loggedIn() {
    return !!localStorage.getItem('token');
  }

  setUserData(data: any) {
    this._normalKullaniciData = data;
    // adminData'yı localStorage'a kaydet
    localStorage.setItem('normalKullaniciData', JSON.stringify(data));
  }

  getUserData() {
    return this._normalKullaniciData;
  }
  



}
