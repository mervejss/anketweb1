// admin-giris-yap.component.ts

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AdminService } from '../services/admin.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-admin-giris-yap',
  templateUrl: './admin-giris-yap.component.html',
  styleUrls: ['./admin-giris-yap.component.scss'],
})
export class AdminGirisYapComponent implements OnInit {
  ngOnInit() {
    this.loginUser()
  }
  adminData: any = {};

  loginUserData: any = {};
  constructor(private http: HttpClient, private router: Router, private _auth: AdminService) { }


  loginUser() {
    console.log('ADMIN LOGINUSER ÇALIŞTI BAK :', this.loginUserData);
    console.log(this.loginUserData);
    this._auth.loginUser(this.loginUserData)
      .subscribe(
        (res: any) => {
          console.log("Giriş yapıldı", res);
          localStorage.setItem('token', res.token);
          
          // Admin verilerini çekmek için API'yi çağır
          this._auth.getAdminInfo(this.loginUserData)
            .subscribe(
              (adminRes: any) => {
                console.log("Admin verileri alındı", adminRes);
                this.adminData = adminRes;
                this._auth.setAdminData(adminRes);

                // Admin verileri başarıyla alındı, hoş geldiniz mesajını göster
                this.showSuccessAlert('Giriş Başarılı', `Hoş geldiniz "${this.adminData.first_name} ${this.adminData.last_name}" (Admin Kullanıcı), başarıyla giriş yaptınız.`);
                
                // Yönlendirme yapılabilir
                this.router.navigate(['/admin-ana-sayfa']);
              },
              err => {
                console.log("Admin verileri alınamadı", err);
                this.showErrorAlert('Hata', 'Admin verileri alınamadı.');
                //this.showErrorAlert('Hata', 'Giriş işlemi başarısız oldu.');

              }
            );
        },
        err => {
          console.log(err);
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



