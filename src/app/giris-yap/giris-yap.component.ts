import { Component } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router'; // Router'ı ekledik

@Component({
    selector: 'app-giris-yap',
    templateUrl: './giris-yap.component.html',
    styleUrls: ['./giris-yap.component.css']
})
export class GirisYapComponent {
    email: string = '';
    password: string = '';
    sozlesmeOnaylandi: boolean = false; // Yeni eklenen değişken

    constructor(private http: HttpClient, private router: Router) {}

    onSubmit() {
        if (!this.sozlesmeOnaylandi) {
            // Eğer checkbox işaretli değilse, kullanıcıya uyarı göster
            alert('Lütfen aydınlatma metnini onaylayın.');
            return;
        }

        const data = {
            email: this.email,
            password: this.password,
        };

        this.http.post<any>('http://localhost:3000/api/login', data).subscribe(
            (response: HttpResponse<any>) => {
                if (response.status === 200) {
                    console.log('Giriş başarılı', response);

                    // Giriş başarılıysa yeni sayfaya yönlendirme
                    //this.router.navigate(['/yeni-sayfa']);
                } else {
                    console.error('Hatalı giriş bilgileri !! Bilgilerinizi kontrol ediniz !');
                }
            },
            (error) => {
                console.error('Bilinmeyen bir hata oluştu.', error);
            }
        );
    }
}
