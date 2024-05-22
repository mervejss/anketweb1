import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http'; // HttpClient'ı ekledik
import { AdminService } from './services/admin.service';
import { NormalKullaniciService } from './services/normal-kullanici.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
  
})
export class AppComponent implements OnInit{
  title = 'anketweb';
  firstName: string = '';
  lastName: string = '';
  phoneNumber: string = '';
  normalKullaniciData: any;
  userId: any;
  constructor(private router: Router, private http: HttpClient, private adminService: AdminService, private NormalKullaniciService: NormalKullaniciService) {} // HttpClient'ı burada da ekledik

  ngOnInit(): void {
    this.normalKullaniciData = this.NormalKullaniciService.getUserData();
    this.userId = this.normalKullaniciData.id; // Kullanıcı ID'sini al

  }

  logUserActivityLogin(id: any) {
    const activityLog = {
      user_id: id,
      action: 'logout',
      //       stage , video_1_watched ve video_2_watched opsiyonel olarak eklenebilir
    };

    this.NormalKullaniciService.addUserActivityLogLogin(activityLog).subscribe(
      (res: any) =>  {
        console.log('Activity logged:', res);
      },
      error => {
        console.error('Error logging activity:', error);
      }
    );
  }
  showKayitOl() {
    this.NormalKullaniciService.loggedIn()
    this.router.navigate(['/kayit-ol']);
  }
 showGirisYap() {
  this.NormalKullaniciService.loggedIn()

    this.router.navigate(['/giris-yap']);
  }

  showAdminKayitOl() {
    this.router.navigate(['/admin-kayit-ol']);
  }
 showAdminGirisYap() {
  this.adminService.loggedIn

  //this.router.navigate(['/admin-giris-yap']);
}

showSistemCikisYap() {
  this.logUserActivityLogin(this.userId); 

  this.adminService.logoutUser()
  this.NormalKullaniciService.logoutUser()

}

showSistemGiris() {
  this.router.navigate(['/ana-sayfa']);
}
showAnaSayfa() {
  this.router.navigate(['/']);
}

  onSubmit() {
    const userData = {
      firstName: this.firstName,
      lastName: this.lastName,
      phoneNumber: this.phoneNumber
    };

    this.http.post('YOUR_BACKEND_API_ENDPOINT', userData)
      .subscribe((response) => {
        console.log('Kayıt Başarılı:', response);
      }, (error) => {
        console.error('Kayıt sırasında bir hata oluştu:', error);
      });
  }
}
