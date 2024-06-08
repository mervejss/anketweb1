import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'; // Router'ı ekledik
import { NormalKullaniciService } from '../services/normal-kullanici.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-giris-yap',
    templateUrl: './giris-yap.component.html',
    styleUrls: ['./giris-yap.component.css']
})
export class GirisYapComponent implements OnInit{
  

  sozlesmeCheckBox: any; // Yeni eklenen değişken
  userData: any = {};
  loginUserData: any = {};
  normalKullaniciData: any ;

  constructor(private http: HttpClient, private router:  Router, private _auth: NormalKullaniciService) {}

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
  ngOnInit() {
    

    if (this._auth.loggedIn()) {
      this.normalKullaniciData = this._auth.getUserData();

      const userId = this.normalKullaniciData.id; // Kullanıcı ID'sini al
  
      this.logUserActivityLogin(userId); 
    this.router.navigate(['/normal-kullanici-ana-sayfa']);
  } else {


  

    this.sozlesmeCheckBox= this._auth.getOnayDurumu();
    console.log('ngOnInit() ÇALIŞTI ! ve  this.sozlesmeCheckBox :  ', this.sozlesmeCheckBox);

    if (this.sozlesmeCheckBox) 
      {
      this.onSubmit();
      //this.loginUser();
      console.log('this.sozlesmeCheckBox === true ve this.loginUser(); ÇAĞIRILDI',);
      //this.onSubmit(); // onSubmit() yöntemini doğrudan çağırın

    }

  }
  }

  onSubmit() {
    console.log('onSubmit() ÇALIŞTI ! ve  !this.sozlesmeCheckBox :  ', this.sozlesmeCheckBox,!this.sozlesmeCheckBox);

    if (!this.sozlesmeCheckBox) {
      // Eğer checkbox işaretli değilse, kullanıcıya uyarı göster
      alert('Lütfen aydınlatma metnini onaylayın.');
      return;
    } else {
      console.log('onSubmit() else ÇALIŞTI !  ');

      this._auth.setOnayDurumu('true');
      this.loginUser();
    }
  }
    
       
    

  loginUser() {
    console.log('LOGINUSER ÇALIŞTI BAK :', this.loginUserData);
  
    this._auth.loginUser(this.loginUserData)
      .subscribe(
        (res: any) => {
          console.log("Giriş yapıldı", res);
          localStorage.setItem('token', res.token);
          
          this._auth.getUserInfo(this.loginUserData)
            .subscribe(
              (userInfoRes: any) => {
                console.log("Kullanici verileri alındı", userInfoRes);
                localStorage.setItem('token', userInfoRes.token);
                this.userData = userInfoRes;
                this._auth.setUserData(userInfoRes);
                console.log('this.normalKullaniciData.id :', userInfoRes.id);
                
                // Kullanıcı giriş yaptığında hoş geldiniz mesajını göster
                this.showSuccessAlert('Giriş Başarılı', `Hoş geldiniz "${userInfoRes.first_name} ${userInfoRes.last_name}" (Normal Kullanıcı), başarıyla giriş yaptınız.`);

                // Kullanıcı giriş yaptığında user_activity_logs için yeni bir kayıt oluşturmalıyız
                // action = 'login', user_id = ?
                
                this.router.navigate(['/normal-kullanici-ana-sayfa']);
              },
              err => {
                console.log("Normal Kullanici verileri alınamadı", err);
                this.showErrorAlert('Hata', 'Kullanıcı verileri alınamadı.');
              }
            );
        },
        err => {
          console.log(err);
          //this.showErrorAlert('Hata', 'Giriş işlemi başarısız oldu.');
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
