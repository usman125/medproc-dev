import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import { Router } from '@angular/router'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import * as moment from "moment";

@Injectable()
export class FinancialBiddingService{
    constructor(private http: Http, 
                private _router: Router){
      console.log('Financial Bidding Service Initialized...');
    }
    getQualifiedVendors(){
      console.log("Qualified vendor service")
      const userId = localStorage.getItem("userid");
      return this.http.get("http://localhost:8008/api/getqualifiedvendors",{"params": {"userId": userId}})
        .map(res => res.json());
    }
    getAllBids(){
      const userId = localStorage.getItem("userid");
      return this.http.get("http://localhost:8008/api/allfinancialbids",{"params": {"userId": userId}})
        .map(res => res.json());
    }
    tenderFinancialBids(tenderId){
      const userId = localStorage.getItem("userid");
      return this.http.get("http://localhost:8008/api/tenderfinancialbids",{"params": {"userId": userId,"tenderId": tenderId}})
        .map(res => res.json());
    }
    singleTenderMeds(tenderId){
      const userId = localStorage.getItem("userid");
      return this.http.get("http://localhost:8008/api/singletendermeds",{"params": {"userId": userId,"tenderId": tenderId}})
        .map(res => res.json());
    }

    getAllTenderMeds(){
      const userId = localStorage.getItem("userid");
      return this.http.get("http://localhost:8008/api/alltendormeds",{"params": {"userId": userId}})
        .map(res => res.json());
    }
    addFinancialBid(newBid){
      const userId = localStorage.getItem("userid");
      console.log("new bid called", newBid);
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      return this.http.post("http://localhost:8008/api/addfinancialbid",{
                                      "userId": userId,
                                      "tendername": newBid.tendername,
                                      "vendorname": newBid.vendorname,
                                      "tender": newBid.tender,
                                      "vendor": newBid.vendor,
                                      "medicine": newBid.medicine
                                    }, options)
                   .map(res => res.json());
    }
}