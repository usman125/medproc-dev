import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import { Router } from '@angular/router'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';


@Injectable()
export class ConfigsService{
  userId: any;
    constructor(private http:Http, private _router: Router){
        console.log('Configs Service Initialized...');
        this.userId = localStorage.getItem("userid");
    }
    
    allConfigs(){
      return this.http.get("http://localhost:8008/api/configs",{params:{userId:this.userId}})
                 .map(res => res.json());
    }
    // ************ ALL ZONES ********* //
    getAllZones(){
      return this.http.get('http://localhost:8008/api/allzones', {params:{userId:this.userId}})
                  .map(res => res.json());
    }
    // ************ DISTRICTS CONFIGS ********** //
    getAllDistricts(){

      return this.http.get('http://localhost:8008/api/alldistricts', {params:{userId:this.userId}})
                  .map(res => res.json());
    }
    getUserDistrict(){

      return this.http.get('http://localhost:8008/api/userdistrict', {params:{userId:this.userId}})
                  .map(res => res.json());
    }
    addDistrict(newDistrict){
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      return this.http.post('http://localhost:8008/api/adddistrict', {name:newDistrict.name, 
                                                                      zone:newDistrict.zone,
                                                                      userId:this.userId}, options)
                  .map(res => res.json());
    }
    // ********** Department Configs *********** //
    getAllDepartments(){
      return this.http.get('http://localhost:8008/api/alldepartments', {params:{userId:this.userId}})
                  .map(res => res.json());
    }
    addDepartment(newDep){
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      return this.http.post('http://localhost:8008/api/adddepartment', {
            "name": newDep, "userId":this.userId}, options)
            .map(res => res.json());
    }
    editDepartment(name, itemId, configId){
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      console.log("Department id's from edit service: ", "1:",name,"2:", itemId, "3: ", configId);
      return this.http.post("http://localhost:8008/api/editdepartment",{"name":name,
                                                                          "userId":this.userId,
                                                                          "itemId":itemId,
                                                                          "configId":configId} , options)
                 .map(res => res.json());  
    }
    // ********** Tehsil Configs *********** //
    getAllTehsils(){
      return this.http.get('http://localhost:8008/api/alltehsils', {params:{userId:this.userId}})
            .map(res => res.json());
    }
    addNewTehsil(newTehsil){
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      return this.http.post('http://localhost:8008/api/addtehsil', {"name": newTehsil.name, 
                                                                    "district": newTehsil.district, 
                                                                    "userId":this.userId}, options)
            .map(res => res.json());
    }
    editTehsil(name, itemId, configId){
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      console.log("Tehsil id's from edit service: ", "1:",name,"2:", itemId, "3: ", configId);
      return this.http.post("http://localhost:8008/api/edittehsil", {
                  "userId":this.userId, "name":name,"itemId":itemId, "configId":configId}, options)
                 .map(res => res.json());  
    }
    getTehsilsByDistrict(itemName){
      console.log("ALL TEHSILS BY DISTRICT CALLED WITH===== 1:", itemName);
      return this.http.get("http://localhost:8008/api/getTehsilsByDistrict", {params: {userId:this.userId, district:itemName}})
                .map(res => res.json());
    }
    // ********** Facility Type Configs *********** //
    addNewFacilType(newType){
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      return this.http.post('http://localhost:8008/api/addfacilitytype', {
            "userId":this.userId, "name": newType}, options)
            .map(res => res.json());
    }
    editFacilType(name, itemId, configId){
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      console.log("Tehsil id's from edit service: ", "1:",name,"2:", itemId, "3: ", configId);
      return this.http.post("http://localhost:8008/api/editfacilitytype", {
                  "userId":this.userId, "name":name,"itemId":itemId, "configId":configId}, options)
                 .map(res => res.json());  
    }
    // ********** Medicine Type Configs *********** //
    getAllMediType(){
      return this.http.get('http://localhost:8008/api/allmeditype', {params:{userId:this.userId}})
            .map(res => res.json());
    }
    editMediType(name, itemId, configId){
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      console.log("Tehsil id's from edit service: ", "1:",name,"2:", itemId, "3: ", configId);
      return this.http.post("http://localhost:8008/api/editmeditype", {
                  "userId":this.userId, "name":name,"itemId":itemId, "configId":configId}, options)
                 .map(res => res.json());  
    }
    addNewMediType(newType){
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      return this.http.post('http://localhost:8008/api/addmeditype', {
            "userId":this.userId, "name": newType}, options)
            .map(res => res.json());
    }
    // ********** Medicine Unit Configs *********** //
    getAllMediUnit(){
      return this.http.get('http://localhost:8008/api/allmediunit', {params:{userId:this.userId}})
            .map(res => res.json());
    }
    editMediUnit(name, itemId, configId){
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      console.log("Tehsil id's from edit service: ", "1:",name,"2:", itemId, "3: ", configId);
      return this.http.post("http://localhost:8008/api/editmediunit", {
                  "userId":this.userId, "name":name,"itemId":itemId, "configId":configId}, options)
                 .map(res => res.json());  
    }
    addNewMediUnit(newType){
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      return this.http.post('http://localhost:8008/api/addmediunit', {
            "userId":this.userId, "name": newType}, options)
            .map(res => res.json());
    }

    // ********** Facilities Configs *********** //
    editFacility(name, itemId, configId){
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      console.log("Tehsil id's from edit service: ", "1:",name,"2:", itemId, "3: ", configId);
      return this.http.post("http://localhost:8008/api/editfacility", {
                  "userId":this.userId, "name":name,"itemId":itemId, "configId":configId}, options)
                 .map(res => res.json());  
    }
    addNewFacility(newType){
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      return this.http.post('http://localhost:8008/api/addfacility', {
            "userId":this.userId, "name": newType}, options)
            .map(res => res.json());
    }
    
    // ********** Medicine Measurement Unit Configs *********** //
    getAllMediMesUnit(){
      return this.http.get('http://localhost:8008/api/allmedimesunit', {params:{userId:this.userId}})
            .map(res => res.json());
    }    
    editMediMesUnit(name, itemId, configId){
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      console.log("Tehsil id's from edit service: ", "1:",name,"2:", itemId, "3: ", configId);
      return this.http.post("http://localhost:8008/api/editmedimesunit", {
                  "userId":this.userId, "name":name,"itemId":itemId, "configId":configId}, options)
                 .map(res => res.json());  
    }

    addNewMesUnit(newType){
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      return this.http.post('http://localhost:8008/api/addmedimesunit', {
            "userId":this.userId, "name": newType}, options)
            .map(res => res.json());
    }

}