import { Component, ElementRef } from '@angular/core';
import { LoginService } from '../../services/login.services';
import * as _ from "lodash";
import { DemandService } from '../../services/demand.service';
import { MedicineService } from '../../services/medicine.service';
import { ConfigsService } from '../../services/configs.service';
import { TenderService } from '../../services/tender.service';
import { DemandMedicine } from '../../models/demand';
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from "moment";
import { GlobalEventsManager } from "../../services/eventsmanager.service";
import { Subscription } from 'rxjs'

@Component({
    selector: 'demands',
    providers: [DemandService, MedicineService, ConfigsService, TenderService],
    templateUrl: 'demand.html',
    styleUrls: ['demand.css']
})

export class demand {

    filterQuery:any = null;
    filterOption:any = null;

    allDemands:any = [];
    allMedicines:any = [];
    allDistricts:any = [];
    userDistrict:any = null;
    allConfigs:any = [];
    allTenders:any = [];
    selectedMedicines:any = [];
    selected:any = [];
    singleDemand: any;
    demandFormFlag: boolean = false;
    singleDemandFlag: boolean = false;
    addDemandForm: FormGroup;
    public fiscalYear = moment().format('YYYY')+"-"+moment().add(1,'years').format('YYYY');
    busyDemand: Subscription;

    constructor(private _router: Router, 
                private _service: DemandService,
                private _medicineService: MedicineService,
                private _configsService: ConfigsService,
                private _tenderService: TenderService,
                private _loginService: LoginService,
                private _formBuilder: FormBuilder,
                private _eventMangaerService: GlobalEventsManager){
      
    }
    ngOnInit(){
      var userRole = localStorage.getItem('userrole');
      console.log("User Role",userRole)
      if (userRole==='user'){
        this.getAllDemands();
        this.getAllMedicines();
        this.getAllConfigs();
        this.getUserDistrict();
        this.getAllTenders();
        this._buildAddDemandForm();
        this._eventMangaerService.showNavBar(true);
      }
    }
    quantity = []; 
    reason = [];
    quantityMedIdsValue = [];
    reasonMedIdsValue = []; 

    changeFilter(event){
      this.filterOption = event;
    }

