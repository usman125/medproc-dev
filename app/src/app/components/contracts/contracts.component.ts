import {Component, ElementRef, ViewChild} from '@angular/core';
import {Location} from '@angular/common';
import {LoginService} from '../../services/login.services'
import {TenderService} from '../../services/tender.service'
import {VendorService} from '../../services/vendor.service'
import {ConfigsService} from '../../services/configs.service'
import {ContractTemplateService} from '../../services/contracttemplate.service'
import {VendorContractService} from '../../services/vendorcontract.service'
import { FinancialBiddingService } from '../../services/financialbidding.service'
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { Tender } from '../../models/tender';
import * as moment from "moment";
import { ModalDirective } from 'ngx-bootstrap/modal/modal.component';
import { GlobalEventsManager } from "../../services/eventsmanager.service";
import { Subscription } from 'rxjs';

@Component({
    selector: 'contracts',
    providers: [TenderService, 
                ConfigsService, 
                VendorService, 
                VendorContractService, 
                ContractTemplateService,
                FinancialBiddingService],
    templateUrl: 'contracts.html',
    styleUrls: ['contracts.css']
})

export class contracts {
    
    allVendors: any = [];
    allVendorMeds: any = [];
    allEmergencyTenders: any = [];
    selectedVendor: any;
    showVendorFlag: boolean = false;
    
    allTenders: any = [];
    allTenderMeds: any = [];
    selectedTender: any;
    tenderTotalFinancials: any = 0;

    allContractTemplates = [];
    showContractFlag: boolean = false;
    viewContractFlag: boolean = false;
    selectedTemplate: any;
    contractTemplate: any = "";
    contractInfo: any = null;

    allContracts: any = []
    contractCount: any = 0;
    existFlag: boolean = false;
    tenderCloseFlag: boolean = false;
    viewContract: any;

    constructor(private _router: Router, 
                private _loginService: LoginService,
                private _location: Location,
                private _formBuilder: FormBuilder,
                private _service: ConfigsService,
                private _tenderService: TenderService,
                private _contractTemplateService: ContractTemplateService,
                private _vendorService: VendorService,
                private _vendorContractService: VendorContractService,                
                private _financialBiddingService: FinancialBiddingService,                
                private _eventMangaerService: GlobalEventsManager){
      
      this._eventMangaerService.showNavBar(true);
    }

    busyTenders: Subscription;
    busyContractTemplate: Subscription;
    busyVendorContract: Subscription;

    ngOnInit(){
      this.busyTenders = this._tenderService.getAllTenders()
        .subscribe(tenders => {
            if (!tenders[0].status){
                this._router.navigate(['blank']);
            }
            this.allTenders = [];
            for (let tender of tenders[0].tenders){
              if ((tender.prequalification === 'emergency' || 
                              tender.prequalification === 'prequalify') && (tender.islocked === "1")){
                if (tender.isclosed === "1"){
                  tender.closestatus = 'closed';
                }else{
                  tender.closestatus = 'pending';
                }
                this.allTenders.push(tender);
              }
            }
            this.busyContractTemplate = this._contractTemplateService.getAllContrcatTemplates()
                .subscribe(result => {
                  if (!result[0].status){
                    this.allContractTemplates = [];
                  }
                  this.allContractTemplates = result[0].results
                  console.log("ALL Contact templates: ", this.allContractTemplates);
                  console.log("ALL EMERGENCY TENDERS: ________ ", this.allTenders);
                  this.getAllVendorContracts(); 
            });
      });      
    }
    getAllVendorContracts(){
      this.busyVendorContract = this._vendorContractService.getAllVendorContracts()
        .subscribe(contracts => {
          console.log("ALL vendor Contacts from query: ", contracts);
          if (!contracts[0].status){
            this.allContracts = [];
          }
          this.allContracts = contracts[0].contracts;
          console.log("ALL vendor Contacts: ", this.allContracts);
      });
    }
    selectVendor(tenderId){
      console.log("Tender To Contract: ", tenderId);
      for (let tender of this.allTenders){
        if (tenderId === tender._id){
          this.selectedTender = tender;
        }
      }
      this.contractCount = 0;
      this._vendorService.getFinancialVandors(tenderId)
          .subscribe(vendors => {
            console.log("ALLL FINANCIAL VENDORS:---", vendors);
            this.allVendors = [];
            for (let vendor of vendors[0].vendors){
              this.allVendors.push(vendor.vendor[0]);
            }
            console.log("ALLL FINANCIAL VENDORS TO DISPALY:---", vendors);
            for (let i=0; i<this.allVendors.length; i++){
              this.allVendors[i].status = "pending";
            }
            for (let i=0; i<this.allVendors.length; i++){
              for(let j=0; j<this.allContracts.length; j++){
                if (this.allVendors[i]._id === this.allContracts[j].vendorId
                    && tenderId === this.allContracts[j].tenderId){
                  console.log("Matched Entry:---", this.allVendors[i].name);
                  this.allVendors[i].status = "preview";
                  this.contractCount = this.contractCount + 1;
                  console.log("Matched Entry:---", this.allVendors[i].status);
                  break
                }
              }
            }
            console.log("All Vendors After loop: ", this.allVendors);
            console.log("CONTRACTS COUNT AFTER ADDING___________++: ", this.contractCount);
            console.log("Selected Tender: ", this.selectedTender);
            this._financialBiddingService.tenderFinancialBids(this.selectedTender._id)
                .subscribe(totalfinancials => {
                  console.log("TENDER VENDOR COUNT FROM ALL FINANCIALS___________++: ", totalfinancials);
                  if (totalfinancials[0].totalfinancials){
                    this.tenderTotalFinancials = totalfinancials[0].totalfinancials.totalfinancials;
                    console.log("TENDER VENDOR COUNT___________++: ", this.tenderTotalFinancials);
                  }
                  if (this.tenderTotalFinancials  !== 0 || this.contractCount !== 0){
                    if (this.tenderTotalFinancials === this.contractCount){
                      this.tenderCloseFlag = true;
                    }
                  }
                  this.showVendorFlag = true;
            });
      });
    }

