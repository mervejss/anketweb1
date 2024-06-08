//C:\angular\anketweb-main\src\app\services\token-interceptor.service.ts
import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http'
import { AdminService } from './admin.service';
@Injectable()
export class TokenInterceptorService implements HttpInterceptor {

  constructor(private injector: Injector){}
  intercept(req: { clone: (arg0: { headers: any; }) => any; headers: { set: (arg0: string, arg1: string) => any; }; }, next: { handle: (arg0: any) => any; }) {
    let authService = this.injector.get(AdminService)
    let tokenizedReq = req.clone(
      {
        headers: req.headers.set('Authorization', 'bearer ' + authService.getToken())
      }
    )
    return next.handle(tokenizedReq)
  }

}

