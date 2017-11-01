import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
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
    selector: 'userdashboard',
    moduleId: module.id,
    providers: [DemandService, 
                MedicineService, 
                TenderService, 
                FinancialBiddingService,
                PurchaseOrderService],
    templateUrl: 'userdashboard.html',
    styleUrls: ['userdashboard.css']
})

export class userdashboard {
  
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


  constructor(private _router: Router,
              private http: Http, 
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
    this.busyTenders =  this._demandService.allUserDashboardDemands()
            .subscribe(demands => {
              if (demands[0].demands[0].tenders.length){
                this.allTenders = demands[0].demands[0].tenders
                console.log("USER DEMANDED TENDERS", this.allTenders)
              }
              this.allTenders = this.allTenders.slice(0, 5)
                var data = {
                  labels: [],
                  series: []
                };

                var options = {};

                var responsiveOptions = [
                  ['screen and (max-width: 640px)', {
                    seriesBarDistance: 5,
                    axisX: {
                      labelInterpolationFnc: function (value) {
                        return value[0];
                      }
                    }
                  }]
                ];

                Chartist.Bar('#chartActivity', data, options, responsiveOptions);                

                var data2 = {
                  labels: [],
                  series: []
                };

                var options2 = {};

                // var responsiveOptions2 = [
                //   ['screen and (max-width: 640px)', {
                //     seriesBarDistance: 5,
                //     axisX: {
                //       labelInterpolationFnc: function (value) {
                //         return value[0];
                //       }
                //     }
                //   }]
                // ];

                Chartist.Bar('#poChartActivity', data2, options2, responsiveOptions);
        });

  }

  showCompleteDemands(tenderId){
    this._router.navigate(['usersingledemand', tenderId])
  }

  addActive(i, tender){
    this.selectedIndex = i;
    this.selectedPo = null;
    this.selectedPoIndex = null;
    Chartist.Bar('#poChartActivity', {}, {}, {});
    if (tender != null){
      this.selectedTender = tender;
      console.log("SELECTED TENDER:---", this.selectedTender);
      this.busyChart = this._demandService.getUserTenderDemands(this.selectedTender._id)
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
                  medicines.push(medi.name)
                  mediquantity.push(medi.quantity)
                  this.tenderNorthDemands.push(medi)
                  this.tenderNorthQuantity.push(medi.quantity)
                  northQuantity = northQuantity + Number(medi.quantity)
                }
                  northCount = northCount + 1
              }else if (demand.districtzone === "South"){
                for (let medi of demand.medicine){
                  medicines.push(medi.name)
                  mediquantity.push(medi.quantity)
                  this.tenderSouthDemands.push(medi)
                  this.tenderSouthQuantity.push(medi.quantity)
                  southQuantity = southQuantity + Number(medi.quantity)
                }
                  southCount = southCount + 1
              }else {
                for (let medi of demand.medicine){
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

          var data = {
            labels: medicines,
            series: [
              {meta: "grp", data: mediquantity}
            ]
          };

          var options = {
            seriesBarDistance: 20,
            axisX: {
                showGrid: true,
                rotatelabels: 90
            },
            height: "100%"
          };


          var responsiveOptions = [
            ['screen and (max-width: 640px)', {
              seriesBarDistance: 5,
              axisX: {
                labelInterpolationFnc: function (value) {
                  return value[0];
                }
              }
            }]
          ];

          Chartist.Bar('#chartActivity', data, options, responsiveOptions);
          this.getPos(tender._id);
      
      });
    }
  }
  getPos(tenderId){
    console.log("TENDER TO GET PURCHASE ORDERS:===", tenderId)
    this._purchaseOrderService.getTenderPos(tenderId)
      .subscribe(pos => {
        console.log("LIST OF TENDER POS:----", pos)
        if (pos[0].pos){
          this.allTenderPos = pos[0].pos
        }
        console.log("LIST OF ALL TENDER POS:----", this.allTenderPos)
    });

  }
  addPoActive(i, po){
    this.selectedPoIndex = i;
    console.log("selected PO", po)
    this.selectedPo = po;
    var poMeds = []
    var poMedQty = []

    for (let med of this.selectedPo.medicine){
      poMeds.push(med.name)
      poMedQty.push(med.demandedquantity)
    }

    var data2 = {
      labels: poMeds,
      series: [poMedQty]
    };

    var options2 = {
      seriesBarDistance: 20,
      axisX: {
          showGrid: true,
          rotatelabels: 90
      },
      height: "100%"
    };

    var responsiveOptions2 = [
      ['screen and (max-width: 640px)', {
        seriesBarDistance: 5,
        axisX: {
          labelInterpolationFnc: function (value) {
            return value[0];
          }
        }
      }]
    ];

    Chartist.Bar('#poChartActivity', data2, options2, responsiveOptions2);    
  }
}