    hideVendor(){
      this.showVendorFlag = false;
      this.tenderCloseFlag = false;
      // this.selectedTender = null;
        // this._financialBiddingService.tenderFinancialBids(this.selectedTender._id)
        //     .subscribe(totalfinancials => {
        //       console.log("This TENDER VENDOR COUNT FROM ALL FINANCIALS___________++: ", totalfinancials[0].totalfinancials);
        //       this._vendorContractService.getTenderContracts(this.selectedTender._id)
        //         .subscribe(totalcontracts => {
        //           console.log("This TENDER TOTAL CONTRACTS COUNT___________++: ", totalcontracts[0].totalcontracts);
        //           if (totalcontracts[0].totalcontracts != 0 || totalfinancials[0].totalfinancials !=0){
        //             if (totalfinancials[0].totalfinancials === totalcontracts[0].totalcontracts){
        //               this.selectedTender.closestatus = 'ready';
        //             }else{
        //               this.selectedTender.closestatus = 'pending';
        //             }
        //           }
        //       });
        // });
    }
    closeTender(tenderId){
      console.log("Tender TO CLOSE ______++: ", tenderId);
      this._tenderService.closeTender(tenderId)
          .subscribe(tender => {
            for (let obj of this.allTenders){
              if (obj._id === tender[0].tender._id){
                obj.closestatus = 'closed'
              }
            }
            console.log("ALL TENDERS AFTER: _____++++:", this.allTenders);
            console.log("RESULT AFTER CLOSING THE TENDER: _____++++:", tender[0].tender);
      });
      
    }
    tableEntry: any = null;
    medicineTable: any = null;
    tableIndex: any = null;
    selectContract(vendorId){
      this.tableIndex = 1;
      console.log("Vendor To Contract: ", vendorId);
      for (let vendor of this.allVendors){
        if (vendorId === vendor._id){
          this.selectedVendor = vendor;
        }
      }
      var tenderId = this.selectedTender._id;
      this._vendorService.getTenderMeds(tenderId)
        .subscribe(meds => {
          
          console.log("ALL TENDER MEDS:---", meds[0].meds)
          this.allTenderMeds = meds[0].meds;
          console.log("ALL TENDER MEDicines:---", this.allTenderMeds);

          this.allVendorMeds = [];
          var medicine: any = null;

          for (let medi of this.allTenderMeds){
            if (medi.northvendor === vendorId){
              medicine = {"name":medi.name, 
                          "zone":"North", 
                          "mediunit":medi.mediunit, 
                          "quantity":medi.quantity, 
                          "estprice":medi.northbid, 
                          "meditype":medi.meditype }
              console.log("NORTH Matched", medi);
              this.allVendorMeds.push(medicine);
            }
            if (medi.southvendor === vendorId){
              medicine = {"name":medi.name, 
                          "zone":"South", 
                          "mediunit":medi.mediunit, 
                          "quantity":medi.quantity, 
                          "estprice":medi.southbid, 
                          "meditype":medi.meditype}
              console.log("SOUTH Matched", medi);
              this.allVendorMeds.push(medicine);
            }
            if (medi.centralvendor === vendorId){
              medicine = {"name":medi.name, 
                          "zone":"Central", 
                          "mediunit":medi.mediunit, 
                          "quantity":medi.quantity, 
                          "estprice":medi.centralbid, 
                          "meditype":medi.meditype}
              console.log("CENTRAL Matched", medi);
              this.allVendorMeds.push(medicine);
            }
          }
          console.log("ALL VENDOR MEDICINES ON THIS TENDER: ", this.allVendorMeds);

          for (let j=0; j<this.allContracts.length; j++){
            if ((this.allContracts[j].vendorId == vendorId) && (this.allContracts[j].tenderId == tenderId)){
                console.log("VALUE EXISTS++++++ ", this.existFlag);
                console.log("Matched contract++++++ ", this.allContracts[j]);
                this.viewContract = this.allContracts[j];
                this.existFlag = true;
            }
          }
          console.log("Selected Tender: ", this.selectedTender);
          console.log("Selected Vendor: ", this.selectedVendor);
          this.tableIndex = 1;
          this.showContractFlag = true;
          this.tableEntry = [];
          this.medicineTable = "<table "+"width="+'"100%"'+">"
                               +"<thead style="+ '"font-size: 9px; !important;"'+">"
                               +"<tr>"
                               +"<th  style="+ '"border-top: 1px solid #ddd !important;border-bottom: 1px solid #ddd !important;text-transform:uppercase;"'+" align="+"'left'"+">"+"#</th>"
                               +"<th  style="+ '"border-top: 1px solid #ddd !important;border-bottom: 1px solid #ddd !important;text-transform:uppercase;"'+" align="+"'left'"+">"+"Name with Rate Per Unit</th>"
                               +"<th  style="+ '"border-top: 1px solid #ddd !important;border-bottom: 1px solid #ddd !important;text-transform:uppercase;"'+" align="+"'left'"+">"+"Zone</th>"
                               +"<th  style="+ '"border-top: 1px solid #ddd !important;border-bottom: 1px solid #ddd !important;text-transform:uppercase;"'+" align="+"'left'"+">"+"Unit</th>"
                               +"<th  style="+ '"border-top: 1px solid #ddd !important;border-bottom: 1px solid #ddd !important;text-transform:uppercase;"'+" align="+"'left'"+">"+"Type</th>"
                               +"<th  style="+ '"border-top: 1px solid #ddd !important;border-bottom: 1px solid #ddd !important;text-transform:uppercase;"'+" align="+"'left'"+">"+"Quantity in Nos.</th>"
                               +"<th  style="+ '"border-top: 1px solid #ddd !important;border-bottom: 1px solid #ddd !important;text-transform:uppercase;"'+" align="+"'left'"+">"+"Price in Rs.</th>"
                               +"</tr>"
                               +"</thead>"
                               +"<tbody style="+ '"font-size: 9px; !important;"'+">"
          for (let medi of this.allVendorMeds){
            var cost = Number(medi.quantity)*Number(medi.estprice);
            console.log("QUANITY: ", Number(medi.quantity));
            console.log("MEDI PRICE: ", Number(medi.estprice));
            console.log("COST FOR THE MDDICVI: ", Number(cost));
            if(this.tableEntry === null){
              this.tableEntry = "<tr>"
                                +"<td style="+ '"border-bottom: 1px solid #ddd !important;"'+">"+this.tableIndex+"</td>"
                                +"<td style="+ '"border-bottom: 1px solid #ddd !important;"'+">"+medi.name+", @ Rs."+medi.estprice+"</td>"
                                +"<td style="+ '"border-bottom: 1px solid #ddd !important;"'+">Punjab</td>"
                                +"<td style="+ '"border-bottom: 1px solid #ddd !important;"'+">"+medi.mediunit+"</td>"
                                +"<td style="+ '"border-bottom: 1px solid #ddd !important;"'+">"+medi.meditype+"</td>"
                                +"<td style="+ '"border-bottom: 1px solid #ddd !important;"'+">"+Number(medi.quantity).toLocaleString("en")+"</td>"
                                +"<td style="+ '"border-bottom: 1px solid #ddd !important;"'+">"+cost.toLocaleString("en")+"</td>"
                                +"</tr>"
              console.log("TABLE ENRTY IN IF---------", this.tableEntry);
            }else{
              this.tableEntry = this.tableEntry 
                                +"<tr>"
                                +"<td style="+ '"border-bottom: 1px solid #ddd !important;"'+">"+this.tableIndex+"</td>"
                                +"<td style="+ '"border-bottom: 1px solid #ddd !important;"'+">"+medi.name+", @ Rs."+medi.estprice+"</td>"
                                +"<td style="+ '"border-bottom: 1px solid #ddd !important;"'+">Punjab</td>"
                                +"<td style="+ '"border-bottom: 1px solid #ddd !important;"'+">"+medi.mediunit+"</td>"
                                +"<td style="+ '"border-bottom: 1px solid #ddd !important;"'+">"+medi.meditype+"</td>"
                                +"<td style="+ '"border-bottom: 1px solid #ddd !important;"'+">"+Number(medi.quantity).toLocaleString("en")+"</td>"
                                +"<td style="+ '"border-bottom: 1px solid #ddd !important;"'+">"+cost.toLocaleString("en")+"</td>"
                                +"</tr>"
              console.log("TABLE ENRTY IN ELSE---------", this.tableEntry);
            }
            this.tableIndex++;
          }
          console.log("COMPLTETE TABLE ENTRIES---------", this.tableEntry);
          var tableEnd = "</tbody>"+"</table>";
          this.medicineTable = this.medicineTable+this.tableEntry+tableEnd;
          console.log("TABLE HTML TO RENDER---------", this.medicineTable);

      });
    }
    generateTemplate($event){
      this.contractTemplate = $event;
      console.log("Selected contract: ", this.contractTemplate);
      var year = moment().format('YYYY');
      this._contractTemplateService.getSignleTemplate(this.contractTemplate)
          .subscribe(result => {
            if (!result[0].status){
              this.selectedTemplate = null;
            }  
            this.selectedTemplate = result[0].result;
            console.log("Selected Template: ", this.selectedTemplate);
            this.contractInfo = this.selectedTemplate.profiletext;
            this.contractInfo = this.contractInfo.toString().replace(/vendor/g, this.selectedVendor.name);
            this.contractInfo = this.contractInfo.toString().replace(/VendorAddress/g, this.selectedVendor.address);
            this.contractInfo = this.contractInfo.toString().replace(/meds/g, this.medicineTable);
            this.contractInfo = this.contractInfo.toString().replace(/cY/g, year);
            // this.contractInfo = this.contractInfo+
          });
    }
    hideContractFlag(){
      this.selectedVendor = "";
      this.contractInfo = "";
      this.contractTemplate = "";
      this.viewContract = "";
      this.showContractFlag = false;
      this.viewContractFlag = false;
      this.existFlag = false;
      // this.tenderCloseFlag = false;
      // this.allVendors = [];
    }

