import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import { Router } from '@angular/router'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import * as moment from "moment";

@Injectable()
export class GoodsRecievedService{
    constructor(private http: Http, 
                private _router: Router){
      console.log('Goods Recieved Service Initialized...');
    }
    updateGoodsRecieved(goods){
      const userId = localStorage.getItem("userid");
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      return this.http.put("http://localhost:8008/api/updategoodsrecieved",{
                                      "userId": userId,
                                      "goods": goods
                                    }, options)
                   .map(res => res.json());
    }
    raiseLateIssuance(orderId){
      const userId = localStorage.getItem("userid");
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      return this.http.put("http://localhost:8008/api/raiselateissuance",{
                                      "userId": userId,
                                      "orderId": orderId
                                    }, options)
                   .map(res => res.json());
    }
}