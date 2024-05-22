// admin-giris-yap.component.ts

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AdminService } from '../services/admin.service';


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
    console.log('ADMIN LOGINUSER ÇALIŞTI BAK :',this.loginUserData);

    console.log(this.loginUserData);
    this._auth.loginUser(this.loginUserData)
      .subscribe(
        (res: any) => {
          console.log("Giriş yapıldı", res);
          localStorage.setItem('token', res.token);
          
          //BURADA ADMİNİN VERİLERİNİ ÇEKME APİSİNİ KULLANMAMIZ LAZIM. 
          // Admin verilerini çekmek için API'yi çağır
          this._auth.getAdminInfo(this.loginUserData)
          .subscribe(
            (res: any) => {
              console.log("Admin verileri alındı", res);
              localStorage.setItem('token', res.token);
              this.adminData = res
              this._auth.setAdminData(res);

              // Admin verileri başarıyla alındı, yönlendirme yapılabilir
              this.router.navigate(['/admin-ana-sayfa']);
            },
            err => console.log("Admin verileri alınamadı", err)
          );

        },
        err => console.log(err)
      );
  }



}



