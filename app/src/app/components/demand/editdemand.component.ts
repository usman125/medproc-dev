import { Component, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { LoginService } from '../../services/login.services';
import { DemandService } from '../../services/demand.service';
import { MedicineService } from '../../services/medicine.service';
import { ConfigsService } from '../../services/configs.service';
import { TenderService } from '../../services/tender.service';
import { DemandMedicine } from '../../models/demand';
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import * as moment from "moment";
import { GlobalEventsManager } from "../../services/eventsmanager.service";
import 'rxjs/add/operator/switchMap';

@Component({
    selector: 'editdemand',
    providers: [DemandService, MedicineService, ConfigsService, TenderService],
    templateUrl: 'editdemand.html',
    styleUrls: ['demand.css']
})

export class editdemand {
  demand: any = []
  demandHistory: any = []
  medicines: any = []
  quantity: any = []
  reason: any = []
  isValid: boolean = false
  tenderLocked: boolean = false
  demandUserName: any = null;
  dt: Date = new Date();
  public minDate: Date = void 0;
  constructor(private _router: Router, 
              private _service: DemandService,
              private _route: ActivatedRoute,
              private _location: Location,
              private _medicineService: MedicineService,
              private _configsService: ConfigsService,
              private _tenderService: TenderService,
              private _loginService: LoginService,
              private _formBuilder: FormBuilder,
              private _eventMangaerService: GlobalEventsManager){
    (this.minDate = new Date()).setDate(this.minDate.getDate() - 1000);
    this._eventMangaerService.showNavBar(true);
  }
  ngOnInit() {
    this._route.paramMap
      .switchMap((params: ParamMap) =>
         this._service.getSingleDemand(params.get('demandid')))
      .subscribe(demand => {
        console.log("Demand",demand)
        this.demand = demand[0].demand
        this.medicines = demand[0].demand.medicine
        this.demandUserName = demand[0].demand.user[0].name;
        console.log("DEMAND USER NAME _________:", demand[0].demand.user[0].name);
        this.checkLockedTender(this.demand.tenderref)
      });
    this.getDemandHistory();
  }
  checkLockedTender(tenderId){
    console.log("Tenderid",tenderId)
    this._tenderService.getTender(tenderId)
      .subscribe(tender => {
        console.log("tender",tender)
        if (tender[0].tender[0].islocked === '1'){
          this.tenderLocked = true
        }
      });
      console.log("TEnder is locked",this.tenderLocked)
  }
  getDemandHistory(){
    this._route.paramMap
      .switchMap((params: ParamMap) =>
        this._service.getDemandHistory(params.get('demandid')))
      .subscribe(demand => {
        this.demandHistory = demand[0].demands
        this.demandHistory.reverse()
        console.log("Demand History",this.demandHistory)
      });
  }
  checkValid(){
    for (let med of this.medicines){
      if (med.newquantity && med.newreason) {
        this.isValid = true
        return
      } else {
        this.isValid = false
      }
    }
  }
  changeQuantity(i,e,m){
    console.log(i,e,m);
    this.quantity[i] = e
    this.medicines[i].newquantity = e
    console.log("Quantity",this.medicines)
    this.checkValid()
  }
  changeReason(i,e,m){
    console.log(i,e,m);
    this.reason[i] = e
    this.medicines[i].newreason = e
    console.log("Reason",this.reason)
    this.checkValid()
  }
  editDemand(){
    console.log("editdemand")
    this._route.paramMap
    .switchMap((params: ParamMap) =>
       this._service.editDemand(params.get('demandid'),this.medicines))
    .subscribe(demand => {
      console.log("Demand",demand)
      this.demand = demand[0].demand.newdemand
      this.demandHistory = []
      this.reason = []
      this.quantity = []
      this.getDemandHistory()
    });
  }
  goBack(){
    this._location.back()
  }
  // ********** Routing Fucntions **********//
  logout(){
      this._loginService.logout();
  }
  goToHome(){
    this._router.navigate(['home']);
  }
  goToTenders(){
    this._router.navigate(['tenders']);

  }
  goToVendors(){
    this._router.navigate(['vendors']);

  }
  goToMedicines(){
    this._router.navigate(['medicines']);

  }
  goToDemands(){
    this._router.navigate(['demands']);
  }
  goToDepartments(){
    this._router.navigate(['departments']);

  }    
  goToReports(){
    this._router.navigate(['reports']);

  }    
  goToConfigs(){
    this._router.navigate(['configs']);
  }

}