import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import { Router } from '@angular/router'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import * as moment from "moment";

@Injectable()
export class PurchaseOrderService{
    constructor(private http: Http, 
                private _router: Router){
      console.log('Purchase Order Service Initialized...');
    }
    getAllOrders(){
      const userId = localStorage.getItem("userid");
      return this.http.get("http://localhost:8008/api/allpurchaseorders",{"params": {"userId": userId}})
        .map(res => res.json());
    }
    getClosedTenderMeds(tenderId){
      const userId = localStorage.getItem("userid");
      return this.http.get("http://localhost:8008/api/getclosedtendermeds",{"params": {"userId": userId,"tenderId": tenderId}})
        .map(res => res.json());
    }
    getUserDemands(){
      const userId = localStorage.getItem("userid");
      return this.http.get("http://localhost:8008/api/getuserdemands",{"params": {"userId": userId}})
        .map(res => res.json());
    }
    getUserZone(){
      const userId = localStorage.getItem("userid");
      return this.http.get("http://localhost:8008/api/getuserzone",{"params": {"userId": userId}})
        .map(res => res.json());
    }
    getTenderPos(tenderId){
      const userId = localStorage.getItem("userid");
      return this.http.get("http://localhost:8008/api/gettenderpos",{"params": {"userId": userId,
                                                                                "tenderId": tenderId}})
        .map(res => res.json());
    }
    addPurchaseOrder(newOrder, poHTML, userName){
      const userId = localStorage.getItem("userid");
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      return this.http.post("http://localhost:8008/api/addpurchaseorder",{
                                      "userId": userId,
                                      "ponumber": newOrder.ponumber,
                                      "leadtime": newOrder.leadtime,
                                      "createdat": newOrder.createdat,
                                      "tendername": newOrder.tendername,
                                      "vendorname": newOrder.vendorname,
                                      "tender": newOrder.tender,
                                      "vendor": newOrder.vendor,
                                      "poHTML": poHTML,
                                      "userName": userName,
                                      "medicine": newOrder.medicine
                                    }, options)
                   .map(res => res.json());
    }
}