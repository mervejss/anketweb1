// kullanicilari-goruntule.component.ts

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'; // Router eklendi

@Component({
  selector: 'app-kullanicilari-goruntule',
  templateUrl: './kullanicilari-goruntule.component.html',
  styleUrls: ['./kullanicilari-goruntule.component.scss']
})
export class KullanicilariGoruntuleComponent implements OnInit {
  users!: any[];
adminAktifSayfa: any;
tiklananUserID: number | null = null; // Tıklanan anketin ID'sini saklayacak değişken

  constructor(private http: HttpClient, private router: Router) { }


  // Tıklanabilir anket containerları
  onUsersClick(userID: number): void {
    this.tiklananUserID = userID; // Tıklanan anketin ID'sini sakla
    console.log(this.tiklananUserID);
    this.adminAktifSayfa = 'kullanici-detaylari'; // Aktif sayfayı güncelle
  }

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:3000/usersAll').subscribe(
      (response) => {
        this.users = response;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  
}
