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
import { VendorTechQualiService } from '../../services/vendortechqualification.service'
import { AttachmentService } from '../../services/attachment.service'
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { Tender } from '../../models/tender';
import * as moment from "moment";
import { GlobalEventsManager } from "../../services/eventsmanager.service";

@Component({
    selector: 'financialbidding',
    providers: [TenderService,  
                DemandService, 
                VendorService, 
                FinancialBiddingService, 
                ConfigsService,
                VendorTechQualiService ],
    templateUrl: 'financialbidding.html',
    styleUrls: ['financialbidding.css']
})

export class financialbidding {

    dropdownSettings: any = {};
    allBids: any = [];
    allTenders: any = [];
    allVendorsArr: any = [];
    selectedTenderTechId: any = ""
    allDemands: any = [];
    disableTenderBtn: boolean = false;
    qualifiedVendors: any = [];
    allMedicines: any = [];
    uniqueMedicines: any = [];
    selectedTenderId: any = '';
    selectedTenderName: string = ''
    selectedVendorId: any = '';
    selectedVendorName: string = '';
    selectedVendorIndex: number;
    medicineView: boolean = false;
    isEmergency: boolean = false;
    dt: Date = new Date();
    selectTenderForm: FormGroup;

    constructor(private _router: Router, 
                private _service: FinancialBiddingService,
                private _tenderService: TenderService,
                private _vendorService: VendorService,
                private _vendorTechQualiService: VendorTechQualiService,
                private _demandService: DemandService,
                private _loginService: LoginService,
                private _location: Location,
                private _formBuilder: FormBuilder,
                private _eventMangaerService: GlobalEventsManager){
    }
    ngOnInit(){
      this._eventMangaerService.showNavBar(true);
      this.getAllTenders();
      //this.getVendorsTech();
      this._buildSelectTenderForm();
      this.getAllBids();
      this.allVendors();
    }
    public getDate(): number {
      return this.dt && this.dt.getTime() || new Date().getTime();
    }
    _buildSelectTenderForm(){
        this.selectTenderForm = this._formBuilder.group({
          tender: ["", Validators.compose([Validators.required])]
        });
    }
    northBidChange(medIndex,e,medId){
      this.uniqueMedicines[medIndex].northbid = e
      console.log("Med array update->",this.uniqueMedicines)
    }
    southBidChange(medIndex,e,medId){
      this.uniqueMedicines[medIndex].southbid = e
      console.log("Med array update->",this.uniqueMedicines)
    }
    centralBidChange(medIndex,e,medId){
      this.uniqueMedicines[medIndex].centralbid = e
      console.log("Med array update->",this.uniqueMedicines)
    }
    vendorSelect(vendorId,vendorName,arrayIndex){
      this.medicineView = true;
      this.disableTenderBtn = true;
      this.selectedVendorId = vendorId;
      this.selectedVendorName = vendorName;
      this.selectedVendorIndex = arrayIndex;
    }
    closeMedView(){
      this.medicineView = false;
      this.disableTenderBtn = false;
      this.initBids();
    }
    initBids(){
      for (let i=0;i<this.uniqueMedicines.length;i++){
        this.uniqueMedicines[i].northbid = 0
        this.uniqueMedicines[i].southbid = 0
        this.uniqueMedicines[i].centralbid = 0
      }
    }
    setMedicinesList(){
      this.allMedicines = [];
      for (let demand of this.allDemands){
        for (let i=0;i<demand.medicine.length;i++){
          this.allMedicines.push(demand.medicine[i])
        }
      }
      this.uniqueMedicines = _.uniqBy(this.allMedicines,'_id');
      this.initBids();
      this.setMediZone();
      console.log("All Medicines-->",this.allMedicines)
      console.log("Unique Medicines-->",this.uniqueMedicines)
    }
    vendorEditShow(vendorId){
      for (let i=0;i<this.allBids.length;i++){
        if (this.allBids[i].tender===this.selectedTenderId
         && this.allBids[i].vendor===vendorId){
          return false
        }
      }
      return true
    }
    setMediZone(){
      for (let i=0;i<this.uniqueMedicines.length;i++){
        for (let j=0;j<this.allDemands.length;j++){
          if (this.allDemands[j].demandstatus==='1'
           && this.allDemands[j].tenderref===this.selectedTenderId){
            let medi = _.find(this.allDemands[j].medicine,(['_id',this.uniqueMedicines[i]._id]))
            console.log("Found Medi",medi)
            if (this.allDemands[j].districtzone==='North' && medi){
              this.uniqueMedicines[i].northzone = true 
            }
            if (this.allDemands[j].districtzone==='South' && medi){
              this.uniqueMedicines[i].southzone = true 
            }
            if (this.allDemands[j].districtzone==='Central' && medi){
              this.uniqueMedicines[i].centralzone = true 
            }
          }
        }
      }
    }
    addFinancialBid(){
      let newBid = { 
        vendorname: this.selectedVendorName,
        tendername: this.selectedTenderName,
        vendor: this.selectedVendorId,
        tender: this.selectedTenderId,
        medicine: this.uniqueMedicines 
      }
      this._service.addFinancialBid(newBid)
        .subscribe(bid => {
          console.log("Vendor Bid Added",bid)
          this.closeMedView();
          this.getAllBids();
        })
    }
    getAllBids(){
      this._service.getAllBids()
        .subscribe(bids => {
          this.allBids = bids[0].bids
          console.log("All Bids",this.allBids)
        })
    }
    getAllDemands(){
      this._demandService.getAllDemandsByTenderWithStatus(this.selectedTenderId)
        .subscribe(demands => {
          this.allDemands = demands[0].demands
          this.setMedicinesList();
          console.log("All Demands",this.allDemands)
        })
    }
    getAllTenders(){
      console.log("get all tenders called", this.allTenders);
      this._tenderService.getAllTenders()
        .subscribe(tenders => {
          if(!tenders[0].status){
            this._router.navigate(['blank']);
          }
          let tc = 0
          for (let i=0;i<tenders[0].tenders.length;i++){
            if (tenders[0].tenders[i].islocked==='1' &&
             (tenders[0].tenders[i].prequalification==='prequalify'
              || tenders[0].tenders[i].prequalification==='emergency')){
              this.allTenders[tc] = tenders[0].tenders[i]
              tc++
            }
          }
          console.log("ALL TENDERS: ", this.allTenders);
      });
    }
    getVendorName(vendorId) {
      return _.find(this.allVendorsArr,(['_id',vendorId])).name
    }
    getVendorsTech(){
      this._vendorTechQualiService.getAllVendorTechQualifications()
      .subscribe(result => {
        console.log("Result Qualified Vendors",result)
        if (!result[0].status) {
          this._router.navigate(['blank']);
        }
        let qvCount = 0;
       
        for (let i=0;i<result[0].profiles.length;i++){   
          if (result[0].profiles[i].vendorstatus === 'qualify'
           && this.selectedTenderTechId===result[0].profiles[i].qualiprofileId){

            this.qualifiedVendors[qvCount] = result[0].profiles[i]
            this.qualifiedVendors[qvCount].vendorname = this.getVendorName(result[0].profiles[i].vendorId)
            this.qualifiedVendors[qvCount].medicines = []
            qvCount++;
          }
        }
        console.log("Qualified Vendors", this.qualifiedVendors)
      });
    }
    // getAllQualifiedVendors(){
    //   this._vendorService.getQualifiedVendors()
    //   .subscribe(vendors => {
    //     console.log("RESULT Get qualified vendors: ", vendors[0].vendors);
    //     if (!vendors[0].status) {
    //       this._router.navigate(['blank']);
    //     }
    //     let qvCount = 0;
    //     for (let i=0;i<vendors[0].vendors.length;i++){
    //       if (vendors[0].vendors[i].is_qualified===true){
    //         this.qualifiedVendors[qvCount] = vendors[0].vendors[i]
    //         this.qualifiedVendors[qvCount].medicines = []
    //         qvCount++;
    //       }
    //     }
    //     console.log("Qualified Vendors", this.qualifiedVendors)
    //     });
    // }
    allVendors(){
      console.log("get all vendors called",);
      this._vendorService.getAllVendors()
      .subscribe(vendors => {
        if (!vendors[0].status){
          this._router.navigate(['blank']);
        }
        let qvCount = 0;
        for (let i=0;i<vendors[0].vendors.length;i++){
          this.allVendorsArr[qvCount] = vendors[0].vendors[i]
          this.allVendorsArr[qvCount].medicines = []
          qvCount++;
        }
        console.log("All Vendors Arr",this.allVendorsArr)
      });
    }
    getAllVendors(){
      this.qualifiedVendors = this.allVendorsArr
    }
    checkTenderType(){
      let tender = _.find(this.allTenders,['_id',this.selectedTenderId])
      if (tender.prequalification==='emergency'){
        this.getAllVendors();
        this.isEmergency = true
        console.log("Emergency tender")
      } else {
        //this.getAllQualifiedVendors();
        this.isEmergency = false;
        this.getVendorsTech();
      }
      console.log("Check tender", tender)
    }
    selectTender(tender){
      console.log("Tender",tender)
      this.selectedTenderId = tender.tender._id;
      this.selectedTenderName = tender.tender.name;
      if (tender.tender.techqualiprofile[0]){
        this.selectedTenderTechId = tender.tender.techqualiprofile[0]._id;
      }
      this.getAllDemands();
      this.qualifiedVendors = []
      this.checkTenderType();
      //this.getAllQualifiedVendors();
      //this.getVendorsTech();
      console.log("Selected Tender: ", this.selectedTenderId);
    }
    // ********** Routing Functions **********//
    logout(){
      this._loginService.logout();
    }
    goToRoute(name){
      this._router.navigate([name]);
    }

}