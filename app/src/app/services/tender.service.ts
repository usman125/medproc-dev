import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import { Router } from '@angular/router'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import * as moment from "moment";



@Injectable()
export class TenderService{
    constructor(private http: Http, 
                private _router: Router){
      console.log('Tender Service Initialized...');
    }
    getAllTenders(){
      const userId = localStorage.getItem("userid");
      console.log("GET ALL TENDERS SERVICE",userId)
      return this.http.get("http://localhost:8008/api/alltenders",{params:{userId:userId}})
        .map(res => res.json());
    } 
    getAllClosedTenders(){
      const userId = localStorage.getItem("userid");
      console.log("GET ALL TENDERS SERVICE",userId)
      return this.http.get("http://localhost:8008/api/allclosedtenders",{params:{userId:userId}})
        .map(res => res.json());
    }    
    getPreQualifyTenders(){
      const userId = localStorage.getItem("userid");
      console.log("GET ALL TENDERS SERVICE",userId)
      return this.http.get("http://localhost:8008/api/allprequalifytenders",{params:{userId:userId}})
        .map(res => res.json());
    }
    getAllTendersByDepartment(){
      const userId = localStorage.getItem("userid");
      return this.http.get("http://localhost:8008/api/tendersbydepartment",{params:{userId:userId}})
        .map(res => res.json());
    }
    addTender(newTender){
      const userId = localStorage.getItem("userid");
      console.log("new tender called", newTender);
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      newTender.userId = userId;
      return this.http.post("http://localhost:8008/api/addtender", {
                                  "userId": userId,
                                  "name": newTender.name,
                                  "fiscalyear": newTender.fiscalyear,
                                  "tenderdate": newTender.tenderdate,
                                  "demanddateto": newTender.demanddateto,
                                  "demanddatefrom": newTender.demanddatefrom,
                                  "advdate": newTender.advdate,
                                  "department": newTender.department,
                                  "pubinnews": newTender.pubinnews,
                                  "filefornews": newTender.filefornews,
                                  "pubinppra": newTender.pubinppra,
                                  "filefortender": newTender.filefortender,
                                  "prequalification": newTender.prequalification,
                                  "prequaliprofile": newTender.prequaliprofile,
                                  "techqualiprofile": newTender.techqualiprofile}, options)
                   .map(res => res.json());
    }
    editTender(tenderId){
      const userId = localStorage.getItem("userid");
      return this.http.get("http://localhost:8008/api/edittender/",{params:{tenderId: tenderId, userId: userId}})
                  .map(res => res.json());
    }
    updaeTender(tenderName, tenderId){
      const userId = localStorage.getItem("userid");
      return this.http.get("http://localhost:8008/api/updatetender/",{params:{
                                                                        tenderName: tenderName, 
                                                                        userId: userId,
                                                                        tenderId: tenderId}})
                  .map(res => res.json());
    }

    lockTender(tenderId){
      const userId = localStorage.getItem("userid");
      return this.http.get("http://localhost:8008/api/locktender/",{params:{tenderId: tenderId, userId: userId}})
                  .map(res => res.json());
    }
    getTender(tenderId){
      const userId = localStorage.getItem("userid");
      return this.http.get("http://localhost:8008/api/gettender/",{params:{tenderId: tenderId, userId: userId}})
                  .map(res => res.json());
    }
    getQualiProfile(tenderId){
      const userId = localStorage.getItem("userid");
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      return this.http.get("http://localhost:8008/api/tenderqualiprofiles", {"params": {"userId":userId,"tenderId":tenderId}})
                  .map(res => res.json());    
    }
    closeTender(tenderId){
      const userId = localStorage.getItem("userid");
      return this.http.get("http://localhost:8008/api/closetender", {"params": {"userId":userId,"tenderId":tenderId}})
                  .map(res => res.json());    
    }
}