import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import { Router } from '@angular/router'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import * as moment from "moment";



@Injectable()
export class BlacklistRequestService{
  constructor(private http: Http, 
              private _router: Router){
    console.log('Black list request servcie Initialized...');
  }
  addBlacklistRequest(vendorId){
    var userId = localStorage.getItem('userid');
    return this.http.post("http://localhost:8008/api/addblacklistrequest", {userId:userId, vendorId:vendorId})
               .map(res => res.json());
  }
  allBlacklistRequests(){
    var userId = localStorage.getItem('userid');
    return this.http.get("http://localhost:8008/api/allblacklistrequests", {params:{userId:userId}})
               .map(res => res.json());
  }

}