    changeReason(i,e,m) {
      this.reason[i] = e;
      this.reasonMedIdsValue[i] = {_id: m._id, value: e};
      console.log("Reason array-->",this.reason);
    }
    changeQuantity(i,e,m) {
      this.quantity[i] = e;
      this.quantityMedIdsValue[i] = {_id: m._id, value: e}; 
      if (this.quantity[i]>0) {
        this.selectMedicine(m,true)
      } else {
        this.selectMedicine(m,false)
      }
      console.log("Quantity array-->",this.quantity);
      console.log("Selected-->",this.quantityMedIdsValue);
    }
    initOtherInputs(medilength) {
      for (let i=0;i<medilength;i++){
        this.quantityMedIdsValue[i] = {_id: null, value: null};
        this.reasonMedIdsValue[i] = {_id: null, value: null};
      }
    }
    isSelectedMedi(mediid) {
      for (let id of this.selectedMedicines){
        if (id._id === mediid){
          return true
        }
      }
      return false
    }
    validateMediInputs(){
      let isValid = true, quantityCount = 0
      for (let i=0;i<this.quantityMedIdsValue.length;i++){
        if (this.quantityMedIdsValue[i].value){
          if (this.isSelectedMedi(this.quantityMedIdsValue[i]._id)){
            quantityCount++
          }
        }
      }
      if (quantityCount === this.selectedMedicines.length){
        return isValid
      } else {
        return !isValid
      }
    }
    _buildAddDemandForm(){
      this.addDemandForm = this._formBuilder.group({
        year: [{"value":this.fiscalYear, "disabled":true}, Validators.compose([Validators.required])],
        district: [{"value":this.userDistrict, "disabled": true}, Validators.compose([Validators.required])],
        tender: ["", Validators.compose([Validators.required])]
      });
    }
    selectMedicine(medicine,action) {
      console.log("select medicccc",medicine);
      //selections list Immutable
      if (action){
        if (this.selectedMedicines.indexOf(medicine) === -1) {
          this.selectedMedicines.push(medicine);
        }
      } else {
        let selectedMedicinesTemp = [], counter = 0;
        for (let med of this.selectedMedicines) {
          if (med._id !== medicine._id) {
            selectedMedicinesTemp[counter] = med;
            counter++;
          } 
        }
        this.selectedMedicines = [];
        this.selectedMedicines = selectedMedicinesTemp;
        selectedMedicinesTemp = [];
      }
      //selections bool list
      for (let k=0;k<this.allMedicines.length;k++){
        this.selected[k] = false;
      }
      for (let i=0;i<this.allMedicines.length;i++) {
        for (let j=0;j<this.selectedMedicines.length;j++){
          if (this.allMedicines[i]._id === this.selectedMedicines[j]._id) {
            this.selected[i] = true;
          }
        }
      }
      console.log("Selected Medicines--->",this.selectedMedicines)
    }
    getUserDistrict(){
      this._configsService.getUserDistrict()
          .subscribe(districts => {
            console.log("All Districts To Show: ", districts);
            if (!districts[0].status){
              this.allDistricts = [];
            }
            this.allDistricts = districts[0].districts;
            this.userDistrict = districts[0].districts[0].name
            console.log("All Districts From configurations: ", this.allDistricts);
          });
    }
    getAllConfigs() {
      console.log("get all configs called", this.allConfigs);
      this._configsService.allConfigs()
          .subscribe(configs => {
            if (!configs[0].status) {
              //this._router.navigate(['blank']);
            }
            this.allConfigs = configs[0].configs[0];
            console.log("ALL Configs: ", this.allConfigs);
      });
    }
    filterValidTenders(){
      let currentDate = moment(new Date()).format('YYYY-MM-DD')
      let tendersTemp:any = [], validTenderCount = 0
      for (let i=0;i<this.allTenders.length;i++){
        if (this.allTenders[i].islocked !== '1'){
          if (moment(currentDate).isBetween(this.allTenders[i].demanddatefrom, this.allTenders[i].demanddateto) || moment(currentDate).isSame(this.allTenders[i].demanddatefrom, this.allTenders[i].demanddateto)){
            tendersTemp[validTenderCount] = this.allTenders[i]
            validTenderCount++
          }
        }
      }
      this.allTenders = []
      this.allTenders = tendersTemp
      tendersTemp = []
      console.log("Valid Tenders", this.allTenders)
    }
    getAllTenders() {
      console.log("get all tenders called", this.allTenders);
      this._tenderService.getAllTendersByDepartment()
      .subscribe(tenders => {
        if (!tenders[0].status) {
          this._router.navigate(['blank']);
        }
        this.allTenders = tenders[0].tenders;
        console.log("ALL Tenders: ", this.allTenders);
        this.filterValidTenders();
      });
    }
    getAllMedicines(){
      console.log("get all medicines called", this.allMedicines);
      this._medicineService.getAllMedicinesByDepartment()
      .subscribe(medicines => {
        if (!medicines[0].status) {
          this._router.navigate(['blank']);
        }
        this.allMedicines = [];
        let medcount = 0;
        for (let i=0;i<medicines[0].medicines.length;i++){
          let medfound = false
          for (let j=0;j<this.allDemands.length&&!medfound;j++){
            if (this.allDemands[j].user===localStorage.getItem('userid')){
              console.log("Logging",
                _.find(this.allDemands[j].medicine,(['_id',medicines[0].medicines[i]._id])))
              if (_.find(this.allDemands[j].medicine,
                (['_id',medicines[0].medicines[i]._id]))){
                medfound = true
                //break;
              }
            }
          }
          if (!medfound){
            this.allMedicines[medcount] = medicines[0].medicines[i]
            console.log("Here not found",this.allMedicines[medcount])
            medcount++;
          }
        }

        this.initOtherInputs(this.allMedicines.length)
        console.log("ALL Medicines: ", this.allMedicines);
      });
    }
    getAllDemands(){
      console.log("get all demands called", this.allDemands);
      this.busyDemand = this._service.getUserDemands()
          .subscribe(demands => {
            if (!demands[0].status){
              //redirect user to home path
              this._router.navigate(['blank']);
            }
            this.allDemands = demands[0].demands;
            console.log("ALL Demands: ", this.allDemands);
      });
    }
    addSelectedMedicines() {
      for (let itr=0;itr<this.selectedMedicines.length;itr++) {
        for (let itrTwo=0;itrTwo<this.quantityMedIdsValue.length;itrTwo++) {
          if (this.quantityMedIdsValue[itrTwo]) {
            if (this.selectedMedicines[itr]._id === this.quantityMedIdsValue[itrTwo]._id) {
              this.selectedMedicines[itr].quantity = this.quantityMedIdsValue[itrTwo].value;
            } 
          }
        }
        for (let itrThree=0;itrThree<this.reasonMedIdsValue.length;itrThree++) {
          if (this.reasonMedIdsValue[itrThree]) {
            if (this.selectedMedicines[itr]._id === this.reasonMedIdsValue[itrThree]._id) {
              this.selectedMedicines[itr].reason = this.reasonMedIdsValue[itrThree].value;
            } 
          }
        }
      }
    }
    getTenderName(tenderId){
      for(let tender of this.allTenders) {
        if (tenderId === tender._id) {
          return tender.name
        }
      }
    }
    addDemand(demand, $event){
      demand.tendername = this.getTenderName(demand.tender);
      this.addSelectedMedicines();
      console.log("S M--->>>>",this.selectedMedicines);
      demand.medicine = this.selectedMedicines;
      console.log("Event-->", $event);
      console.log("Demand form values: ", demand);
      demand.year = this.fiscalYear;
      this._service.addDemand(demand)
        .subscribe(result => {
          console.log("RESULT ROM ADD Demand: ", result);
          if (!result[0].status) {
            this._router.navigate(['blank']);
          }
          this.hideDemandForm();
          this._buildAddDemandForm();
          this.getAllDemands();
          this.getAllMedicines();
          this.quantity = []
          this.reason = []
          this.selected = []
          this.selectedMedicines = []
      });
    }
    getSingleDemand(demandId){
      console.log("DemandId-->",demandId);
      this._service.getSingleDemand(demandId)
        .subscribe(result => {
          console.log("RESULT ROM GET SINGLE Demand: ", result);
          if (!result[0].status) {
            this._router.navigate(['blank']);
          }
          this.singleDemand = result[0].demand;
          this.hideDemandForm();
          this.singleDemandFlag = true; 
      });
    }
    hideSingleDemand(){
      this.singleDemandFlag = false;
    }
    showDemandForm(){
        this.demandFormFlag = true;
    }
    hideDemandForm(){
        // this._buildAddUserForm();
        this.demandFormFlag = false;
    }
    // ********** Routing Fucntions **********//
    logout(){
        this._loginService.logout();
    }


}