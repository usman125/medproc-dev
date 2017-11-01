import { Component, ElementRef } from '@angular/core';
import * as _ from "lodash";
import { Location } from '@angular/common';
import { LoginService } from '../../services/login.services'
import { FinancialBiddingService } from '../../services/financialbidding.service'
import { TenderService } from '../../services/tender.service'
import { VendorService } from '../../services/vendor.service'
import { DemandService } from '../../services/demand.service'
import { ConfigsService } from '../../services/configs.service'
import { PreQualiServices } from '../../services/prequalification.service'
import { TechicalQualificationService } from '../../services/technicalqualification.service'
import { AttachmentService } from '../../services/attachment.service'
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { Tender } from '../../models/tender';
import * as moment from "moment";
import { GlobalEventsManager } from "../../services/eventsmanager.service";

@Component({
    selector: 'passedbids',
    providers: [TenderService,  
                DemandService, 
                VendorService,
                FinancialBiddingService, 
                ConfigsService],
    templateUrl: 'passedbids.html',
    styleUrls: ['financialbidding.css']
})

export class passedbids {

    allTenders: any = [];
    allVendors: any = [];
    allTenderMeds: any = [];
    dt: Date = new Date();

    constructor(private _router: Router, 
                private _service: FinancialBiddingService,
                private _tenderService: TenderService,
                private _demandService: DemandService,
                private _vendorService: VendorService,
                private _loginService: LoginService,
                private _location: Location,
                private _formBuilder: FormBuilder,
                private _eventMangaerService: GlobalEventsManager){
    }
    ngOnInit(){
      this._eventMangaerService.showNavBar(true);
      this.getAllTenders();
      this.getAllVendors();
      this.getAllTenderMeds();
    }
    public getDate(): number {
      return this.dt && this.dt.getTime() || new Date().getTime();
    }
    getAllTenderMeds(){
      console.log("get all tenders called", this.allTenders);
      this._service.getAllTenderMeds()
        .subscribe(bids => {
          if(!bids[0].status){
            this._router.navigate(['blank']);
          }
          this.allTenderMeds = bids[0].bids;
          for (let i=0;i<this.allTenderMeds.length;i++){
            for (let j=0;j<this.allTenderMeds[i].medicine;j++){
              this.allTenderMeds[i].medicine[j].northVendor
            }
          }
          console.log("ALL TENDER MEDS: ", this.allTenderMeds);
      });
    }
    getTenderName(tenderId){
      return _.find(this.allTenders,(['_id',tenderId])).name
    }
    getAllTenders(){
      console.log("get all tenders called", this.allTenders);
      this._tenderService.getAllTenders()
        .subscribe(tenders => {
          if(!tenders[0].status){
            this._router.navigate(['blank']);
          }
          this.allTenders = tenders[0].tenders;
          console.log("ALL TENDERS: ", this.allTenders);
      });
    }
    getVendorName(vendorId){
      console.log("Vendor name",_.find(this.allVendors,(['_id',vendorId])).name)
      return _.find(this.allVendors,(['_id',vendorId])).name
    }
    getAllVendors(){
      console.log("get all vendors called", this.allTenders);
      this._vendorService.getAllVendors()
        .subscribe(vendors => {
          if(!vendors[0].status){
            this._router.navigate(['blank']);
          }
          this.allVendors = vendors[0].vendors;
          console.log("ALL Vendors: ", this.allVendors);
      });
    }
    // ********** Routing Functions **********//
    logout(){
      this._loginService.logout();
    }
    goToRoute(name){
      this._router.navigate([name]);
    }

}