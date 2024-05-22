import { Component } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-kayit-ol',
  templateUrl: './kayit-ol.component.html',
  styleUrls: ['./kayit-ol.component.css']
})
export class KayitOlComponent {
  username: string = '';
  surname: string = '';
  phoneNumber: string = '';
  email: any;
  password: any;

  constructor(private http: HttpClient) {}

  onSubmit() {
    const data = {
      firstName: this.username,
      lastName: this.surname,
      phoneNumber: this.phoneNumber,
      email: this.email,
      password: this.password,
    };

    this.http.post<any>('http://localhost:3000/api/users', data).subscribe(
      (response: HttpResponse<any>) => {
        if (response.status === 201) {
          console.log('Veritabanına kaydedildi', response);
          // Gerekli işlemleri burada gerçekleştirebilirsiniz.
        } else {
          console.error('Bilinmeyen bir hata oluştu.');
        }
      },
      (error) => {
        console.error('Bilinmeyen bir hata oluştu.', error);
      }
    );
  }
}
