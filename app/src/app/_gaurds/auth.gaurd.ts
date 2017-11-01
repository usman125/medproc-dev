import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { LoginService } from '../services/login.services';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private _service: LoginService, private router: Router) {}

  canActivate() {
    if(this._service.loggedIn()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
