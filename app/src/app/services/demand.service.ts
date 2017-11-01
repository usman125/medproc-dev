import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import { Router } from '@angular/router'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import * as moment from "moment";



@Injectable()
export class DemandService{
    constructor(private http: Http, 
                private _router: Router){
      console.log('demand Service Initialized...');
    }
    getAllDemandsByTenderWithStatus(tenderId){
      var userId = localStorage.getItem("userid");
      return this.http.get("http://localhost:8008/api/alldemandsbytenderwithstatus/",{"params":{
                            "userId": userId, "tenderId": tenderId } })
        .map(res => res.json());
    }
    getAllDemands(){
      var userId = localStorage.getItem("userid");
      return this.http.get("http://localhost:8008/api/alldemands/",{"params":{
                            "userId": userId } })
        .map(res => res.json());
    }
    allDashboardDemands(){
      var userId = localStorage.getItem("userid");
      return this.http.get("http://localhost:8008/api/alldashboarddemands",{"params":{
                            "userId": userId } })
        .map(res => res.json());
    }
    allUserDashboardDemands(){
      var userId = localStorage.getItem("userid");
      return this.http.get("http://localhost:8008/api/alluserdashboarddemands",{"params":{
                            "userId": userId } })
        .map(res => res.json());
    }


    getDemandHistory(demandId){
      var userId = localStorage.getItem("userid");
      return this.http.get("http://localhost:8008/api/demandhistory/",{"params":{
                            "userId": userId, "demandId": demandId } })
        .map(res => res.json());
    }
    getUserDemands(){
      var userId = localStorage.getItem("userid");
      return this.http.get("http://localhost:8008/api/userdemands/",{"params":{
                            "userId": userId } })
        .map(res => res.json());
    }
    updateTenderDemandStatus(tenderId,demState){
      var userId = localStorage.getItem("userid");
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      return this.http.post("http://localhost:8008/api/updatetenderdemandstate",{
                                      "userId": userId,
                                      "tenderId": tenderId,
                                      "demState": demState
                                    }, options)
                   .map(res => res.json());
    }
    updateDemandStatus(demandId,demState){
      var userId = localStorage.getItem("userid");
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      return this.http.post("http://localhost:8008/api/updatedemandstate",{
                                      "userId": userId,
                                      "demandId": demandId,
                                      "demState": demState
                                    }, options)
                   .map(res => res.json());
    }
    updateDistrictDemandStatus(tenderId,deptId,district,demState){
      var userId = localStorage.getItem("userid");
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      return this.http.post("http://localhost:8008/api/updatedistrictdemandstate",{
                                      "userId": userId,
                                      "tenderId": tenderId,
                                      "deptId": deptId,
                                      "district": district,
                                      "demState": demState
                                    }, options)
                   .map(res => res.json());
    }
    updateDeptDemandStatus(tenderId,deptId,demState){
      var userId = localStorage.getItem("userid");
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      return this.http.post("http://localhost:8008/api/updatedeptdemandstate",{
                                      "userId": userId,
                                      "tenderId": tenderId,
                                      "deptId": deptId,
                                      "demState": demState
                                    }, options)
                   .map(res => res.json());
    }
    getDDDemands(departmentId,tenderId,districtId){
      var userId = localStorage.getItem("userid");
      console.log("Depat id",departmentId);
      return this.http.get("http://localhost:8008/api/dddemands/",{"params":{
                            "userId": userId, "departmentId": departmentId, "tenderId": tenderId,
                            "districtId": districtId } })
        .map(res => res.json());
    }
    getDepartmentDemands(departmentId,tenderId){
      var userId = localStorage.getItem("userid");
      console.log("Depat id",departmentId);
      return this.http.get("http://localhost:8008/api/departmentdemands/",{"params":{
                            "userId": userId, "departmentId": departmentId, "tenderId": tenderId } })
        .map(res => res.json());
    }
    getTenderDemands(tenderId){
      var userId = localStorage.getItem("userid");
      return this.http.get("http://localhost:8008/api/tenderdemands/",{"params":{
                            "userId": userId, "tenderId": tenderId } })
        .map(res => res.json());
    }

    getUserTenderDemands(tenderId){
      var userId = localStorage.getItem("userid");
      return this.http.get("http://localhost:8008/api/usertenderdemands/",{"params":{
                            "userId": userId, "tenderId": tenderId } })
        .map(res => res.json());
    }
    getUserFullDemands(tenderId){
      var userId = localStorage.getItem("userid");
      return this.http.get("http://localhost:8008/api/userfulldemands/",{"params":{
                            "userId": userId, "tenderId": tenderId } })
        .map(res => res.json());
    }

    getSingleDemand(demandId){
      var userId = localStorage.getItem("userid");
      return this.http.get("http://localhost:8008/api/demand/",{"params":{
                            "demandId": demandId, "userId": userId } })
        .map(res => res.json());
    }
    addDemand(newDemand){
      var userId = localStorage.getItem("userid");
      console.log("new demand called", newDemand);
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      return this.http.post("http://localhost:8008/api/adddemand",{
                                      "userId": userId,
                                      "year": newDemand.year,
                                      "district": newDemand.district,
                                      "tenderref": newDemand.tender,
                                      "tendername": newDemand.tendername,
                                      "medicine": newDemand.medicine
                                    }, options)
                   .map(res => res.json());
    }
    editDemand(demandId,medicines){
      var userId = localStorage.getItem("userid");
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      return this.http.post("http://localhost:8008/api/editdemand",{
                                      "userId": userId,
                                      "demandId": demandId,
                                      "medicine": medicines
                                    }, options)
                   .map(res => res.json());
    }
}