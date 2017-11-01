import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import { Router } from '@angular/router'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';



@Injectable()
export class TechicalQualificationService{
    constructor(private http: Http, 
                private _router: Router){
      console.log('Technical Qualification Service Initialized...');
    }
    getAllProfiles(){
      var userId = localStorage.getItem("userid");
      return this.http.get("http://localhost:8008/api/alltechqualiprofiles",
                  {params:{userId:userId}})
                  .map(res => res.json());
    }
    getSingleProfile(profileId){
      var userId = localStorage.getItem("userid");
      return this.http.get("http://localhost:8008/api/singletechprofile/",
                  {params:{profileId:profileId,userId:userId}})
                  .map(res => res.json());
    }
    addTechQualiProfile(newPro){
      var userId = localStorage.getItem("userid");
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      console.log("Add Pre Qualification service with: ", "1:", newPro);
      return this.http.post("http://localhost:8008/api/addtechqualiprofile", {"profilename":newPro.profilename,
                                                                 "userId":userId,
                                                                 "profileschema":newPro.profileschema,
                                                                 "profilepassmarks":newPro.profilepassmarks,
                                                                 "profiletotalmarks":newPro.profiletotalmarks,
                                                                "totalknockdown":newPro.totalknockdown,
                                                                "totalweitage":newPro.totalweitage}, options)
                  .map(res => res.json());
    }
}