import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import { Router } from '@angular/router'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';



@Injectable()
export class UsersService{
    constructor(private http: Http, private _router: Router){
        console.log('User Service Initialized...');
    }
    getAllUsers(){
      const userId = localStorage.getItem("userid");
      console.log('GET ALL USERS CALLED', userId);
      return this.http.get('http://localhost:8008/api/allusers',
                  {params:{userId:userId}})
                  .map(res => res.json());
    }
    getSingleUserToEdit(editUserId){
      const userId = localStorage.getItem("userid");
      console.log('GET ALL USERS CALLED', userId);
      return this.http.get('http://localhost:8008/api/edituser',
                  {params:{userId:userId, editUserId:editUserId}})
                  .map(res => res.json());
    }

    addUser(newUser){
      const userId = localStorage.getItem("userid");
      console.log('Add USER CALLED');
      console.log('User To add: ', newUser.email);
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      return this.http.post('http://localhost:8008/api/adduser', {
                  "userId":userId,
                  "name":newUser.name,
                  "email":newUser.email,
                  "password":newUser.password,
                  "username":newUser.username,
                  "district":newUser.district,
                  "department":newUser.department,
                  "tehsil":newUser.tehsil,
                  "role":newUser.role,
                  "designation":newUser.designation}, options)
                  .map(res => res.json());

    }
    editUser(newUser){
      const userId = localStorage.getItem("userid");
      console.log('Edit USER CALLED');
      console.log('User To Edit: ', newUser);
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      return this.http.post('http://localhost:8008/api/edituser', {
                  "userId":userId,
                  "updateuserId":newUser._id,
                  "name":newUser.name,
                  "email":newUser.email,
                  "password":newUser.password}, options)
                  .map(res => res.json());

    }

}
