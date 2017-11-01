import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import { Router } from '@angular/router'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';



@Injectable()
export class ContractTemplateService{
  constructor(private http:Http, private _router: Router){
      console.log('Configs Service Initialized...');
  }
  getAllContrcatTemplates(){
    var userId = localStorage.getItem("userid");
    return this.http.get("http://localhost:8008/api/allcontracttemplates", {params:{userId:userId}})
               .map(res => res.json()); 
  }
  addContractTemplate(objectToSave){
    var userId = localStorage.getItem("userid");
    return this.http.post("http://localhost:8008/api/addcontracttemplate", {userId:userId,
                                                                            name:objectToSave.name, 
                                                                            profiletext:objectToSave.profiletext})
               .map(res => res.json());
  }
  getSignleTemplate(templateId){
    var userId = localStorage.getItem("userid");
    console.log("SERVICE SINGLE: ", templateId);
    return this.http.get("http://localhost:8008/api/getsingletemplate", {params: {userId:userId, templateId:templateId}})
     .map(res => res.json());

  }
}