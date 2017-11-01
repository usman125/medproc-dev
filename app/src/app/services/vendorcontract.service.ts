import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import { Router } from '@angular/router'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';


@Injectable()
export class VendorContractService{
  constructor(private http: Http, 
              private _router: Router){
    console.log('Vendor Contract Service Initialized...');
  }
  getAllVendorContracts(){
    var userId = localStorage.getItem("userid");
    return this.http.get("http://localhost:8008/api/allvendorcontracts",
                {params:{userId:userId}})
                .map(res => res.json());
  }
  getTenderContracts(tenderId){
    var userId = localStorage.getItem("userid");
    return this.http.get("http://localhost:8008/api/gettendercontracts",
                {params:{userId:userId, tenderId:tenderId}})
                .map(res => res.json());
  }

  getFile(vendorId, tenderId){
    var userId = localStorage.getItem("userid");
    return this.http.get("http://localhost:8008/api/getcontractfile", 
                  {params:{userId:userId, vendorId:vendorId, tenderId:tenderId}})
                .map(res => res.json());
  }
  addVendorContract(vendorId,
                    vendorName,
                   tenderId, 
                   contractprofileId,
                   contractprofiletext,
                   contractdate){
    var userId = localStorage.getItem("userid");

    return this.http.post("http://localhost:8008/api/addvendorcontract",
                {userId:userId, 
                         vendorId:vendorId, 
                         vendorname:vendorName, 
                         tenderId:tenderId,
                         contractprofileId:contractprofileId,
                         contractprofiletext:contractprofiletext,
                         contractdate: contractdate})
                .map(res => res.json());
  }
}