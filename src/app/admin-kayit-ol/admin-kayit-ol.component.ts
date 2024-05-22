import { Component , OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-admin-kayit-ol',
  templateUrl: './admin-kayit-ol.component.html',
  styleUrls: ['./admin-kayit-ol.component.scss']
})
export class AdminKayitOlComponent implements OnInit {
  ngOnInit(){
    
  }

  /*username: string = '';
  surname: string = '';
  phoneNumber: string = '';
  email: any;
  password: any;
   onSubmit() {
    const data = {
      firstName: this.username,
      lastName: this.surname,
      phoneNumber: this.phoneNumber,
      email: this.email,
      password: this.password,
    };
  */

    registerUserData: any = {};

  constructor(private http: HttpClient, private Router: Router, private _auth: AdminService) {}

  registerUser()
  {
    console.log(this.registerUserData)
    this._auth.registerUser(this.registerUserData)
    .subscribe(
      res => {
        console.log("kayıt edildi" + res),
        localStorage.setItem('token', res.token)
      },
      err => console.log(err)
    )
  }

 
  
}
 

    /*this.http.post<any>('http://localhost:3000/api/admins', data, { observe: 'response' }).subscribe(
      (response: HttpResponse<any>) => {
        console.log('Sunucu cevabı:', response);

        if (response.body && response.body.status === 200) {
          console.log('Veritabanına kaydedildi', response);
          alert('Admin Kullanıcı başarıyla kaydedildi ! ');

          this.router.navigate(['/']);
        } else {
          console.error('Bilinmeyen bir hata oluştu.');
        }
      },
      (error) => {
        console.error('Bilinmeyen bir hata oluştu.', error);
      },
      () => {
        console.log('HTTP request completed.');
      }
    );*/




