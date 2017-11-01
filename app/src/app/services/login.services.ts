import { Injectable, Compiler  } from '@angular/core';
// import { RuntimeCompiler } from '@angular/compiler/src/runtime_compiler';

import {Http, Headers, RequestOptions} from '@angular/http';
import { Router } from '@angular/router'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class LoginService{
    constructor(private http:Http, private _router: Router, private _compiler: Compiler){
        console.log('Task Service Initialized...');
    }
    getRolesNav(){
        // var userRole = localStorage.getItem('userrole')
        return this.http.get("http://localhost:8008/api/getnavbar")
                .map(res => res.json());
    }
    getTasks(username, password){
        console.log("get tasks called");
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post('http://localhost:8008/api/auth/login', {"username": username, "password": password})
            .map(res => res.json());
    }
    getAuthUser(userId){
        // var userId = localStorage.getItem('userid')
        console.log("USER ID FROM AUTH USER: ", userId);
        return this.http.get('http://localhost:8008/api/user/'+userId)
            .map(res => res.json());
    }
    loggedIn(){
        if (localStorage.getItem("userid") === null){
          return false
        }
        return true
    }
    logout() {
        this._compiler.clearCache();
        localStorage.removeItem("userid");
        localStorage.removeItem("userrole");
        this._router.navigate(['']);
    }
}