import { Component, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { LoginService } from '../../services/login.services'
import { DemandService } from '../../services/demand.service'
import { TenderService } from '../../services/tender.service'
import { ConfigsService } from '../../services/configs.service'
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import * as moment from "moment";
import { GlobalEventsManager } from "../../services/eventsmanager.service";
import 'rxjs/add/operator/switchMap';

@Component({
    selector: 'tenderddistricts',
    providers: [DemandService,  
                ConfigsService,
                TenderService ],
    templateUrl: 'tenderddistricts.html',
    styleUrls: ['tender.css']
})

export class tenderddistricts {
  
  demands: any = []
  tenderName: any = ""
  departmentName: any = ""
  districts: any = []
  medCount: any = []
  tenderLocked: boolean = false
  medPrice: any = []
  demStatus: any = []

  constructor(private _router: Router,
              private _route: ActivatedRoute, 
              private _location: Location, 
              private _demandService: DemandService,
              private _tenderService: TenderService,
              private _loginService: LoginService,
              private _configsService: ConfigsService,
              private _eventMangaerService: GlobalEventsManager){

    this._eventMangaerService.showNavBar(true);

  }
  checkLockedTender(){
    this._route.paramMap
      .switchMap((params: ParamMap) =>
        this._tenderService.getTender(params.get('tenderid')))
      .subscribe(tender =>{
        console.log("tender",tender)
        if (tender[0].tender[0].islocked === '1'){
          this.tenderLocked = true
        }
      });
  }
  acceptOrRejectCall(i){
    let demState = this.demStatus[i]
    let district = this.districts[i].district
    this._route.paramMap
      .switchMap((params: ParamMap) =>
        this._demandService.updateDistrictDemandStatus(params.get('tenderid'),
          params.get('departmentid'),district,demState))
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
    for (let i=0;i<this.districts.length;i++){
      this.demStatus[i] = 0;
    }
  }
  getMedCounts(){
    for (let i=0;i<this.districts.length;i++){
      this.medCount[i] = 0;
      this.medPrice[i] = '0.00';
      for (let j=0;j<this.demands.length;j++){
        if (this.districts[i].district === this.demands[j].district){
          this.medCount[i] = parseInt(this.demands[j].medicine.length) 
                            + parseInt(this.medCount[i]);
          this.medPrice[i] =  parseInt(this.demands[j].demandestprice) 
                            + parseInt(this.medPrice[i]);
        }
      }
    }
    console.log("med count->",this.medCount,this.medPrice)
  }
  setDistricts(){
    let dCount = 0;
    for (let i=0;i<this.demands.length;i++){
      let isExist = false;
      for (let j=0;j<this.districts.length;j++){
        if (this.districts[j].district === this.demands[i].district){
          isExist = true
        }
      }
      if (!isExist){
        this.districts[dCount] = this.demands[i];
        dCount++;
      }
    }
    this.getMedCounts();
  }
  ngOnInit() {
    this._route.paramMap
      .switchMap((params: ParamMap) =>
        this._demandService.getDepartmentDemands(params.get('departmentid'),params.get('tenderid')))
      .subscribe(demands => {
        if (!demands[0].status){

        } else {
          this.demands = demands[0].demands;
          this.tenderName = this.demands[0].tendername
          this.departmentName = this.demands[0].departmentname
          this.setDistricts()
          this.setCheckboxes()
          this.checkLockedTender()
          console.log("Demands",this.demands);
        }
      });
  }
  setCheckboxes(){
    console.log('districts->',this.districts)
    for (let i=0;i<this.districts.length;i++){
      let anyUncheck = false, firstkey = true
      for (let j=0;j<this.demands.length;j++){
        this.demStatus[i] = 0
        if (this.districts[i].district === this.demands[j].district
            && this.demands[j].demandstatus === "0"){
          anyUncheck = true
          firstkey = false
          console.log("tender status",this.demands[j].demandstatus)
        }
        if (this.districts[i].district === this.demands[j].district
            && this.demands[j].demandstatus === "1"){
          firstkey = false
        }
      }
      if (!anyUncheck && !firstkey){
        this.demStatus[i] = 1
      }
    }
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