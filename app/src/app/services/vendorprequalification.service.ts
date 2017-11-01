import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import { Router } from '@angular/router'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';



@Injectable()
export class VendorPreQualiService{
  constructor(private http: Http, 
              private _router: Router){
    console.log('Vendor Service Initialized...');
  }
  getAllVendorPreQualifications(){
    var userId = localStorage.getItem("userid");
    return this.http.get("http://localhost:8008/api/allvendorprequaliprofiles",
                {params:{userId:userId}})
                .map(res => res.json());
  }  
  addVendorPreQualifications(vendorId,
                             tenderId, 
                             newJson,
                             qualiprofileId,
                             vandorQualifyStatus){
    var userId = localStorage.getItem("userid");
    return this.http.post("http://localhost:8008/api/addvendorprequaliprofile",
                {userId:userId, 
                         vendorId:vendorId, 
                         tenderId:tenderId,
                         profileschema:newJson,
                         qualiprofileId:qualiprofileId,
                         vendorstatus: vandorQualifyStatus})
                .map(res => res.json());
  }
  editPreQualiProfile(vendorId, qualiprofileId){
    var userId = localStorage.getItem("userid");
    return this.http.get("http://localhost:8008/api/editvendorprequaliprofile", {params:{userId: userId, 
                                      vendorId: vendorId, qualiprofileId: qualiprofileId}})
              .map(res => res.json());
  }
  updatePreQualiProfile(vendorId,
                       tenderId, 
                       newEditJson,
                       qualiprofileId,
                       vandorQualifyStatus){
    var userId = localStorage.getItem("userid");
    return this.http.post("http://localhost:8008/api/updatevendorprequaliprofile", {userId:userId, 
                                                                                     vendorId:vendorId, 
                                                                                     tenderId:tenderId,
                                                                                     profileschema:newEditJson,
                                                                                     qualiprofileId:qualiprofileId,
                                                                                     vendorstatus: vandorQualifyStatus}) 
                .map(res => res.json());          
  }
}