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

  constructor(private http: HttpClient, private router: Router) { }

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

  showUserDetails(user: any): void {
    //this.router.navigate(['/kullanici-detaylari', user.id]);
    this.router.navigate(['/kullanici-detaylari']);

 
  }
}
