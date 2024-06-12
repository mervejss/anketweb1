import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KayitOlComponent } from './normal-kullanici-kayit-ol/kayit-ol.component';
import { GirisYapComponent } from './normal-kullanici-giris-yap/giris-yap.component';
import { AdminGirisYapComponent } from './admin-giris-yap/admin-giris-yap.component';
import { AdminKayitOlComponent } from './admin-kayit-ol/admin-kayit-ol.component';
//import { AppComponent } from './app.component';
import { AdminAnaSayfaComponent } from './admin-ana-sayfa/admin-ana-sayfa.component';
import { Page1Component } from './page1/page1.component';
import { AnaSayfaComponent } from './ana-sayfa/ana-sayfa.component';
import { AuthGuard } from './services/auth.guard';
import { AdminAnketlerPage1Component } from './admin-anketler-page1/admin-anketler-page1.component';
import { NormalKullaniciAnaSayfaComponent } from './normal-kullanici-ana-sayfa/normal-kullanici-ana-sayfa.component';
import { KullaniciAnketlerPage1Component } from './kullanici-anketler-page1/kullanici-anketler-page1.component';
import { AdminAnketEkleDuzenleComponent } from './admin-anket-ekle-duzenle/admin-anket-ekle-duzenle.component';
import { KullanicilariGoruntuleComponent } from './kullanicilari-goruntule/kullanicilari-goruntule.component';
import { KullaniciDetaylariComponent } from './kullanici-detaylari/kullanici-detaylari.component';
import { AdminAnketEkleComponent } from './admin-anket-ekle/admin-anket-ekle.component';
import { AdminAnketSecComponent } from './admin-anket-sec/admin-anket-sec.component';
import { KullaniciAnketlerPage2Component } from './kullanici-anketler-page2/kullanici-anketler-page2.component';
import { KullaniciAnketlerPage3Component } from './kullanici-anketler-page3/kullanici-anketler-page3.component';
import { KullaniciAnketlerPage4Component } from './kullanici-anketler-page4/kullanici-anketler-page4.component';
import { KullaniciAnketlerPage5Component } from './kullanici-anketler-page5/kullanici-anketler-page5.component';

import { AdminRehberComponent } from './admin-rehber/admin-rehber.component';
import { SurveyDialogComponent } from './survey-dialog/survey-dialog.component';
import { QuestionDialogComponent } from './question-dialog/question-dialog.component';
import { OptionDialogComponent } from './option-dialog/option-dialog.component';
import { UpdateDialogComponent } from './update-dialog/update-dialog.component';

import { NormalKullaniciCevaplarGoruntuleComponent } from './normal-kullanici-cevaplar-goruntule/normal-kullanici-cevaplar-goruntule.component';

import { AdminBildirimleriComponent } from './admin-bildirimleri/admin-bildirimleri.component';


const routes: Routes = [
  //{ path: 'ana-sayfa',  component: AppComponent },
  { path: 'kayit-ol',  component: KayitOlComponent },
  { path: 'giris-yap', component: GirisYapComponent },
  { path: 'admin-kayit-ol',  component: AdminKayitOlComponent },
  { path: 'admin-giris-yap', component: AdminGirisYapComponent },
  { path: 'admin-ana-sayfa', component: AdminAnaSayfaComponent },
  { path: 'anket-sayfası-1',  component: Page1Component },
  { path: 'ana-sayfa',  component: AnaSayfaComponent },
  { path: 'admin-anketler-page1', component: AdminAnketlerPage1Component },
  { path: 'kullanici-anketler-page1', component: KullaniciAnketlerPage1Component },
  { path: 'normal-kullanici-ana-sayfa', component: NormalKullaniciAnaSayfaComponent },
  { path: 'admin-anket-ekle-duzenle', component: AdminAnketEkleDuzenleComponent },
  { path: 'kullanicilari-goruntule', component: KullanicilariGoruntuleComponent },
  { path: 'kullanici-detaylari', component: KullaniciDetaylariComponent },
  { path: 'admin-anket-ekle', component: AdminAnketEkleComponent },
  { path: 'admin-anket-sec', component: AdminAnketSecComponent },
  { path: 'kullanici-anketler-page2', component: KullaniciAnketlerPage2Component },
  { path: 'kullanici-anketler-page3', component: KullaniciAnketlerPage3Component },
  { path: 'kullanici-anketler-page4', component: KullaniciAnketlerPage4Component },
  { path: 'kullanici-anketler-page5', component: KullaniciAnketlerPage5Component },
  { path: 'admin-rehber', component: AdminRehberComponent },
  { path: 'survey-dialog', component: SurveyDialogComponent },
  { path: 'question-dialog', component: QuestionDialogComponent },
  { path: 'option-dialog', component: OptionDialogComponent },
  { path: 'update-dialog', component: UpdateDialogComponent },
  { path: 'normal-kullanici-cevaplar-goruntule', component: NormalKullaniciCevaplarGoruntuleComponent },
  { path: 'admin-bildirimleri', component: AdminBildirimleriComponent },

  //{ path: 'special',   //canActivate: [AuthGuard], component: AdminAnaSayfaComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
