import {Component, ElementRef, ViewChild} from '@angular/core';
import {LoginService} from '../../services/login.services'
import {TenderService} from '../../services/tender.service'
import {ConfigsService} from '../../services/configs.service'
import {VendorService} from '../../services/vendor.service'
import {BlacklistvendorService} from '../../services/blacklistvendor.service'
import {BlacklistRequestService} from '../../services/blacklistrequest.service'
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { Tender } from '../../models/tender';
import * as moment from "moment";
import { ModalDirective } from 'ngx-bootstrap/modal/modal.component';
import { GlobalEventsManager } from "../../services/eventsmanager.service";

@Component({
    selector: 'blacklistvendor',
    providers: [TenderService, 
                ConfigsService, 
                VendorService, 
                BlacklistRequestService, 
                BlacklistvendorService],
    templateUrl: 'blacklistvendor.html',
    styleUrls: ['blacklistvendor.css']
})

export class blacklistvendor {
    
    filterQuery: any;
    totalVendors: any = [];
    allRequests: any = [];
    allVendors: any = [];
    allBlacklistRequests: any = [];

    statBlock: boolean = false;
    vendorContracts: any = [];
    selectedVendor: any = null;
    requestUsers: any = null;
    datoToBlacklist: any = null;
    vendorBlacklistCount: any = null;


    constructor(private _router: Router, 
                private _loginService: LoginService,
                private _formBuilder: FormBuilder,
                private _service: ConfigsService,
                private _vednorService: VendorService,
                private _blacklistvendorService: BlacklistvendorService,
                private _blacklistrequestService: BlacklistRequestService,
                private _eventMangaerService: GlobalEventsManager){
        this._eventMangaerService.showNavBar(true);
    }

    ngOnInit(){
        this._blacklistvendorService.allBlacklistRequests()
            .subscribe(requests => {
                if (!requests[0].status){
                    this._router.navigate[('blank')];
                } 
                console.log("All blacklist requests from users:==========", requests[0].requests);
                if (requests[0].requests) {
                    this.allVendors = requests[0].requests.vendors;
                }
                // for (let vendor of this.allVendors){
                //     if(vendor.status === "blcklisted"){
                //         console.log("VENDOR ALREADY BLACKLISTED");
                //     }
                // }
                        console.log("VENDOR ALREADY BLACKLISTED", this.allVendors);
                            for (let vendor of this.allVendors){
                                vendor.bliststatus = "pending"
                            }
                this._blacklistvendorService.allBlacklistedVendors()
                    .subscribe(vendors => {
                            var blacklist: any = [];
                            console.log("BLACKLISRED VENDORS ((((()))))", vendors[0].vendors);
                            if (vendors[0].vendors.length){
                                blacklist = vendors[0].vendors[0].vendors;
                            }
                            for (let vendor of this.allVendors){
                                for (let blacklisted of blacklist){
                                    if (vendor._id === blacklisted._id){
                                        vendor.bliststatus = "blacklisted"

                                    }
                                }
                            }
                        console.log("ALL VENDORS AFTER LOOP__________", this.allVendors);
                    });
        });
    }

    getVendorStats(vendorId){
      console.log("Vendor to approve:_____+++:", vendorId);
      this._blacklistvendorService.getVendorStats(vendorId)
          .subscribe(stats => {
              console.log("STATS OF VENDORS:-------", stats[0].stats);
              this.requestUsers = [];    
              for (let user of stats[0].stats){
                  this.requestUsers.push(user.userinfo[0]);
              }
              console.log("USER WHO SEND REQUESTS FOR THAT VENDOR:-------", this.requestUsers);
              this.vendorContracts = stats[0].stats[0].contractsinfo.length;
              this.selectedVendor = stats[0].stats[0].vendorinfo[0];
              this.vendorBlacklistCount = stats[0].stats[0].blistcount;
              this.statBlock = true;
          });
    }
    approveBlacklist(vendorId){
        console.log("VENDOR TO CONFIRM BLACKLIST:--------", vendorId, this.datoToBlacklist);
        this._blacklistvendorService.approveBlacklist(vendorId, this.datoToBlacklist, parseInt(this.vendorBlacklistCount)+1)
            .subscribe(result => {
                console.log("RESUULT AFTER BLACLIST UPATEDING:________+++", result);
                        this._vednorService.updateActiveStatus(vendorId, this.datoToBlacklist)
                            .subscribe(result => {
                                console.log("RESULT AFTER PDATING VENDOR ORGINIAL: ___", result);
                                this.statBlock = false;
                                this.datoToBlacklist = null;
                                this._blacklistvendorService.allBlacklistedVendors()
                                    .subscribe(vendors => {
                                            var blacklist: any = [];
                                            console.log("BLACKLISRED VENDORS ((((()))))", vendors[0].vendors);
                                            if (vendors[0].vendors.length){
                                                blacklist = vendors[0].vendors[0].vendors;
                                            }
                                            for (let vendor of this.allVendors){
                                                for (let blacklisted of blacklist){
                                                    if (vendor._id === blacklisted._id){
                                                        vendor.bliststatus = "blacklisted"

                                                    }
                                                }
                                            }
                                        console.log("ALL VENDORS AFTER LOOP__________", this.allVendors);
                                    });               
                        });
            });
    }
    showBlacklistedVendor(){

    }
    hideStatBlock(){
        this.statBlock = false;
        this.datoToBlacklist = null;
    }

}