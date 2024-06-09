import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SurveyService {
  private birinciAsamaSecilenAnketId: any;
  private ikinciAsamaSecilecekAnketId: any;
  private besinciAsamaSecilecekAnketId: any;
  private ucuncuAsamaVideoUrl: any;
  private dorduncuAsamaVideoUrl: any;
  ucuncuAsamaBilgilendirmeMetni: any;
  dorduncuAsamaBilgilendirmeMetni: any;

  private surveySortType: any;

  constructor(private http: HttpClient) { 
    const storedId = localStorage.getItem('birinciAsamaSecilenAnketId');
    this.birinciAsamaSecilenAnketId = storedId ? parseInt(storedId, 10) : null;

    const storedId2 = localStorage.getItem('ikinciAsamaSecilecekAnketId');
    this.ikinciAsamaSecilecekAnketId = storedId2 ? parseInt(storedId2, 10) : null;


    const storedId5 = localStorage.getItem('besinciAsamaSecilecekAnketId');
    this.besinciAsamaSecilecekAnketId = storedId5 ? parseInt(storedId5, 10) : null;


  }
  
 
  private _httpUrl = 'http://localhost:3000/api/';

private createSurveyapiUrl = `${this._httpUrl}createSurvey`; // API URL'si
private createQuestionapiUrl = `${this._httpUrl}createQuestion`; // API URL'si
private updateQuestionapiUrl = `${this._httpUrl}updateQuestion`; // API URL'si
private createQuestionOptionapiUrl = `${this._httpUrl}createQuestionOption`; // API URL'si
private updateQuestionOptionapiUrl = `${this._httpUrl}updateQuestionOption`; // API URL'si
private deleteSurveyapiUrl = `${this._httpUrl}deleteSurvey`; // API URL'si
private deleteQuestionapiUrl = `${this._httpUrl}deleteQuestion`; // API URL'si
private deleteQuestionOptionapiUrl = `${this._httpUrl}deleteQuestionOption`; // API URL'si
private saveUserSurveyAnswersapiUrl = `${this._httpUrl}saveUserSurveyAnswers`; // API URL'si
private getUserSurveyAnswerapiUrl = `${this._httpUrl}getUserSurveyAnswer/`; // API URL'si
private updateUserSurveyAnswerapiUrl = `${this._httpUrl}updateUserSurveyAnswer/`; // API URL'si
private getUserSurveyAnswersBeforeapiUrl  = `${this._httpUrl}getUserSurveyAnswersBefore`; // API URL'si

private saveUserSurveyOpenAnswersapiUrl = `${this._httpUrl}saveUserSurveyOpenAnswers`; // API URL'si
private deleteAllSurveysapiUrl = `${this._httpUrl}deleteAllSurveys`; // API URL'si
private deleteAllQuestionsapiUrl = `${this._httpUrl}deleteAllQuestions`; // API URL'si
private deleteAllOptionsapiUrl = `${this._httpUrl}deleteAllOptions`; // API URL'si
private getUserSurveyOpenAnswersapiUrl = `${this._httpUrl}getUserSurveyOpenAnswers`; // API URL'si

private watchVideoapiUrl = `${this._httpUrl}watchVideo`; // API URL'si
private getWatchStatusapiUrl= `${this._httpUrl}getWatchStatus`; // Yeni API URL'si


getWatchStatus(user_id: number, action: string): Observable<any> {
  let params = new HttpParams().set('user_id', user_id.toString()).set('action', action);
  return this.http.get<any>(this.getWatchStatusapiUrl, { params });
}

watchVideo(user_id: number, action: string): Observable<any> {
  return this.http.post<any>(this.watchVideoapiUrl, { user_id, action });
}

getUserSurveyOpenAnswers(userId: number, surveyId: number): Observable<any> {
  const params = {
    user_id: userId.toString(),
    survey_id: surveyId.toString()
  };

  return this.http.get(this.getUserSurveyOpenAnswersapiUrl, { params });
}
  getSortType(): string {
    return localStorage.getItem(`surveySortType`) || 'newToOld'; // Varsayılan olarak 'newToOld' kullan
  }

  setSortType(sortType: string): void {
      localStorage.setItem(`surveySortType`, sortType);
  }


  deleteAllOptions(questionId: number): Observable<any> {
    return this.http.delete<any>(`${this.deleteAllOptionsapiUrl}/${questionId}`);
  }
  

  deleteAllSurveys(): Observable<string> {
    return this.http.delete<string>(this.deleteAllSurveysapiUrl);
  }
  
  deleteAllQuestions(surveyId: number): Observable<any> {
    return this.http.delete<any>(`${this.deleteAllQuestionsapiUrl}/${surveyId}`);
  }


  getDorduncuAsamaVideoCurrentTime(videoId: string, userId: string): number {
    return Number(localStorage.getItem(`dorduncuAsamaVideoCurrentTime_${videoId}_${userId}`)) || 0;
  }
  getUcuncuAsamaVideoCurrentTime(videoId: string, userId: string): number {
    return Number(localStorage.getItem(`ucuncuAsamaVideoCurrentTime_${videoId}_${userId}`)) || 0;
  }

  setDorduncuAsamaVideoCurrentTime(videoId: string, userId: string, time: number): void {
    localStorage.setItem(`dorduncuAsamaVideoCurrentTime_${videoId}_${userId}`, time.toString());
  }
  setUcuncuAsamaVideoCurrentTime(videoId: string, userId: string, time: number): void {
    localStorage.setItem(`ucuncuAsamaVideoCurrentTime_${videoId}_${userId}`, time.toString());
  }
  
  getUcuncuAsamaVideoUrls(): string[] {
    return JSON.parse(localStorage.getItem('ucuncuAsamaVideoUrls') || '[]');
  }

  setUcuncuAsamaVideoUrls(videoUrls: string[]) {
    localStorage.setItem('ucuncuAsamaVideoUrls', JSON.stringify(videoUrls));
  }

  getDorduncuAsamaVideoUrls(): string[] {
    return JSON.parse(localStorage.getItem('dorduncuAsamaVideoUrls') || '[]');
  }

  setDorduncuAsamaVideoUrls(videoUrls: string[]) {
    localStorage.setItem('dorduncuAsamaVideoUrls', JSON.stringify(videoUrls));
  }

  getUcuncuAsamaBilgilendirmeMetni(): string {
    return localStorage.getItem('ucuncuAsamaBilgilendirmeMetni') || '';
  }
  
  setUcuncuAsamaBilgilendirmeMetni(str: string) {
    localStorage.setItem('ucuncuAsamaBilgilendirmeMetni', str);
  }
  
  getDorduncuAsamaBilgilendirmeMetni(): string {
    return localStorage.getItem('dorduncuAsamaBilgilendirmeMetni') || '';
  }
  
  setDorduncuAsamaBilgilendirmeMetni(str: string) {
    localStorage.setItem('dorduncuAsamaBilgilendirmeMetni', str);
  }
  

  getUcuncuAsamaVideoUrl(): string {
    return localStorage.getItem('ucuncuAsamaVideoUrl') || '';
  }
  
  setUcuncuAsamaVideoUrl(url: string) {
    localStorage.setItem('ucuncuAsamaVideoUrl', url);
  }
  
  getDorduncuAsamaVideoUrl(): string {
    return localStorage.getItem('dorduncuAsamaVideoUrl') || '';
  }
  
  setDorduncuAsamaVideoUrl(url: string) {
    localStorage.setItem('dorduncuAsamaVideoUrl', url);
  }
  
 
  // secilecekAnketId değişkenine erişim için GET metodu
  getBirinciAsamaSecilecekAnketId(): number {
    return this.birinciAsamaSecilenAnketId;
  }

  // secilecekAnketId değişkenine erişim için SET metodu
  setBirinciAsamaSecilecekAnketId(data: number): void {
    this.birinciAsamaSecilenAnketId = data;
    localStorage.setItem('birinciAsamaSecilenAnketId', data.toString());
  }

  getIkinciAsamaSecilecekAnketId(): number {
    return this.ikinciAsamaSecilecekAnketId;
  }

  // secilecekAnketId değişkenine erişim için SET metodu
  setIkinciAsamaSecilecekAnketId(data: number): void {
    this.ikinciAsamaSecilecekAnketId = data;
    localStorage.setItem('ikinciAsamaSecilecekAnketId', data.toString());
  }

  getBesinciAsamaSecilecekAnketId(): number {
    return this.besinciAsamaSecilecekAnketId;
  }

  // secilecekAnketId değişkenine erişim için SET metodu
  setBesinciAsamaSecilecekAnketId(data: number): void {
    this.besinciAsamaSecilecekAnketId = data;
    localStorage.setItem('besinciAsamaSecilecekAnketId', data.toString());
  }

  
  // Tüm anketleri getiren fonksiyon
  getAllSurveys(sortType: string): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:3000/api/surveys?sortType=${sortType}`);
  }
  


  // Yeni bir anket oluşturmak için API'yi çağıran fonksiyon
  createSurvey(survey_name: string, admin_id: number) 
  {
    return this.http.post<any>(this.createSurveyapiUrl, { survey_name, admin_id });
  }

  // Yeni bir soru oluşturmak için API'yi çağıran fonksiyon
  createQuestion(survey_id: number, question_text: string, question_type: string) 
  {
    return this.http.post<any>(this.createQuestionapiUrl, { survey_id, question_text, question_type });
  }

  // Soruyu güncellemek için API'yi çağıran fonksiyon
  updateQuestion(questionId: number, survey_id: number, question_text: string, question_type: string) 
  {
    const url = `${this.updateQuestionapiUrl}/${questionId}`; // ID'ye göre URL oluşturuluyor
    return this.http.put<any>(url, { survey_id, question_text, question_type });
  }

  // Yeni bir soru seçeneği oluşturmak için API'yi çağıran fonksiyon
  createQuestionOption(question_id: number, option_text: string, option_letter: string, is_correct: boolean) 
  {
    return this.http.post<any>(this.createQuestionOptionapiUrl, { question_id, option_text, option_letter, is_correct });
  }

    // Soru seçeneğini güncellemek için API'yi çağıran fonksiyon
  updateQuestionOption(optionId: number, question_id: number, option_text: string, option_letter: string, is_correct: boolean) 
  {
      const url = `${this.updateQuestionOptionapiUrl}/${optionId}`; // ID'ye göre URL oluşturuluyor
      return this.http.put<any>(url, { question_id, option_text, option_letter, is_correct });
  }


  deleteSurvey(surveyId: number) 
  {
    const url = `${this.deleteSurveyapiUrl}/${surveyId}`;
    return this.http.delete(url);
  }

  deleteQuestion(questionId: number) 
  {
    const url = `${this.deleteQuestionapiUrl}/${questionId}`;
    return this.http.delete(url);
  }

  deleteQuestionOption(optionId: number) {
    const url = `${this.deleteQuestionOptionapiUrl}/${optionId}`;
    return this.http.delete(url);
  }
  saveUserSurveyAnswers(user_id: number, survey_id: number, question_id: number, question_option_id: number) {
    const body = { user_id, survey_id, question_id, question_option_id };

    return this.http.post(this.saveUserSurveyAnswersapiUrl, body);
  }


  getUserSurveyAnswer(userId: number, surveyId: number, questionId: number) {
    const apiUrl = `${this.getUserSurveyAnswerapiUrl}${userId}/${surveyId}/${questionId}`;
    return this.http.get(apiUrl);
  }
  
  updateUserSurveyAnswer(answerId: number, questionOptionId: number) {
    const apiUrl = `${this.updateUserSurveyAnswerapiUrl}`;
    const body = { answerId, questionOptionId };
    return this.http.put(apiUrl, body);
  }
  
  getUserSurveyAnswersBefore(userId: number, surveyId: number): Observable<any> {
    return this.http.get(`${this.getUserSurveyAnswersBeforeapiUrl}`, {
      params: {
        user_id: userId.toString(),
        survey_id: surveyId.toString()
      }
    });
  }
 
  saveUserSurveyOpenAnswers(user_id: number, survey_id: number, question_id: number, answer: string) {
    const body = { user_id, survey_id, question_id, answer };

    return this.http.post(this.saveUserSurveyOpenAnswersapiUrl, body);
  }

  

}
