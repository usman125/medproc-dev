import { Component, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { LoginService } from '../../services/login.services'
import { DemandService } from '../../services/demand.service'
import { UsersService } from '../../services/users.service'
import { TenderService } from '../../services/tender.service'
import { ConfigsService } from '../../services/configs.service'
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import * as moment from "moment";
import { GlobalEventsManager } from "../../services/eventsmanager.service";
import 'rxjs/add/operator/switchMap';
import { Subscription } from 'rxjs';


@Component({
    selector: 'tenderdddemands',
    providers: [DemandService,  
                ConfigsService,
                TenderService ],
    templateUrl: 'tenderdddemands.html',
    styleUrls: ['tender.css']
})

export class tenderdddemands {
  demands: any = []
  allUsers: any = []
  tenderName: string = ""
  departmentName: string = ""
  tenderLocked: boolean = false
  district: any = ""
  districtName: string = ""
  medPrice: any = []
  demStatus: any = []
  busyDemands: Subscription;

  constructor(private _router: Router,
              private _route: ActivatedRoute, 
              private _location: Location, 
              private _demandService: DemandService,
              private _userService: UsersService,
              private _tenderService: TenderService,
              private _loginService: LoginService,
              private _configsService: ConfigsService,
              private _eventMangaerService: GlobalEventsManager){

    this._eventMangaerService.showNavBar(true);
  }
  acceptOrRejectCall(i){
    let demState = this.demStatus[i]
    this._route.paramMap
      .switchMap((params: ParamMap) =>
        this._demandService.updateDemandStatus(this.demands[i]._id,demState))
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
    for (let i=0;i<this.demands.length;i++){
      this.demStatus[i] = 0;
    }
  }
  setMedPrice(){
    for (let i=0;i<this.demands.length;i++){
      this.medPrice[i] = parseFloat(this.demands[i].demandestprice);
    }
  }
  getUserById(userId){
    for (let i=0;i<this.allUsers.length;i++){
      if (this.allUsers[i]._id===userId){
        return this.allUsers[i].name
      }
    }
  }
  getAllUsers(){
    this._userService.getAllUsers()
      .subscribe(users =>{
        this.allUsers = users[0].users
        console.log("All Users", this.allUsers)
    });
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
  ngOnInit() {
    this._route.paramMap
      .switchMap((params: ParamMap) =>
      this._demandService.getDDDemands(params.get('departmentid'),params.get('tenderid'),params.get('district')))
      .subscribe(demands => {
        if (!demands[0].status){

        } else {
          this.demands = demands[0].demands;
          this.tenderName = this.demands[0].tendername
          this.departmentName = this.demands[0].departmentname
          this.districtName = this.demands[0].districtname
          this.district = this.demands[0].district
          this.setMedPrice();
          this.setCheckboxes();
          this.getAllUsers();
          this.checkLockedTender();
          console.log("Demands",this.demands);
        }
      });
    
  }
  setCheckboxes(){
    for (let j=0;j<this.demands.length;j++){
      if (this.demands[j].demandstatus === "1"){
        this.demStatus[j] = 1     
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