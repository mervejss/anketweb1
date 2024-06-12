import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-admin-ana-sayfa',
  templateUrl: './admin-ana-sayfa.component.html',
  styleUrls: ['./admin-ana-sayfa.component.scss'],
})
export class AdminAnaSayfaComponent implements OnInit {


  adminData: any;
  aktifSayfa: string = ''; // Aktif sayfa bilgisini tutacak değişken



  constructor(private http: HttpClient, private router: Router, private _auth: AdminService) {}
  

  ngOnInit(): void {
    this.adminData = this._auth.getAdminData();
    //this._auth.getQuestions();
  }
 
 
  anketleriGoruntule(): void {
      this.aktifSayfa = 'admin-anket-ekle-duzenle'; // Başında / olmadan rotayı belirtin

  }
  kullanicilariGoruntule(): void {
    this.aktifSayfa = 'kullanicilari-goruntule'; // Başında / olmadan rotayı belirtin

}

  anketSorusuEkle(): void {
    this.aktifSayfa = 'admin-anket-ekle'; // Başında / olmadan rotayı belirtin
    //console.log('ANKET SORULARI GÖRÜNTÜLE FONK ÇALIŞTI !!! -> ', this.aktifSayfa);
    //this.router.navigate([this.aktifSayfa]); // Yönlendirme için rotayı belirtin
}

kullanicilaraAnketSec() {
  this.aktifSayfa = 'admin-anket-sec'; // Başında / olmadan rotayı belirtin
}
  
adminRehber() {
  this.aktifSayfa = 'admin-rehber'; // Başında / olmadan rotayı belirtin
  }
  
  adminBildirim() {
    this.aktifSayfa = 'admin-bildirimleri'; // Başında / olmadan rotayı belirtin
    }

}
