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
import { FinancialBiddingService } from '../../../services/financialbidding.service';
// declare var $: any;
// import * as tooltip from 'chartist-plugin-tooltip';
import {Subscription} from 'rxjs';

@Component({
    selector: 'pco-home',
    moduleId: module.id,
    providers: [DemandService, MedicineService, TenderService, FinancialBiddingService],
    templateUrl: 'pcohome.html',
    styleUrls: ['pcohome.css']
})

export class pcohome {
  
  selectedIndex: any = null;
  selectedTender: any = null;

  allTenders: any = [];  
  tenderId: any = null;  
  tenderMedi: any = [];
  tenderNorthDemands: any = [];
  tenderSouthDemands: any = [];
  tenderCentralDemands: any = [];
  tenderNorthQuantity: any = [];
  tenderSouthQuantity: any = [];
  tenderCentralQuantity: any = [];
  allTenderBids: any = [];  

  busyA: Subscription;
  busyB: Subscription;

  constructor(private _router: Router,
              private http: Http, 
              private _formBuilder: FormBuilder,
              private _demandService: DemandService,
              private _medicineService: MedicineService,
              private _tenderService: TenderService,
              private _financialBiddingService: FinancialBiddingService,
              private _eventMangaerService: GlobalEventsManager){
    this._eventMangaerService.showNavBar(true);
  }
  ngOnInit(){


    
    this.busyA = this._demandService.allDashboardDemands()
      .subscribe(demands => {
        console.log("ALL DEMANDS FROM COLLECTION:++++++++++++++++++:---", demands);
        if (demands[0].demands[0].tenders.length){
          this.allTenders = demands[0].demands[0].tenders
        }
        this.allTenders = this.allTenders.slice(0, 5);
        console.log("ALL TENDERS TO SHOW:---", this.allTenders);
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

        Chartist.Bar('#zoneDemands', data2, options2, responsiveOptions2);


        Chartist.Pie('#chartPie', {
          labels: [],
          series: []
        });

        // this.busy = this._demandService.allDashboardDemands().subscribe()
    });
  }

  showCompleteDemands(tenderId){
    this._router.navigate(['pcosingledemand', tenderId])
  }

  addActive(i, tender){
    this.selectedIndex = i;
    if (tender != null){
      this.selectedTender = tender;
      this.tenderId = this.selectedTender._id
      console.log("SELECTED TENDER:---", this.selectedTender);
      this.busyB = this._demandService.getTenderDemands(this.selectedTender._id)
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

          // var results = [];
          // console.log("RESULTS AFTER LOOP++++++", results);
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

          medicines = medicines.slice(0, 7);
          mediquantity = mediquantity.slice(0, 7);

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
              // ,
              // reverseData: true,
              // horizontalBars: true
              
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

          var zoneCounts: any = [northCount, southCount, centralCount];
          var zones: any = ["North", "South", "Central"];

          var data2 = {
            labels: zones,
            series: [zoneCounts]
          };

          var options2 = {
              seriesBarDistance: 10,
            axisX: {
                showGrid: false
            },
            height: "290px"      
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

          Chartist.Line('#zoneDemands', data2, options2, responsiveOptions2);

          var zonesPercentage: any = [];          
          var pieChartLabels: any = [];

          for (let count of zoneCounts){
            var percent: any = count;
            var calPercent: any = ((percent/pieCount)*100).toFixed(1);;
            var key: any = calPercent+"%";
            if (calPercent != 0){
              pieChartLabels.push(key);
              zonesPercentage.push(calPercent);
            }
          }          
          console.log("PIE CHART LABELS++++++", pieChartLabels);
          console.log("PERCENTAGES TO SHOW++++++", zonesPercentage);

          Chartist.Pie('#chartPie', {
            labels: pieChartLabels,
            series: zonesPercentage
          });
          this._financialBiddingService.singleTenderMeds(this.selectedTender._id)
            .subscribe(bids => {
              if (bids[0].bids){
                console.log("ALLL BIDS ON THIS TENDER:------", bids[0].bids.medicine);
                this.allTenderBids = bids[0].bids.medicine
              }else{
                this.allTenderBids = [];
              }
          });
      });
    }
  }
}