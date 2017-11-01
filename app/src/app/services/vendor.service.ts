import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import { Router } from '@angular/router'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';



@Injectable()
export class VendorService{
    constructor(private http: Http, 
                private _router: Router){
      console.log('Vendor Service Initialized...');
    }
    getAllVendors(){
        var userId = localStorage.getItem("userid");
      return this.http.get("http://localhost:8008/api/allvendors",
                  {params:{userId:userId}})
                  .map(res => res.json());
    }
    getSingleVendor(vendorId){
        var userId = localStorage.getItem("userid");
        return this.http.get("http://localhost:8008/api/getsinglevendor",
                  {params:{userId:userId, vendorId:vendorId}})
                  .map(res => res.json());
    }
    getQualifiedVendors(){
        var userId = localStorage.getItem("userid");
        return this.http.get("http://localhost:8008/api/qualifiedvendors",
                  {params:{userId:userId}})
                  .map(res => res.json());
    }
    addVendor(newVendor){
        var userId = localStorage.getItem("userid");
        console.log("new vendor called", newVendor);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        newVendor.userId = userId;
        return this.http.post("http://localhost:8008/api/addvendor", {
                    "userId":newVendor.userId,
                    "name": newVendor.name,
                    "address": newVendor.address,
                    "city": newVendor.city,
                    "phonenumber": newVendor.phonenumber,
                    "email": newVendor.email,
                    "website": newVendor.website,
                    "dateofestablishment": newVendor.dateofestablishment,
                    "businesstype": newVendor.businesstype,
                    "focalpersonname": newVendor.focalpersonname,
                	  "focalpersonnumber": newVendor.focalpersonnumber}, options)
                   .map(res => res.json());
    }
    getAllPreQualiedVendors(qualiprofileId){
        var userId = localStorage.getItem("userid");
        return this.http.get("http://localhost:8008/api/getprequaliedvendors", {params:{userId:userId, qualiprofileId:qualiprofileId}})
                    .map(res => res.json());
    }
    getFinancialVandors(tenderId){
        var userId = localStorage.getItem("userid");
        return this.http.get("http://localhost:8008/api/getfinancialvendors", {params:{userId:userId, tenderId:tenderId}})
                    .map(res => res.json())
    }
    getTenderMeds(tenderId){
        var userId = localStorage.getItem("userid");
        return this.http.get("http://localhost:8008/api/gettendermeds", {params:{userId:userId, tenderId:tenderId}})
                    .map(res => res.json())
    }
    updateActiveStatus(vendorId, duration){
        var userId = localStorage.getItem("userid");
        return this.http.get("http://localhost:8008/api/updateactivestatus", {params:{userId:userId, vendorId:vendorId, blisttime:duration}})
                    .map(res => res.json())
    }
}