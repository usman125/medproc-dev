import { Component, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { LoginService } from '../../services/login.services'
import { TenderService } from '../../services/tender.service'
import { DemandService } from '../../services/demand.service'
import { ConfigsService } from '../../services/configs.service'
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import * as moment from "moment";
import { GlobalEventsManager } from "../../services/eventsmanager.service";
import 'rxjs/add/operator/switchMap';
import { Subscription } from 'rxjs';

@Component({
    selector: 'tenderdepartments',
    providers: [TenderService,  
                ConfigsService,
                DemandService ],
    templateUrl: 'tenderdepartments.html',
    styleUrls: ['tender.css']
})

export class tenderdepartments {
  
  tender: any = []
  tdepartments: any = []
  tenderdemands: any = []
  medCount: any = []
  medPrice: any = []
  demStatus: any = []
  busyDems: Subscription;
  busyDemsb: Subscription;

  constructor(private _router: Router,
              private _route: ActivatedRoute, 
              private _location: Location, 
              private _service: TenderService,
              private _demandService: DemandService,
              private _loginService: LoginService,
              private _configsService: ConfigsService,
              private _eventMangaerService: GlobalEventsManager){

    this._eventMangaerService.showNavBar(true);

  }
  acceptOrRejectCall(i){
    let demState = this.demStatus[i]
    let deptId = this.tdepartments[i]._id
    this._route.paramMap
      .switchMap((params: ParamMap) =>
        this._demandService.updateDeptDemandStatus(params.get('tenderid'),deptId,demState))
      .subscribe(demands =>{
        console.log("Dem Status Resp",demands)
      });
  }
  acceptOrReject(dep,i){
    if (!dep) {
      this.demStatus[i] = 1
      this.acceptOrRejectCall(i);
    } else  {
      this.demStatus[i] = 0
      this.acceptOrRejectCall(i);
    }
    console.log("Checkbox->",this.demStatus);
  }
  setDemStatus(){
    for (let i=0;i<this.tdepartments.length;i++){
      this.demStatus[i] = 0;
    }
  }
  ngOnInit() {
    this._route.paramMap
      .switchMap((params: ParamMap) =>
        this._service.getTender(params.get('tenderid')))
      .subscribe(tender => {
        if (!tender[0].status){

        } else {
          this.tender = tender[0].tender[0];
          this.tdepartments = tender[0].tender[0].department
          this.setDemStatus();
          this._route.paramMap
            .switchMap((params: ParamMap) =>
              this._demandService.getTenderDemands(params.get('tenderid')))
              .subscribe(demands => {
                console.log("Demands",demands)
                this.tenderdemands = demands[0].demands
                this.setMedicineCount()
                this.setCheckboxes()
          });
          console.log("Tender",this.tender);
        }
      });
  }
  setCheckboxes(){
    console.log('Departments->',this.tdepartments)
    for (let i=0;i<this.tdepartments.length;i++){
      let anyUncheck = false, firstkey = true
      for (let j=0;j<this.tenderdemands.length;j++){
        this.demStatus[i] = 0
        if (this.tdepartments[i]._id === this.tenderdemands[j].department 
            && this.tenderdemands[j].demandstatus === "0"){
          anyUncheck = true
          firstkey = false
          console.log("tender status",this.tenderdemands[j].demandstatus)
        }
        if (this.tdepartments[i]._id === this.tenderdemands[j].department 
            && this.tenderdemands[j].demandstatus === "1"){
          firstkey = false
        }
      }
      if (!anyUncheck && !firstkey){
        this.demStatus[i] = 1
      }
    }
  }
  setMedicineCount(){
    for (let i=0;i<this.tdepartments.length;i++){
      this.medCount[i] = 0;
      this.medPrice[i] = '0.00';
      for (let j=0;j<this.tenderdemands.length;j++){
        if (this.tdepartments[i]._id === this.tenderdemands[j].department){
          this.medCount[i] = parseInt(this.tenderdemands[j].medicine.length) 
                            + parseInt(this.medCount[i]);
          
          this.medPrice[i] =  parseInt(this.tenderdemands[j].demandestprice) 
                            + parseInt(this.medPrice[i]);
        }
      }
    }
    console.log("med count->",this.medCount,this.medPrice)
  }
  goBack(){
    this._location.back()
  }
  // ********** Routing Fucntions **********//
  logout(){
      this._loginService.logout();
  }
  goToRoute(name){
    this._router.navigate([name]);
  }

}