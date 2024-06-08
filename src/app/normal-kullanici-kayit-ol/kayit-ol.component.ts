import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { NormalKullaniciService } from '../services/normal-kullanici.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-kayit-ol',
  templateUrl: './kayit-ol.component.html',
  styleUrls: ['./kayit-ol.component.css']
})
export class KayitOlComponent implements OnInit{
  registerUserData: any = {};
  normalKullaniciData: any ;



  constructor(private http: HttpClient, private Router: Router, private _auth: NormalKullaniciService) {}
  ngOnInit() {
 
    if (this._auth.loggedIn()) {
      this.normalKullaniciData = this._auth.getUserData();

    const userId = this.normalKullaniciData.id; // Kullanıcı ID'sini al

    this.logUserActivityLogin(userId); 
      this.Router.navigate(['/normal-kullanici-ana-sayfa']);
    } else {
      this.Router.navigate(['/kayit-ol']);
    }

  }
  logUserActivityLogin(id: any) {
    const activityLog = {
      user_id: id,
      action: 'login',
      //       stage, video_1_watched ve video_2_watched opsiyonel olarak eklenebilir
    };

    this._auth.addUserActivityLogLogin(activityLog).subscribe(
      (res: any) =>  {
        console.log('Activity logged:', res);
      },
      error => {
        console.error('Error logging activity:', error);
      }
    );
  }
  registerUser() {
    console.log(this.registerUserData);
    this._auth.registerUser(this.registerUserData)
      .subscribe(
        res => {
          console.log("Kayıt edildi", res);
          localStorage.setItem('token', res.token);
          this.showSuccessAlert('Başarılı', 'Kayıt işlemi başarıyla tamamlandı.');
          this.Router.navigate(['/normal-kullanici-ana-sayfa']);

        },
        err => {
          console.log(err);
          this.showErrorAlert('Hata', 'Kayıt işlemi sırasında bir hata oluştu.');
        }
      );
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
