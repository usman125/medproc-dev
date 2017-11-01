import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.services';

@Component({
    selector: 'blank',
    providers: [],
    templateUrl: 'blank.html'
})

export class blank {

    constructor(private _router: Router, private _loginService: LoginService){
    }
    
    logout(){
        this._loginService.logout();
    }
    goToRoute(name){
      this._router.navigate([name]);
    }

}