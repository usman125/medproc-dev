import { Component, ElementRef } from '@angular/core';
import * as _ from "lodash";
import { Location } from '@angular/common';
import { LoginService } from '../../services/login.services'
import { FinancialBiddingService } from '../../services/financialbidding.service'
import { PurchaseOrderService } from '../../services/purchaseorder.service'
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
  	selector: 'purchaseorder',
    providers: [TenderService,  
                DemandService, 
                PurchaseOrderService, 
                VendorService, 
                FinancialBiddingService, 
                ConfigsService,
                VendorTechQualiService ],
  templateUrl: './purchaseorder.html',
  styleUrls: ['./purchaseorder.css']
})

export class purchaseorder {

    public poHTML = '<p style="text-align: center;font-weight: bolder;">Primary &amp; Secondary Healthcare Department, Government of the Punjab</p><hr><p style="text-align: justify;"><span style="font-size: 8px;"><u>Through Registered Post</u></span></p><p style="text-align: center;"><span style="font-size: 9px;font-weight: bold;"><u>Purchase Order</u></span></p><p style="text-align: left;"><span style="font-size: 9px;font-weight: bold;">Purchase Order No:&nbsp;pono</span></p><p style="text-align: left;"><span style="font-size: 9px;font-weight: bold;">Date:&nbsp;podate</span></p><p style="text-align: left;"><span style="font-size: 9px;font-weight: bold;">Contractor&#39;s Name and Address:&nbsp;vendor,&nbsp;VendorAddress</span></p><p style="text-align: left;"><span style="font-size: 9px;font-weight: bold;">Firm&#39;s Address:&nbsp;VendorAddress</span></p><p style="text-align: left;"><span style="font-size: 9px;"><strong>Particulars of Items/Stores:</strong> As per detail given below and approved specifications mentioned in notifications of award/advance acceptance of tender (AAT) and signed contract for financial year <strong>cY</strong></span></p><p><span style="font-size: 9px;">meds</span></p><p style="text-align: justify;"><span style="font-size: 9px;"><strong>Instructions:</strong></span></p><table><tbody style="font-size: 9px;"><tr><td>Place of Delivery</td><td>MSD, Gromangat Road, Lahore or any warehouse designated by P&amp;SHD or concerned vertical program.</td></tr><tr><td>Name &amp; Address of Consignee</td><td><strong>___________________________________</strong></td></tr><tr><td>Despatch Instruction</td><td>The stores should be deliver to the consignee free of all charges in safe &amp; sound condition.</td></tr><tr><td>Inspection Authority</td><td>Notified Inspection Committee by P&amp;SHD</td></tr><tr><td>Place of Inspection</td><td>Consignee&#39;s end</td></tr></tbody></table><p style="text-align: center;page-break-before: always;"><span style="font-size: 9px;"><strong>Schedule of Requirement</strong></span></p><table style="width: 100%;"><thead style="font-size: 9px;"><tr><th style="vertical-align:top;border:1px solid #ddd;">Supply Schedule</th><th style="vertical-align:top;border:1px solid #ddd;">Delivery of Qty without Penalty</th><th style="vertical-align:top;border:1px solid #ddd;">Grace Period</th><th style="vertical-align:top;border:1px solid #ddd;">Total Delivery Period</th></tr></thead><tbody style="font-size: 9px;"><tr><td style="vertical-align:top;border:1px solid #ddd;">Immediately after receiving of the purchase order(started from date of Purchase Order)</td><td style="vertical-align:top;border:1px solid #ddd;">60 Days</td><td style="vertical-align:top;border:1px solid #ddd;">15 Days</td><td style="vertical-align:top;border:1px solid #ddd;">75 Days</td></tr><tr><td colspan="4" style="border: 1px solid #ddd;">Sixty (60) days as delivery period + Fifteen (15) days as grace period from the date of issuance of purchase Order or earlier extension in delivery period with penalty @ 0.134 % per day after sixty (60) days (as delivery period shall be decided by consignee/procuring agency on the formal request of supplier as specified in clause 20 of general term and conditions of the Contract.</td></tr><tr><td colspan="1" style="border: 1px solid #ddd;"><strong>Conditions of Contract/Purchase Order</strong></td><td colspan="3" style="border: 1px solid #ddd;">The contractor shall supply the item(s) as per frame work contract signed between the Primary and Secondary Healthcare Department (P&amp;SHD) and Contractor for Financial Year 2017-18 &amp; Approved specifications mentioned in notifications and awards (AAT) issued by P&amp;SHD.</td></tr></tbody></table><p style="text-align: justify;"><br></p><p><span style="font-size: 9px;"><strong><u>IMPORTANT NOTE:</u></strong> This purchase order shall be the part of the Framework Contract concluded by Primary &amp; Secondary Healthcare department, Govt. of Punjab, during financial year <strong>cY</strong> as Annexed in Annexure-E of The Contract.</span></p><p style="text-align: justify;"><br></p><p style="text-align: right;"><span style="font-size: 9px;"><strong style="border-top: 1px solid #000;">Issuing Authority</strong></span></p><p style="text-align: justify;"><br></p><p><span style="font-size: 9px;">Copy to:<br>1. Secretary Primary &amp; Secondary Healthcare Department, Government of the Punjab <br>2. Director General Health Services Punjab Lahore <br>3. District Coordination Officer <br>4. District Account Officer <br>5. Account Section <br>6. <strong>vendor</strong>, <strong>VendorAddress</strong><strong>&nbsp;</strong>for execution of the Purchase Order <br>7. ______________________________________________</span></p>';
    dropdownSettings: any = {};
    dt: Date = new Date();
    allTenders: any = [];
    createPoView: boolean = false;
    allVendors: any = [];
    allVendorsName: any = [];
    allPurchaseOrders: any = [];
    selectedVendorId: any;
    selectedVendorName: any;
    tenderMeds: any = [];
    selectedTenderId: any;
    selectedTenderName: string;
    userZone: string;
    medicineView: boolean = false;
    vendorView: boolean = false;
    userDemands: any = [];
    poList: any = [];
    poListByVendor: any = [];
    remainingQuantity: any = [];
    purchaseOrder: any = [];
    poNumber: any;
    tenderLength: any;
    poLength: any;
    requestPo: boolean = false;
    selectTenderForm: FormGroup;
    leadtime: any = null;
    medicineTable: any = null;
    
