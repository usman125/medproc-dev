import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import { Router } from '@angular/router'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import * as moment from "moment";



@Injectable()
export class BlacklistvendorService{
  constructor(private http: Http, 
              private _router: Router){
    console.log('Black list vendor servcie Initialized...');
  }
  getVendorStats(vendorId){
    var userId = localStorage.getItem('userid');
    return this.http.get("http://localhost:8008/api/getvendorstats", {params:{userId:userId, vendorId:vendorId}})
               .map(res => res.json());
  }
  allBlacklistRequests(){
    var userId = localStorage.getItem('userid');
    return this.http.get("http://localhost:8008/api/allrequestedvendors", {params:{userId:userId}})
               .map(res => res.json());
  }
  allBlacklistedVendors(){
    var userId = localStorage.getItem('userid');
    return this.http.get("http://localhost:8008/api/allblacklistedvendors", {params:{userId:userId}})
               .map(res => res.json());
  }

  approveBlacklist(vendorId, duration, blistcount){
    var userId = localStorage.getItem('userid');
    console.log("BLCKLISE CALLED WITH DURATION:----", duration)
    return this.http.get("http://localhost:8008/api/approveblacklist", {params:{userId:userId, 
                                                                                vendorId:vendorId, 
                                                                                blisttime:duration,
                                                                                blistcount:blistcount}})
               .map(res => res.json());
  }


}