import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import { Router } from '@angular/router'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import * as moment from "moment";

@Injectable()
export class MedicineService{
    constructor(private http: Http, 
                private _router: Router){
      console.log('Medicine Service Initialized...');
    }
    getAllMedicines(){
      const userId = localStorage.getItem("userid");
      return this.http.get("http://localhost:8008/api/allmedicines",{params:{userId:userId}})
        .map(res => res.json());
    }
    getAllMedicinesByDepartment(){
      const userId = localStorage.getItem("userid");
      return this.http.get("http://localhost:8008/api/medicinesbydepartment",{params:{userId:userId}})
        .map(res => res.json());
    }
    addMedicine(newMedicine){
      const userId = localStorage.getItem("userid");
      console.log("new medicine called", newMedicine);
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      return this.http.post("http://localhost:8008/api/addmedicine", {
                                    "userId": userId,
                                    "name": newMedicine.name,
                                    "mediunit": newMedicine.mediunit,
                                    "medisize": newMedicine.medisize,
                                    "meditype": newMedicine.meditype,
                                    "medigenre": newMedicine.medigenre,
                                    "dosage": newMedicine.dosage,
                                    "sgtdquantity": newMedicine.sgtdquantity,
                                    "estprice": newMedicine.estprice,
                                    "chemicalname": newMedicine.chemicalname,
                                    "department": newMedicine.department,
                                    "filereference": newMedicine.filereference}, options)
                   .map(res => res.json());
    }
}