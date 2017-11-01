import {Component, ElementRef, ViewChild} from '@angular/core';
import {LoginService} from '../../services/login.services'
import {TenderService} from '../../services/tender.service'
import {ConfigsService} from '../../services/configs.service'
import {VendorService} from '../../services/vendor.service'
import {BlacklistRequestService} from '../../services/blacklistrequest.service'
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { Tender } from '../../models/tender';
import * as moment from "moment";
import { ModalDirective } from 'ngx-bootstrap/modal/modal.component';
import { GlobalEventsManager } from "../../services/eventsmanager.service";

@Component({
    selector: 'blacklistrequest',
    providers: [TenderService, 
                ConfigsService, 
                VendorService, 
                BlacklistRequestService],
    templateUrl: 'blacklistrequest.html',
    styleUrls: ['blacklistrequest.css']
})

export class blacklistrequest {
    
  filterQuery: any;
  allVendors: any = [];
  allBlacklistRequests: any = [];

  constructor(private _router: Router, 
              private _loginService: LoginService,
              private _formBuilder: FormBuilder,
              private _service: ConfigsService,
              private _vednorService: VendorService,
              private _blacklistrequestService: BlacklistRequestService,
              private _eventMangaerService: GlobalEventsManager){
    
    this._eventMangaerService.showNavBar(true);
  }

  ngOnInit(){
    this._vednorService.getAllVendors()
      .subscribe(vendors => {
        console.log("list of all vendors:===", vendors);
        this.allVendors = vendors[0].vendors;
        for (let vendor of this.allVendors){
          vendor.bliststatus = "Blacklist";
        }
        console.log("list of vendors to show:===", this.allVendors);
        var userId = localStorage.getItem('userid');
        this._blacklistrequestService.allBlacklistRequests()
          .subscribe(requests => {
            if (!requests[0].status){
              this._router.navigate[('blank')];
            } 
            console.log("All blacklist requests from users:==========", requests[0].requests);
            this.allBlacklistRequests = requests[0].requests;
            console.log("All BLACK LIST REQUEST ARRAY:==========", this.allBlacklistRequests);
            for (let request of this.allBlacklistRequests){
              for (let vendor of this.allVendors){
                if ((vendor._id === request.vendorId) && 
                                    (userId === request.userId) && (request.status === "pending")){
                  console.log("MATCHED:==========", this.allBlacklistRequests);
                  vendor.bliststatus = "Requested";
                }
              }
            }
        });
    });
  }

  getAllVendors(){
    this._vednorService.getAllVendors()
      .subscribe(vendors => {
        console.log("list of all vendors:===", vendors);
        this.allVendors = vendors[0].vendors;
        for (let vendor of this.allVendors){
          vendor.bliststatus = "Blacklist";
        }
        console.log("list of vendors to show:===", this.allVendors);
    });
  }

  getAllBlacklistRequests(){
    var userId = localStorage.getItem('userid');
    this._blacklistrequestService.allBlacklistRequests()
      .subscribe(requests => {
        if (!requests[0].status){
          this._router.navigate[('blank')];
        } 
        console.log("All blacklist requests from users:==========", requests[0].requests);
        this.allBlacklistRequests = requests[0].requests;
        for (let request of this.allBlacklistRequests){
          for (let vendor of this.allVendors){
                // console.log("REQUESTED VENDOR", request);
            if (vendor._id === request.vendorId && 
                userId === request.userId && request.status === "pending"){
                console.log("REQUESTED VENDOR", request);
                vendor.bliststatus = "Requested";
            }
          }
        }
    });      
  }

  addBlacklistRequest(vendorId){
    var userId = localStorage.getItem('userid');
    console.log("black list this vendor called:---", vendorId);
    var requestToSave: any;
    this._blacklistrequestService.addBlacklistRequest(vendorId)
      .subscribe(result => {
        if (!result[0].status){
          this._router.navigate[('blank')];
        }
        console.log("RESULT AFTER ADDING THE REQUEST:++++", result[0].result);
        this.getAllBlacklistRequests();
    });
  }

}