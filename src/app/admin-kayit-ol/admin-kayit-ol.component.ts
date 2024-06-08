import { Component , OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AdminService } from '../services/admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-kayit-ol',
  templateUrl: './admin-kayit-ol.component.html',
  styleUrls: ['./admin-kayit-ol.component.scss']
})
export class AdminKayitOlComponent implements OnInit {
  ngOnInit(){
    
  }

  registerUserData: any = {};

  constructor(private http: HttpClient, private Router: Router, private _auth: AdminService) {}

  registerUser() {
    console.log(this.registerUserData);
    this._auth.registerUser(this.registerUserData)
      .subscribe(
        res => {
          console.log("kayıt edildi" + res);
          localStorage.setItem('token', res.token);
          this.showSuccessAlert('Başarılı', 'Kayıt işlemi başarıyla tamamlandı.');
          this.Router.navigate(['/admin-ana-sayfa']);

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
 

    



