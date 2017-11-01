import { Component, ElementRef } from '@angular/core';
import * as _ from "lodash";
import { Location } from '@angular/common';
import { LoginService } from '../../services/login.services'
import { PurchaseOrderService } from '../../services/purchaseorder.service'
import { GoodsRecievedService } from '../../services/goodsrecieved.service'
import { ConfigsService } from '../../services/configs.service'
import { AttachmentService } from '../../services/attachment.service'
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { Tender } from '../../models/tender';
import * as moment from "moment";
import { GlobalEventsManager } from "../../services/eventsmanager.service";

@Component({
    selector: 'goodsrecieved',
    providers: [PurchaseOrderService, 
                GoodsRecievedService, 
                AttachmentService, 
                ConfigsService ],
    templateUrl: './goodsrecieved.html',
    styleUrls: ['./goodsrecieved.css']
})
export class goodsrecieved {
    
    dropdownSettings: any = {};
    dt: Date = new Date();
    allPurchaseOrders: any = [];
    purchaseOrder: any = [];
    poNumber: any = null;
    selectedUser: any = null;
    selectedOrder: any = null;
    showCauseNotice: any = [];
    editView:boolean = false;
    fileReference: any = null;
    validGoodsRecieved:boolean = false;
    imageUploading: boolean = false;

    constructor(private _router: Router, 
                private _purchaseOrderService: PurchaseOrderService,
                private _service: GoodsRecievedService,
                private _loginService: LoginService,
                private _attachmentService: AttachmentService,
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
                this.getAllOrders();
        });
    }
    verifyGoodsRecieved(){
        console.log("Verify Goods Recieved",this.selectedOrder)
        this.selectedOrder.fileref = this.fileReference
        this.selectedOrder.isverified = true
        this.validGoodsRecieved = false
        this._service.updateGoodsRecieved(this.selectedOrder)
        .subscribe(result => {
          console.log("Result from update goods recieved", result);
          this.fileReference = null;
          this.imageUploading = false;
          this.editView = false;
        })
    }
    checkIfValid(){
        for (let medi of this.selectedOrder.medicine){
            if (((medi.recievedquantity<1 || !medi.recievedquantity)
             && (medi.demandedquantity>=1)) 
              || (medi.recievedquantity > medi.demandedquantity))
               return 0;
        }
        return 1
    }
    postFileService(file) {
      this._attachmentService.addAttachment(file)
        .subscribe(result => {
          console.log("Result from uploading medicine image", result);
          this.fileReference = result.FileReference;
          this.imageUploading = false;
        })
    }
    fileChange(event){
      this.imageUploading = true;
      let files = event.target.files;
      if (files.length > 0) {
        var formData: FormData = new FormData();
        let file = files[0];
        formData.append('uploadFile', file, file.name);
        /** No need to include Content-Type in Angular 4 */
        this.postFileService(formData);
      }
    }
    changeRecvQuantity(e,i){
        this.selectedOrder.medicine[i].recievedquantity = e
        if (this.checkIfValid()) this.validGoodsRecieved = true;
        else this.validGoodsRecieved = false;
        console.log("Selected Order",this.selectedOrder)
    }
    hideEditView(){
        this.selectedOrder = null;
        this.editView = false;
        this.validGoodsRecieved = false;
    }
    editGoodsRecieved(order){
        console.log("Selected Order", order)
        this.selectedOrder = order;
        this.editView = true;
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
    raiseLateIssuance(order){
        console.log("late issuance",order)
        this._service.raiseLateIssuance(order._id)
        .subscribe(result => {
          console.log("Result from update goods recieved", result);
          this.allPurchaseOrders = []
          this.showCauseNotice = []
          this.getAllOrders()
        })
    }
    getAllOrders(){
        this._purchaseOrderService.getAllOrders()
        .subscribe(orders => {
          console.log("Purchase Orders",orders)
          this.allPurchaseOrders = orders[0].orders
          this.setShowCauseNotice();
        })
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
