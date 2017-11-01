import {Component, ElementRef} from '@angular/core';
import {LoginService} from '../../services/login.services';
import {VendorService} from '../../services/vendor.service';
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalEventsManager } from "../../services/eventsmanager.service";

@Component({
    selector: 'vendors',
    providers: [VendorService],
    templateUrl: 'vendor.html',
    styleUrls: ['vendor.css']
})

export class vendor {

    allVendors:any = [];
    vendorFormFlag: boolean = false;
    addVendorForm: FormGroup;

    filterQuery:any = null;
    filterOption:any = null;

    constructor(private _router: Router, 
                private _service: VendorService,
                private _loginService: LoginService,
                private _formBuilder: FormBuilder,
                private _eventMangaerService: GlobalEventsManager){
      this.getAllVendors();
      this._buildAddVendorForm();
      this._eventMangaerService.showNavBar(true);
    }
    _buildAddVendorForm(){
        this.addVendorForm = this._formBuilder.group({
          name: ["", Validators.compose([Validators.required, Validators.minLength(3)])],
          address: ["", Validators.required],
          city: ["", Validators.required],
          phonenumber: ["", Validators.required],
          email: ["", Validators.required],
          website: ["", Validators.required],
          dateofestablishment: ["", Validators.required],
          businesstype: ["", Validators.required],
          focalpersonname: ["", Validators.required],
          focalpersonnumber: ["", Validators.required]
        });
    }
    
    changeFilter(event){
      this.filterOption = event;
    }

    getAllVendors(){
      console.log("get all vendors called",);
      this._service.getAllVendors()
          .subscribe(vendors => {
            if (!vendors[0].status){
              this._router.navigate(['blank']);
            }
            this.allVendors = vendors[0].vendors;
            console.log("ALL VENDORS: ",vendors);
      });
    }
    addVendor(vendor, $event){
      console.log("Vendor form values: ", vendor);
      this._service.addVendor(vendor)
        .subscribe(result => {
          console.log("RESULT ADD VENDOR: ", result);
          if (!result[0].status){
            this._router.navigate(['blank']);
          }
          this.hideVendorForm();
          this._buildAddVendorForm();
          this.getAllVendors();
      });
      
    }
    showVendorForm(){
        this.vendorFormFlag = true;
    }
    hideVendorForm(){
        // this._buildAddUserForm();
        this.vendorFormFlag = false;
    }
    // ********** Routing Fucntions **********//
    logout(){
        this._loginService.logout();
    }
    goToRoute(name){
      this._router.navigate([name]);
    }

}