    addVendorContract(){
        var date = moment().format();
        console.log("SAVING THE VENDOR CONTRACT WITH TEH IFORMATION: ",
                    "VendorId: ", this.selectedVendor._id,
                    "Vendorname: ", this.selectedVendor.name,
                    "TenderId: ", this.selectedTender._id,
                    "ProfileId: ", this.selectedTemplate._id,
                    "ProfileText: ", this.contractInfo,
                    "contractdate: ", date);
        this._vendorContractService.addVendorContract(this.selectedVendor._id,
                                                      this.selectedVendor.name,
                                                      this.selectedTender._id,
                                                      this.selectedTemplate._id,
                                                      this.contractInfo,
                                                      date)
            .subscribe(result => {
                console.log("results from add vednor contract.", result[0].result);
                this._vendorContractService.getAllVendorContracts()
                  .subscribe(contracts => {
                    console.log("ALL vendor Contacts from query: ", contracts);
                    if (!contracts[0].status){
                      this.allContracts = [];
                    }
                    this.allContracts = contracts[0].contracts;
                    console.log("ALL vendor Contacts: ", this.allContracts);
                    for (let j=0; j<this.allContracts.length; j++){
                      if ((this.allContracts[j].vendorId == this.selectedVendor._id) 
                            && (this.allContracts[j].tenderId == this.selectedTender._id)){
                          console.log("VALUE EXISTS++++++ ", this.existFlag);
                          console.log("Matched contract++++++ ", this.allContracts[j]);
                          this.viewContract = this.allContracts[j];
                          this.existFlag = true;
                      }
                    }
                    this.contractCount = 0;
                    console.log("Flag Value: ", this.existFlag);
                    for (let i=0; i<this.allVendors.length; i++){
                      for(let j=0; j<this.allContracts.length; j++){
                        if (this.allVendors[i]._id === this.allContracts[j].vendorId
                            && this.selectedTender._id === this.allContracts[j].tenderId){
                          console.log("Matched Entry:---", this.allVendors[i].name);
                          this.allVendors[i].status = "preview";
                          this.contractCount = this.contractCount + 1;
                          console.log("Matched Entry:---", this.allVendors[i].status);
                          break
                        }else{
                          this.allVendors[i].status = "pending";
                          console.log("Do not match:---", this.allVendors[i].status);
                        }
                      }
                    }
                    console.log("All Vendors After ADD LOOP___________++: ", this.allVendors);
                    console.log("CONTRACTS COUNT AFTER ADDING___________++: ", this.contractCount);
                    this._financialBiddingService.tenderFinancialBids(this.selectedTender._id)
                        .subscribe(totalfinancials => {
                          console.log("TENDER VENDOR COUNT FROM ALL FINANCIALS___________++: ", totalfinancials);
                          if (totalfinancials[0].totalfinancials){
                            this.tenderTotalFinancials = totalfinancials[0].totalfinancials.totalfinancials;
                            console.log("TENDER VENDOR COUNT___________++: ", this.tenderTotalFinancials);
                          }
                          if (this.tenderTotalFinancials  !== 0 || this.contractCount !== 0){
                            if (this.tenderTotalFinancials === this.contractCount){
                              this.tenderCloseFlag = true;
                            }
                          }
                    });
                });
        });

        this._vendorContractService.getAllVendorContracts()
          .subscribe(contracts => {
            console.log("ALL vendor Contacts from query: ", contracts);
            if (!contracts[0].status){
              this.allContracts = [];
            }
            this.allContracts = contracts[0].contracts;
            console.log("ALL vendor Contacts: ", this.allContracts);
            for (let j=0; j<this.allContracts.length; j++){
              if ((this.allContracts[j].vendorId == this.selectedVendor._id) 
                    && (this.allContracts[j].tenderId == this.selectedTender._id)){
                  console.log("VALUE EXISTS++++++ ", this.existFlag);
                  console.log("Matched contract++++++ ", this.allContracts[j]);
                  this.viewContract = this.allContracts[j];
                  this.existFlag = true;
                  // this.viewContractFlag = false;
              }
            }
            console.log("All Vendors After loop: ", this.allVendors);
            
            for (let i=0; i<this.allVendors.length; i++){
              for(let j=0; j<this.allContracts.length; j++){
                if (this.allVendors[i]._id === this.allContracts[j].vendorId
                    && this.selectedTender._id === this.allContracts[j].tenderId){
                  console.log("Matched Entry:---", this.allVendors[i].name);
                  this.allVendors[i].status = "preview";
                  console.log("Matched Entry:---", this.allVendors[i].status);
                  break
                }else{
                  this.allVendors[i].status = "pending";
                  console.log("Do not match:---", this.allVendors[i].status);
                }
              }
            }
            console.log("Flag Value: ", this.existFlag);
        });
    }
    url;
    printContract(){
      this.url = "http://localhost:8008/vendorcontracts/"+this.selectedVendor._id+this.selectedTender._id+".pdf";
      // var contract = "http://localhost:8008/vendorcontracts/"+this.selectedVendor._id+this.selectedTender._id+".pdf";
      // // window.location.
      // window.open(contract);
      // console.log("contract link: ", contract);
      // var contract = '/vendorcontracts/'+this.selectedVendor._id+this.selectedTender._id+".pdf";
      // this._location.go(contract);
      // window.location.href = contract;
      this._vendorContractService.getFile(this.selectedVendor._id,this.selectedTender._id)
        .subscribe(file => {
      });
    }
    viewVendorContract(){
      this.viewContractFlag = true;
    }    
    hideVendorContract(){
      this.viewContractFlag = false;
    }
}