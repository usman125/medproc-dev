import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import { Router } from '@angular/router'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class VendorTechQualiService{
  constructor(private http: Http, 
              private _router: Router){
    console.log('Vendor Technical Qualification Service Initialized...');
  }
  getAllVendorTechQualifications(){
    var userId = localStorage.getItem("userid");
    return this.http.get("http://localhost:8008/api/allvendortechqualiprofiles",
                {params:{userId:userId}})
                .map(res => res.json());
  }  
  addVendorTechQualifications(vendorId,
                             tenderId, 
                             newJson,
                             qualiprofileId,
                             vandorQualifyStatus){
    var userId = localStorage.getItem("userid");
    return this.http.post("http://localhost:8008/api/addvendortechqualiprofile",
                {userId:userId, 
                         vendorId:vendorId, 
                         tenderId:tenderId,
                         profileschema:newJson,
                         qualiprofileId:qualiprofileId,
                         vendorstatus: vandorQualifyStatus})
                .map(res => res.json());
  }
  editTechQualiProfile(vendorId, qualiprofileId){
    var userId = localStorage.getItem("userid");
    return this.http.get("http://localhost:8008/api/editvendortechqualiprofile", {params:{userId: userId, 
                                      vendorId: vendorId, qualiprofileId: qualiprofileId}})
              .map(res => res.json());
  }
  updateTechQualiProfile(vendorId,
                       tenderId, 
                       newEditJson,
                       qualiprofileId,
                       vandorQualifyStatus){
    var userId = localStorage.getItem("userid");
    return this.http.post("http://localhost:8008/api/updatevendortechqualiprofile", {userId:userId, 
                                                                                     vendorId:vendorId, 
                                                                                     tenderId:tenderId,
                                                                                     profileschema:newEditJson,
                                                                                     qualiprofileId:qualiprofileId,
                                                                                     vendorstatus: vandorQualifyStatus}) 
                .map(res => res.json());          
  }  
}