    tableEntry: any = null;
    tableIndex: any = 0;
    allVendorMeds: any = [];
    selectedVendor: any = null;
    selectedUser: any = null;
    showCauseNotice: any = [];
    tempPoList: any = [];

    constructor(private _router: Router, 
                private _service: PurchaseOrderService,
                private _tenderService: TenderService,
                private _vendorService: VendorService,
                private _vendorTechQualiService: VendorTechQualiService,
                private _demandService: DemandService,
                private _loginService: LoginService,
                private _location: Location,
                private _formBuilder: FormBuilder,
                private _eventMangaerService: GlobalEventsManager){
		this._eventMangaerService.showNavBar(true);
    }
    ngOnInit(){
        var userId = localStorage.getItem('userid');
        this._loginService.getAuthUser(userId)
            .subscribe(user => {
                this.selectedUser = user[0].user;
                console.log("SELECTED USER:::____________", this.selectedUser);
        		this.getAllClosedTenders();
        		this._buildSelectTenderForm();
        		this.getUserZone();
        		this.getUserDemands();
        		this.getAllOrders();
        });
    }
    createPo(){
    	this.createPoView = true;
    }
    backToPo(){
    	this.createPoView = false;
    }
    _buildSelectTenderForm(){
        this.selectTenderForm = this._formBuilder.group({
			tender: ["", Validators.compose([Validators.required])]
        });
    }
    showHidePoSubmit(){
    	let valueExist = false;
    	for(let i=0;i<this.remainingQuantity.length;i++){
    		if (this.remainingQuantity[i]<0){
    			this.requestPo = false;
    			return;
    		}
    		if (this.poListByVendor[i]){
	    		if (this.poListByVendor[i].quantity>this.remainingQuantity[i]){
	    			valueExist = true;
	    		}
    		}
    	}
    	if(this.leadtime>0&&valueExist){
    		this.requestPo = true;
    	} else{
    		this.requestPo = false;
    	}
    }
    changeQuantity(i,event,medi){
    	console.log("quantity",i,event,medi,medi.quantity);
    	this.remainingQuantity[i] = parseFloat(medi.quantity) - parseFloat(event);
    	this.showHidePoSubmit();
    }
    changeLeadTime(event){
    	console.log("Lead Time",event);
    	this.leadtime = event;
    	this.showHidePoSubmit();
    }
    checkIfDemanded(medi){
    	for(let j=0;j<this.userDemands.length;j++){
    		if(_.find(this.userDemands[j].medicine,['_id',medi._id])){
    			return true
    		}
    	}
    	return false
    }
    setPoList(){
    	this.poList = [];
    	this.allVendors = [];
    	this.allVendorsName = [];
    	for(let i=0;i<this.tenderMeds.medicine.length;i++){
    		if((this.tenderMeds.medicine[i].northvendor && this.userZone==='North')
    		 || (this.tenderMeds.medicine[i].southvendor && this.userZone==='South') 
    		 || (this.tenderMeds.medicine[i].centralvendor && this.userZone==='Central')){
    			
                if(this.checkIfDemanded(this.tenderMeds.medicine[i])){

    				this.poList.push(this.tenderMeds.medicine[i])
    				
                    if(this.tenderMeds.medicine[i].northvendor
    					&&this.allVendors.indexOf(this.tenderMeds.medicine[i].northvendor)===-1){
    					this.allVendors.push(this.tenderMeds.medicine[i].northvendor)
    					this.allVendorsName.push(this.tenderMeds.medicine[i].northvendorname)
    				}
    				if(this.tenderMeds.medicine[i].southvendor
    					&&this.allVendors.indexOf(this.tenderMeds.medicine[i].southvendor)===-1){
    					this.allVendors.push(this.tenderMeds.medicine[i].southvendor)
    					this.allVendorsName.push(this.tenderMeds.medicine[i].southvendorname)
    				}
    				if(this.tenderMeds.medicine[i].centralvendor
    					&&this.allVendors.indexOf(this.tenderMeds.medicine[i].centralvendor)===-1){
    					this.allVendors.push(this.tenderMeds.medicine[i].centralvendor)
    					this.allVendorsName.push(this.tenderMeds.medicine[i].centralvendorname)
    				}
    			}
    		}
    	}
        this.tempPoList = this.poList
        console.log("PO LIST Func",this.poList)
    	console.log("PO LIST Temp Func",this.tempPoList)
    	console.log("Vendors",this.allVendors)
    }
    getUserDemands(){
    	this._service.getUserDemands()
		.subscribe(demands => {
		    this.userDemands = demands[0].demands;
		    console.log("user demands: ", this.userDemands);
		});
    }
    getUserZone(){
    	this._service.getUserZone()
		.subscribe(zone => {
		    this.userZone = zone[0].zone.zone;
		    console.log("user zone: ", this.userZone);
		});
    }
    getTenderMeds(){
    	this._service.getClosedTenderMeds(this.selectedTenderId)
		.subscribe(tender => {
			console.log("Tmeds",tender)
		    if(!tender[0].status){
		      this._router.navigate(['blank']);
		    }
		    this.tenderMeds = tender[0].tendermeds;
		    this.setPoList();
		    console.log("TENDER MEDS: ", this.tenderMeds);
		});
    }
    initRemainingQuantity(){
    	this.remainingQuantity = []
    	// this.allPurchaseOrders.reverse();
    	// let poFind = _.find(this.allPurchaseOrders,['vendor',this.selectedVendorId])
    	// if (poFind){
    	// 	for (let i=0;i<poFind.medicine.length;i++){
    	// 		if (poFind.medicine[i].remainingquantity){
    	// 			this.poListByVendor[i].quantity = poFind.medicine[i].remainingquantity
    	// 		}
    	// 	}	
    	// }
    }
    backToVendors(){
    	this.medicineView = false;
    	this.vendorView = true;
    }
    vendorSelect(i){
    	this.medicineView = true;
    	this.vendorView = false;
    	this.requestPo = false;
    	this.selectedVendorId = this.allVendors[i];
    	this.selectedVendorName = this.allVendorsName[i];
    	this.poListByVendor = [];
    	this.leadtime = null;
    	let poCount = 0;
        console.log("Po list",this.poList)
        console.log("Temp Po list",this.tempPoList)
    	
        for(let j=0;j<this.poList.length;j++){
			if(
			(this.poList[j].northvendor===this.selectedVendorId && this.userZone==='North')
			|| (this.poList[j].southvendor===this.selectedVendorId && this.userZone==='South')
			|| (this.poList[j].centralvendor===this.selectedVendorId && this.userZone==='Central')
			) {
				this.poListByVendor[poCount] = this.poList[j];
				poCount++;
			}
    	}
        this._vendorService.getSingleVendor(this.selectedVendorId)
            .subscribe(vendor => {
                console.log("SELECTED VENDOR:----", vendor[0].vendor);
                this.selectedVendor = vendor[0].vendor;
                console.log("SELECTED VENDOR AFTER ASSIGNING:----___________", this.selectedVendor);
	            this.initRemainingQuantity();
	            console.log("Po List by vendor", this.poListByVendor)
        });
    }
    setShowCauseNotice(){
    	let i=0;
    	for (let order of this.allPurchaseOrders){
    		let diffLeadtime = moment(order.createdat).diff(moment().format('YYYY-MM-DD'),'days');
    		console.log("diff",diffLeadtime,i,moment().format('YYYY-MM-DD'))
    		this.showCauseNotice[i] = false;
    		if ((diffLeadtime+parseInt(order.leadtime))<=0){
    			this.showCauseNotice[i] = true;
    		}
    		i++;
    	}
    }
    getAllOrders(){
    	this._service.getAllOrders()
        .subscribe(orders => {
          console.log("Purchase Orders",orders)
          this.allPurchaseOrders = orders[0].orders
          this.allPurchaseOrders.reverse()
          this.setShowCauseNotice();
        })
    }
    addPurchaseOrder(){
        this.tableIndex = 1;
        this.requestPo = false;
        var mediList:any = [], mediCounter:any = 0;
    	console.log("Po list by vendor",this.poListByVendor,this.remainingQuantity,this.leadtime)
    	for(let i=0;i<this.poListByVendor.length;i++){
    		this.poListByVendor[i].remainingquantity = this.remainingQuantity[i];
    		this.poListByVendor[i].demandedquantity = this.poListByVendor[i].quantity - this.remainingQuantity[i];
    		this.poListByVendor[i].quantity = this.remainingQuantity[i];
    	    if (this.poListByVendor[i].demandedquantity>0){
                mediList[mediCounter] = this.poListByVendor[i]
                mediCounter++
            }
        }
    	this.purchaseOrder = {
    		tender: this.selectedTenderId,
    		tendername: this.selectedTenderName,
    		vendor: this.selectedVendorId,
    		vendorname: this.selectedVendorName,
    		ponumber: this.poNumber,
    		leadtime: this.leadtime, 
    		createdat: moment().format('YYYY-MM-DD'), 
    		medicine: mediList
    	}
        mediList = []
          this.allVendorMeds = [];
          var medicine: any = null;
          for (let medi of this.poListByVendor){
            if (medi.northvendor === this.selectedVendorId){
              medicine = {"name":medi.name, 
                          "zone":"North", 
                          "mediunit":medi.mediunit, 
                          "quantity":medi.quantity,
                          "estprice":medi.northbid, 
                          "demandedquantity":medi.demandedquantity, 
                          "meditype":medi.meditype }
              console.log("NORTH Matched", medi);
              if (!isNaN(medicine.quantity)){
                  this.allVendorMeds.push(medicine);
              }
            }
            if (medi.southvendor === this.selectedVendorId){
              medicine = {"name":medi.name, 
                          "zone":"South", 
                          "mediunit":medi.mediunit, 
                          "quantity":medi.quantity, 
                          "estprice":medi.southbid,
                          "demandedquantity":medi.demandedquantity,  
                          "meditype":medi.meditype}
              console.log("SOUTH Matched", medi);
              if (!isNaN(medicine.quantity)){
                  this.allVendorMeds.push(medicine);
              }
            }
            if (medi.centralvendor === this.selectedVendorId){
              medicine = {"name":medi.name, 
                          "zone":"Central", 
                          "mediunit":medi.mediunit, 
                          "quantity":medi.quantity, 
                          "estprice":medi.centralbid, 
                          "demandedquantity":medi.demandedquantity, 
                          "meditype":medi.meditype}
              console.log("CENTRAL Matched", medi);
              if (!isNaN(medicine.quantity)){
                  this.allVendorMeds.push(medicine);
              }
            }
          }
          console.log("ALL VENDOR MEDICINES ON THIS TENDER: ", this.allVendorMeds);
        var totalPoCost = 0;
        this.tableEntry = [];
        this.medicineTable = "<table "+"width="+'"100%"'+">"
                   +"<thead style="+ '"font-size: 9px !important;"'+">"
                   +"<tr>"
                   +"<th  style="+ '"border-top: 1px solid #ddd !important;border-bottom: 1px solid #ddd !important;text-transform:uppercase;"'+" align="+"'left'"+">"+"Item No.</th>"
                   +"<th  style="+ '"border-top: 1px solid #ddd !important;border-bottom: 1px solid #ddd !important;text-transform:uppercase;"'+" align="+"'left'"+">"+"Name of Item</th>"
                   +"<th  style="+ '"border-top: 1px solid #ddd !important;border-bottom: 1px solid #ddd !important;text-transform:uppercase;"'+" align="+"'left'"+">"+"Approved Rate (Unit price) In PKR</th>"
                   +"<th  style="+ '"border-top: 1px solid #ddd !important;border-bottom: 1px solid #ddd !important;text-transform:uppercase;"'+" align="+"'left'"+">"+"Quantity Ordered</th>"
                   +"<th  style="+ '"border-top: 1px solid #ddd !important;border-bottom: 1px solid #ddd !important;text-transform:uppercase;"'+" align="+"'left'"+">"+"Cost in Rs.</th>"
                   +"</tr>"
                   +"</thead>"
                   +"<tbody style="+ '"font-size: 9px !important;"'+">"
          for (let medi of this.allVendorMeds){
            var cost = Number(medi.demandedquantity)*Number(medi.estprice);
            totalPoCost = totalPoCost + cost
            console.log("DEMANDED QUANITY: ", Number(medi.demandedquantity));
            console.log("MEDI PRICE: ", Number(medi.estprice));
            console.log("Selected MEDICINE IN PO: ", medi);
            console.log("Selected MEDICINE COST IN PO: ", cost);
            if(this.tableEntry === null){
              this.tableEntry = "<tr>"
                                +"<td style="+ '"border-bottom: 1px solid #ddd !important;"'+">"+this.tableIndex+"</td>"
                                +"<td style="+ '"border-bottom: 1px solid #ddd !important;"'+">"+medi.name+"-"+medi.mediunit+"-"+medi.meditype+"</td>"
                                +"<td style="+ '"border-bottom: 1px solid #ddd !important;"'+">"+medi.estprice+"</td>"
                                +"<td style="+ '"border-bottom: 1px solid #ddd !important;"'+">"+Number(medi.demandedquantity).toLocaleString("en")+"</td>"
                                +"<td style="+ '"border-bottom: 1px solid #ddd !important;"'+">"+cost.toLocaleString("en")+"</td>"
                                +"</tr>"
              console.log("TABLE ENRTY IN IF---------", this.tableEntry);
            }else{
              this.tableEntry = this.tableEntry 
                                +"<tr>"
                                +"<td style="+ '"border-bottom: 1px solid #ddd !important;"'+">"+this.tableIndex+"</td>"
                                +"<td style="+ '"border-bottom: 1px solid #ddd !important;"'+">"+medi.name+"-"+medi.mediunit+"-"+medi.meditype+"</td>"
                                +"<td style="+ '"border-bottom: 1px solid #ddd !important;"'+">"+medi.estprice+"</td>"
                                +"<td style="+ '"border-bottom: 1px solid #ddd !important;"'+">"+Number(medi.demandedquantity).toLocaleString("en")+"</td>"
                                +"<td style="+ '"border-bottom: 1px solid #ddd !important;"'+">"+cost.toLocaleString("en")+"</td>"
                                +"</tr>"
              console.log("TABLE ENRTY IN ELSE---------", this.tableEntry);
            }
            this.tableIndex++;
          }
          console.log("COMPLTETE TABLE ENTRIES---------", this.tableEntry);
          var tableEnd = "<tr><td style="+ '"border-bottom: 1px solid #ddd !important;"'+" colspan='4'>Grand Total Rs:</td><td style="+ '"border-bottom: 1px solid #ddd !important;"'+">"+totalPoCost.toLocaleString('en')+"</td></tr>"+"<tr><td style="+ '"border-bottom: 1px solid #ddd !important;"'+" colspan='5'>In Words:</td></tr>"+"</tbody>"+"</table>";
          this.medicineTable = this.medicineTable+this.tableEntry+tableEnd;
          console.log("TABLE HTML TO RENDER---------", this.medicineTable);
          console.log("PAY ORDER HTML BEFORE REPLACING---------", this.poHTML);
          var fiscalYearStart = moment().format('YYYY');
            var fiscalYearEnd = moment().add(1, 'years').format('YY');
        var cY = fiscalYearStart+"-"+fiscalYearEnd;
          this.poHTML = this.poHTML.toString().replace(/meds/g, this.medicineTable);
          this.poHTML = this.poHTML.toString().replace(/vendor/g, this.selectedVendor.name);
          this.poHTML = this.poHTML.toString().replace(/VendorAddress/g, this.selectedVendor.address);
          this.poHTML = this.poHTML.toString().replace(/userName/g, this.selectedUser[0].name);
          this.poHTML = this.poHTML.toString().replace(/pono/g, this.poNumber);
          this.poHTML = this.poHTML.toString().replace(/podate/g, moment().format('MM-DD-YYYY'));
          this.poHTML = this.poHTML.toString().replace(/cY/g, cY);
          console.log("PAY ORDER TO PRINT:---------", this.poHTML);

    	this._service.addPurchaseOrder(this.purchaseOrder, this.poHTML, this.selectedUser[0].name)
        .subscribe(order => {
          console.log("Purchase Order Saved",order)
          this.getAllOrders();
          this.createPoView = false;
          this.vendorView = false;
          this.medicineView = false;
          this.medicineTable= null;
          this.poHTML = '<p style="text-align: center;font-weight: bolder;">Primary &amp; Secondary Healthcare Department, Government of the Punjab</p><hr><p style="text-align: justify;"><span style="font-size: 8px;"><u>Through Registered Post</u></span></p><p style="text-align: center;"><span style="font-size: 9px;font-weight: bold;"><u>Purchase Order</u></span></p><p style="text-align: left;"><span style="font-size: 9px;font-weight: bold;">Purchase Order No:&nbsp;pono</span></p><p style="text-align: left;"><span style="font-size: 9px;font-weight: bold;">Date:&nbsp;podate</span></p><p style="text-align: left;"><span style="font-size: 9px;font-weight: bold;">Contractor&#39;s Name and Address:&nbsp;vendor,&nbsp;VendorAddress</span></p><p style="text-align: left;"><span style="font-size: 9px;font-weight: bold;">Firm&#39;s Address:&nbsp;VendorAddress</span></p><p style="text-align: left;"><span style="font-size: 9px;"><strong>Particulars of Items/Stores:</strong> As per detail given below and approved specifications mentioned in notifications of award/advance acceptance of tender (AAT) and signed contract for financial year <strong>cY</strong></span></p><p><span style="font-size: 9px;">meds</span></p><p style="text-align: justify;"><span style="font-size: 9px;"><strong>Instructions:</strong></span></p><table><tbody style="font-size: 9px;"><tr><td>Place of Delivery</td><td>MSD, Gromangat Road, Lahore or any warehouse designated by P&amp;SHD or concerned vertical program.</td></tr><tr><td>Name &amp; Address of Consignee</td><td><strong>___________________________________</strong></td></tr><tr><td>Despatch Instruction</td><td>The stores should be deliver to the consignee free of all charges in safe &amp; sound condition.</td></tr><tr><td>Inspection Authority</td><td>Notified Inspection Committee by P&amp;SHD</td></tr><tr><td>Place of Inspection</td><td>Consignee&#39;s end</td></tr></tbody></table><p style="text-align: center;page-break-before: always;"><span style="font-size: 9px;"><strong>Schedule of Requirement</strong></span></p><table style="width: 100%;"><thead style="font-size: 9px;"><tr><th style="vertical-align:top;border:1px solid #ddd;">Supply Schedule</th><th style="vertical-align:top;border:1px solid #ddd;">Delivery of Qty without Penalty</th><th style="vertical-align:top;border:1px solid #ddd;">Grace Period</th><th style="vertical-align:top;border:1px solid #ddd;">Total Delivery Period</th></tr></thead><tbody style="font-size: 9px;"><tr><td style="vertical-align:top;border:1px solid #ddd;">Immediately after receiving of the purchase order(started from date of Purchase Order)</td><td style="vertical-align:top;border:1px solid #ddd;">60 Days</td><td style="vertical-align:top;border:1px solid #ddd;">15 Days</td><td style="vertical-align:top;border:1px solid #ddd;">75 Days</td></tr><tr><td colspan="4" style="border: 1px solid #ddd;">Sixty (60) days as delivery period + Fifteen (15) days as grace period from the date of issuance of purchase Order or earlier extension in delivery period with penalty @ 0.134 % per day after sixty (60) days (as delivery period shall be decided by consignee/procuring agency on the formal request of supplier as specified in clause 20 of general term and conditions of the Contract.</td></tr><tr><td colspan="1" style="border: 1px solid #ddd;"><strong>Conditions of Contract/Purchase Order</strong></td><td colspan="3" style="border: 1px solid #ddd;">The contractor shall supply the item(s) as per frame work contract signed between the Primary and Secondary Healthcare Department (P&amp;SHD) and Contractor for Financial Year 2017-18 &amp; Approved specifications mentioned in notifications and awards (AAT) issued by P&amp;SHD.</td></tr></tbody></table><p style="text-align: justify;"><br></p><p><span style="font-size: 9px;"><strong><u>IMPORTANT NOTE:</u></strong> This purchase order shall be the part of the Framework Contract concluded by Primary &amp; Secondary Healthcare department, Govt. of Punjab, during financial year <strong>cY</strong> as Annexed in Annexure-E of The Contract.</span></p><p style="text-align: justify;"><br></p><p style="text-align: right;"><span style="font-size: 9px;"><strong style="border-top: 1px solid #000;">Issuing Authority</strong></span></p><p style="text-align: justify;"><br></p><p><span style="font-size: 9px;">Copy to:<br>1. Secretary Primary &amp; Secondary Healthcare Department, Government of the Punjab <br>2. Director General Health Services Punjab Lahore <br>3. District Coordination Officer <br>4. District Account Officer <br>5. Account Section <br>6. <strong>vendor</strong>, <strong>VendorAddress</strong><strong>&nbsp;</strong>for execution of the Purchase Order <br>7. ______________________________________________</span></p>';
          this._buildSelectTenderForm();
        });
    	console.log("PO Submit",this.purchaseOrder)
    }
    printPo(ponumber){
        console.log("PRINT PAYORDER:_______++++++::", ponumber);
        var url = 'http://localhost:8008/purchaseorders/'+ponumber+'.pdf';
        window.open(url, '_blank');
    }
    selectTender(tender){
		console.log("Tender",tender)
		this.selectedTenderId = tender.tender._id;
		this.selectedTenderName = tender.tender.name;
		this.getTenderMeds();
		this.getAllTenders();
		this.vendorView = true;
		this.medicineView = false;
    }
    getAllClosedTenders(){
		this._tenderService.getAllClosedTenders()
		.subscribe(tenders => {
		    if(!tenders[0].status){
		    }
		    this.allTenders = tenders[0].tenders;
		    console.log("ALL CLOSED TENDERS: ", this.allTenders);
		});
    }
    getTenderIndex(tempTenders){
    	for(let i=0;i<tempTenders.length;i++){
	    	if(tempTenders[i]._id===this.selectedTenderId){
	    		return i;
	    	}
	    }
    }
    getAllTenders(){
		this._tenderService.getAllTenders()
		.subscribe(tenders => {
		    if(!tenders[0].status){
		    }
		    let tempTenders = tenders[0].tenders;
		    console.log("Temp tenders",tempTenders)
		    this.tenderLength = this.getTenderIndex(tempTenders);
		    console.log("Tender Length",this.tenderLength)
		    tempTenders = [];
		    this._service.getAllOrders()
		    .subscribe(orders => {
		    	this.poLength = orders[0].orders.length;
		    	let poLength = this.poLength.toString().length;
		    	let poStr = ''
		    	if(poLength<6){
		    		let str = "000000"+this.poLength.toString();
		    		poStr = str.slice(poLength,str.length);
		    	} else {
		    		poStr = poLength;
		    	}
		    	let tenderLength = this.tenderLength.toString().length;
		    	let tenderStr = '';
		    	if(tenderLength<3){
		    		let str = "000"+this.tenderLength.toString();
		    		tenderStr = str.slice(tenderLength,str.length);
		    	} else {
		    		tenderStr = tenderLength;
		    	}
		    	this.poNumber = "PO"+moment().format('YYYY')+tenderStr+poStr;
		    	console.log("Po number", this.poNumber)
		    })
		    console.log("ALL CLOSED TENDERS: ", this.tenderLength);
		});
    }
    public getDate(): number {
      return this.dt && this.dt.getTime() || new Date().getTime();
    }
    logout(){
      this._loginService.logout();
    }
    goToRoute(name){
      this._router.navigate([name]);
    }

}
