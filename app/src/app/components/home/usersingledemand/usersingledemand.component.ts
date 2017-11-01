import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import * as moment from "moment";
import * as _  from "lodash";
import {Http, Headers, RequestOptions} from '@angular/http';
import { GlobalEventsManager } from "../../../services/eventsmanager.service";
import * as Chartist from 'chartist';
import { DemandService } from '../../../services/demand.service';
import { MedicineService } from '../../../services/medicine.service';
import { ConfigsService } from '../../../services/configs.service';
import { TenderService } from '../../../services/tender.service';
import { PurchaseOrderService } from '../../../services/purchaseorder.service';
import { FinancialBiddingService } from '../../../services/financialbidding.service';
// declare var $: any;
import tooltip from 'chartist-plugin-tooltip';
import { Subscription } from 'rxjs';

@Component({
    selector: 'usersingledemand',
    moduleId: module.id,
    providers: [DemandService, 
                MedicineService, 
                TenderService, 
                FinancialBiddingService,
                PurchaseOrderService],
    templateUrl: 'usersingledemand.html',
    styleUrls: ['usersingledemand.css']
})

export class userSingleDemand {
  
  selectedIndex: any = null;
  selectedPoIndex: any = null;
  selectedTender: any = null;
  selectedPo: any = null;

  allTenders: any = [];  
  tenderMedi: any = [];
  tenderNorthDemands: any = [];
  tenderSouthDemands: any = [];
  tenderCentralDemands: any = [];
  tenderNorthQuantity: any = [];
  tenderSouthQuantity: any = [];
  tenderCentralQuantity: any = [];
  allTenderBids: any = [];
  allTenderPos: any = [];

  busyTenders: Subscription;  
  busyChart: Subscription;  
  busyPo: Subscription;  

  filterQuery: any = null;
  filterOption: any = null;


  constructor(private _router: Router,
              private http: Http, 
              private _activatedRoute: ActivatedRoute, 
              private _formBuilder: FormBuilder,
              private _demandService: DemandService,
              private _medicineService: MedicineService,
              private _tenderService: TenderService,
              private _purchaseOrderService: PurchaseOrderService,
              private _financialBiddingService: FinancialBiddingService,
              private _eventMangaerService: GlobalEventsManager){
    this._eventMangaerService.showNavBar(true);
  }
  ngOnInit(){
    this._activatedRoute.params.subscribe(params => {
      this.selectedTender = params['tenderId']; // (+) converts string 'id' to a number
      console.log("CATEGORY ID TO ADD SUB CATEGORY:-----", this.selectedTender)
      // self._productService.getSingleCategory(this.categoryId).then(function (doc) {
      //   // handle doc
      // }).catch(function (err) {
      //   console.log(err);
      // })
    });
    this.busyTenders =  this._demandService.getUserTenderDemands(this.selectedTender)
        .subscribe(demands => {
          console.log("THIS TENDER DEMANDS++++++", demands);
          var medicines: any = [];
          var mediquantity: any = [];
          
          this.tenderNorthDemands = [];
          this.tenderSouthDemands = [];
          this.tenderCentralDemands = [];
          
          this.tenderNorthQuantity = [];
          this.tenderSouthQuantity = [];
          this.tenderCentralQuantity = [];

          this.tenderMedi = []

          var northQuantity: any = 0;
          var southQuantity: any = 0;
          var centralQuantity: any = 0;
          var northCount: any = 0;
          var southCount: any = 0;
          var centralCount: any = 0;
          var countIndex = 0;

          for (let demand of demands[0].demands){
              if (demand.districtzone === "North"){
                for (let medi of demand.medicine){
                  this.tenderMedi.push(medi)
                  medicines.push(medi.name)
                  mediquantity.push(medi.quantity)
                  this.tenderNorthDemands.push(medi)
                  this.tenderNorthQuantity.push(medi.quantity)
                  northQuantity = northQuantity + Number(medi.quantity)
                }
                  northCount = northCount + 1
              }else if (demand.districtzone === "South"){
                for (let medi of demand.medicine){
                  this.tenderMedi.push(medi)
                  medicines.push(medi.name)
                  mediquantity.push(medi.quantity)
                  this.tenderSouthDemands.push(medi)
                  this.tenderSouthQuantity.push(medi.quantity)
                  southQuantity = southQuantity + Number(medi.quantity)
                }
                  southCount = southCount + 1
              }else {
                for (let medi of demand.medicine){
                  this.tenderMedi.push(medi)
                  medicines.push(medi.name)
                  mediquantity.push(medi.quantity)
                  this.tenderCentralDemands.push(medi)
                  this.tenderCentralQuantity.push(medi.quantity)
                  centralQuantity = centralQuantity + Number(medi.quantity)
                }
                  centralCount = centralCount + 1
              }
          }

          console.log("NORTH DEMANDS++++++", this.tenderNorthDemands);
          console.log("NORTH DEMANDS QUANTITY++++++", this.tenderNorthQuantity);
          console.log("NORTH TOTAL QUANTITY++++++", northQuantity);
          console.log("NORTH TOTAL DEMAND COUNT++++++", northCount);

          console.log("SOUTH DEMANDS++++++", this.tenderSouthDemands);
          console.log("SOUTH DEMANDS QUANTITY++++++", this.tenderSouthQuantity);
          console.log("SOUTH TOTAL QUANTITY++++++", southQuantity);
          console.log("SOUTH TOTAL DEAMNDS COUNT++++++", southCount);

          console.log("CENTRAL DEMANDS++++++", this.tenderCentralDemands);
          console.log("CENTRAL DEMANDS QUANTITY++++++", this.tenderCentralQuantity);
          console.log("CENTRAL TOTAL QUANTITY++++++", centralQuantity);
          console.log("CENTRAL TOTAL DEMANDS COUNT++++++", centralCount);

          console.log("LIst OF ALL TENDER MEDICINE++++++", medicines);
          console.log("LIst OF ALL TENDER MEDICINES QUANTITY++++++", mediquantity);          

          var pieCount = northCount + southCount + centralCount;
          console.log("TOTAL PIE COUNT++++++", pieCount);

          medicines = medicines.slice(0, 10);
          mediquantity = mediquantity.slice(0, 10);
          console.log("LIst OF ALL TENDER MEDICINE++++++", medicines);
          console.log("LIst OF ALL TENDER MEDICINES QUANTITY++++++", mediquantity);

          // this.getPos(tender._id);
      
      });

  }
  changeFilter($event){
    this.filterOption = $event
  }

}