import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, 
         Validators, 
         FormGroup, 
         FormControl, 
         FormArray } from '@angular/forms';
import { TenderService } from '../../../services/tender.service'
import { UsersService } from '../../../services/users.service'
import { VendorService } from '../../../services/vendor.service'
import { VendorPreQualiService } from '../../../services/vendorprequalification.service';
import {
    DynamicFormControlModel,
    DynamicCheckboxModel,
    DynamicInputModel,
    DynamicRadioGroupModel,
    DynamicFormService 
} from "@ng2-dynamic-forms/core";
import { Router } from '@angular/router';
import * as moment from "moment";
import { Http, Headers, RequestOptions } from '@angular/http';
import { ModalDirective } from 'ngx-bootstrap/modal/modal.component';
import { GlobalEventsManager } from "../../../services/eventsmanager.service";

@Component({
    selector: 'vendor-prequali',
    providers: [TenderService, 
                UsersService, 
                VendorService, 
                DynamicFormService,
                VendorPreQualiService],
    templateUrl: 'vendorprequali.html',
    styleUrls: ['vendorprequali.css']
})

export class vendorprequali {
  
  @ViewChild('') public editPreQualiModal: ModalDirective;

  allTenders: any = [];
  allPreQualifyTenders: any = [];
  allVendors: any = [];
  tenderId: any;
  vendorId: any;

  selectedTender: any;
  selectedVendor: any;
  preQualiForm: any;
  preQualiProName: string;

  showTenderPreQuali: boolean = false;
  showQualiProfile: boolean = false;
  setQualiProFormBtn: boolean = false;
  setEditQualiProFormBtn: boolean = false;
  showEditQualiPro: boolean = false;
  
  totalRadio = 0;
  totalInput = 0;
  profileTotalMarks = 0;
  profilePassMarks = 0;
  
  vendorTotalInput = 0;
  vendorTotalRadio = 0;
  vendorTotalMarks: any;
  vendorTotalPassFields = 0;
  vandorQualifyStatus: string;

  formGroup: FormGroup;
  formModel: any;
  formJson=[];
  newJson=[];
  inputModelsToSave=[];
  allVendorPreQualiProfiles=[];
  
  newEditJson=[];
  vandorEditQualifyStatus: string;
  editInputModelsToSave=[];
  vendorEditTotalPassFields = 0;

  filterQuery: any = null;
  filterOption: any = null;

  constructor(private _router: Router,
              private http: Http, 
              private _formBuilder: FormBuilder,
              private _dynamicFormService: DynamicFormService,
              private _tenderService: TenderService,
              private _vendorService: VendorService,
              private _vendorPreQualiService: VendorPreQualiService,
              private _eventMangaerService: GlobalEventsManager){
    this._eventMangaerService.showNavBar(true);
  }
  ngOnInit(){
    this.allTenders = [];
    this.allVendors = [];
    this.allVendorPreQualiProfiles=[];
    this._vendorService.getAllVendors()
        .subscribe(vendors => {
            if(!vendors[0].status){
              this._router.navigate(['blank']);
            }
          for (let i=0; i<vendors[0].vendors.length; i++){
            vendors[0].vendors[i].status = "pending";
          }
          this.allVendors = vendors[0].vendors;
          console.log("All Vendors", this.allVendors);
    });
    // this._tenderService.getAllTenders()
    //     .subscribe(tenders => {
    //       if(!tenders[0].status){
    //           this._router.navigate(['blank']);
    //         }
    //       this.allTenders = tenders[0].tenders;
    //         console.log("All Tenders", this.allTenders);
    // });
    this._tenderService.getPreQualifyTenders()
        .subscribe(tenders => {
          if(!tenders[0].status){
              this._router.navigate(['blank']);
            }
          this.allTenders = tenders[0].tenders;
          // this.allPreQualifyTenders = tenders[0].tenders;
          // console.log("All Prequalify Tenders: ", this.allPreQualifyTenders);
    });

    this._vendorPreQualiService.getAllVendorPreQualifications()
        .subscribe(profiles => {
          if(!profiles[0].status){
              this._router.navigate(['blank']);
            }
          this.allVendorPreQualiProfiles = profiles[0].profiles;
          // console.log("All Vendors PRE QUALIFICATION PROFILES", this.allVendorPreQualiProfiles);
    });
  }
  
  changeFilter($event){
    console.log("CHANGE EVENT ON FILTER", $event)
    this.filterOption = $event
  }

  changeFilterTender($event){
    this.filterOption = $event
  }

  hideTenderPreQuali(){
    this.showTenderPreQuali = false;
    this.ngOnInit();
  }

  getPreQualiProfile(tenderId){
    this.tenderId = tenderId;
    console.log("tender to pre qualify: ", tenderId);
    this._tenderService.getQualiProfile(tenderId)
      .subscribe(result => {
        if(!result[0].status){
          this._router.navigate(['blank']);
        }

        console.log("SELEDTEC PROFILE ____", result);
        this.selectedTender = result[0].result[0];
        console.log("Result from aggregate", this.selectedTender);
        var qualiprofileId = this.selectedTender.prequaliprofile[0]._id;
        for (let i=0; i<this.allVendors.length; i++){
          for (let j=0; j<this.allVendorPreQualiProfiles.length; j++){
            if ((this.allVendors[i]._id === this.allVendorPreQualiProfiles[j].vendorId) && 
              (qualiprofileId === this.allVendorPreQualiProfiles[j].qualiprofileId)){
              this.allVendors[i].status = this.allVendorPreQualiProfiles[j].vendorstatus;
              console.log("MATCHED VENDORS...", this.allVendors[i].name);
            }
          }
        }
        console.log(".......ALL VENDORS AGAIN...", this.allVendors);
        this.showTenderPreQuali = true;
    });
  }
  hideQualiProfile(){
    this.showQualiProfile = false;
    this.selectedVendor = null;
    this.getPreQualiProfile(this.tenderId);
    // this._tenderService.getQualiProfile(this.tenderId)
    //     .subscribe(result => {
    //       if(!result[0].status){
    //         this._router.navigate(['blank']);
    //       }
    //       this.selectedTender = result[0].result[0];
    //       // this.showTenderPreQuali = true;
            
    //     console.log("Result from aggregate", this.selectedTender);
    // });

    // console.log("All Vendors PRE QUALIFICATION PROFILES", this.allVendorPreQualiProfiles);
    // var qualiprofileId = this.selectedTender.prequaliprofile[0]._id;
    // for (let i=0; i<this.allVendors.length; i++){
    //   for (let j=0; j<this.allVendorPreQualiProfiles.length; j++){
    //     if ((this.allVendors[i]._id === this.allVendorPreQualiProfiles[j].vendorId) && (qualiprofileId === this.allVendorPreQualiProfiles[j].qualiprofileId)){
    //       this.allVendors[i].status = this.allVendorPreQualiProfiles[j].vendorstatus;
    //       console.log("MATCHED VENDORS...", this.allVendors[i].name);
    //     }
    //   }
    // }
    // console.log(".......ALL VENDORS AGAIN...", this.allVendors);
  }
  showPreQualiProfile(vendorId){
    // get vendor by Id
    this.vendorId = vendorId;
    for (let i=0; i<this.allVendors.length; i++){
      if(this.vendorId === this.allVendors[i]._id){
        this.selectedVendor = this.allVendors[i];
      }
    }
    this.showQualiProfile = true;
    console.log("vendor to pre qualify: ", vendorId);
    console.log("vendor to qualify: ", this.selectedVendor);
    // setting up variables for qualification
    this.formJson = this.selectedTender.prequaliprofile[0].profileschema;
    // console.log("Schema for vednor pre qualification: ", this.formJson);
    this.preQualiProName = this.selectedTender.prequaliprofile[0].profilename;
    this.totalInput = this.selectedTender.prequaliprofile[0].totalweitage;
    this.totalRadio = this.selectedTender.prequaliprofile[0].totalknockdown;
    this.profileTotalMarks = this.selectedTender.prequaliprofile[0].profiletotalmarks;
    this.profilePassMarks = this.selectedTender.prequaliprofile[0].profilepassmarks;
    // building form with profile json schema
    this.formModel = this._dynamicFormService.fromJSON(this.formJson);
    this.formGroup = this._dynamicFormService.createFormGroup(this.formModel);
  }
  formChange($event){
    console.log("FORM VALUES on change: ", this.formGroup.value);
    console.log("Total Profile raDIO: ", this.totalRadio);
    console.log("Total Profile INPUT: ", this.totalInput);
    console.log("Total Profile MARKS: ", this.profileTotalMarks);
    console.log("Total Profile PASS MARKS: ", this.profilePassMarks);
    
    this.setForm();
    // this.formModel = this._dynamicFormService.fromJSON(this.formJson);
  }
  setForm(){
    var formval = this.formGroup.value;
    var vendorTotalYes = 0;
    var vendorTotalNo = 0;
    var vendorTotalMarks = 0;
    var inputJsonModels = [];

    for (var key in formval) {
      if (formval.hasOwnProperty(key)) {
        // console.log(key + " -> " + JSON.stringify(formval[key]));
        var inputModel = this._dynamicFormService.findById(key, this.formModel) as DynamicInputModel;
        // console.log("New Input model ", inputModel);
        // let inputJson: string = JSON.stringify(inputModel);
        // console.log("Model json schema: ", inputJson);
        inputJsonModels.push(inputModel);
        // console.log("Model entered Value: ", inputModel.value);
        // console.log("Model max Value: ", inputModel.max);
        if (formval[key] === "yes"){
          vendorTotalYes = vendorTotalYes + 1;
        }else if(formval[key] === "no"){
          vendorTotalNo = vendorTotalNo + 1;
        }else{
          // console.log('add values <<====>> ', Number(inputModel.value)+Number(inputModel.max))
          if (Number(inputModel.max) < Number(inputModel.value)){
            // console.log("new value: ", inputModel.max);
            // console.log("Greater value entered:--> ", inputModel.value);
            // this.setQualiProFormBtn = false;
            // this.vendorTotalMarks = NaN;
            inputModel.valueUpdates.next(null);
          }
          vendorTotalMarks = vendorTotalMarks + parseInt(formval[key]);
        }  
      }
    }
    this.inputModelsToSave = inputJsonModels
    // console.log("======= Json Schemas of Current Form ========", this.inputModelsToSave);
    this.newJson = this.selectedTender.prequaliprofile[0].profileschema;
    for(let i=0; i<inputJsonModels.length; i++){
      
      for (let j=0; j<this.newJson.length; j++){
        // console.log(inputJsonModels[i].id);
        // console.log(this.newJson[j].id);
        
        if (inputJsonModels[i].id === this.newJson[j].id ){
          this.newJson[j].disabled = true;
          this.newJson[j].value = inputJsonModels[i].value;
          // console.log("Input control Matched:", inputJsonModels[i]);
          // console.log("With Json Array control <++++> ", this.newJson[j]);
        
        }else{
          // console.log("NOT MATCHED");
        }

      }
    }
    console.log("Json Schemas of profile to save/operate: ", this.newJson);
    this.vendorTotalMarks = vendorTotalMarks;
    console.log("TOTAL VENDOR Marks: ", this.vendorTotalMarks);
    console.log("TOTAL VENDOR Yes: ", vendorTotalYes);
    console.log("TOTAL VENDOR No: ", vendorTotalNo);


    for (let i=0; i<this.newJson.length; i++){
      if (this.newJson[i].value === null || this.newJson[i].value === ""){
        this.setQualiProFormBtn = false;
        console.log("======= :SET QUALIFICATION PROFILE FORM BUTTON: ======= ", this.setQualiProFormBtn);
        return 
      }else{
        // console.log("======= :SET QUALIFICATION PROFILE FORM BUTTON: ======= ", this.setQualiProFormBtn);
        this.setQualiProFormBtn = true;
      }  
    }
  }
  saveVendorPreQualiProfile(){
    
    this.setQualiProFormBtn = false;
    console.log("+++++ SAVE VENDOR PRE PROFILE CALLED ++++++");

    for(let i=0; i<this.inputModelsToSave.length; i++){
      
      for (let j=0; j<this.newJson.length; j++){
        // console.log(inputJsonModels[i].id);
        // console.log(this.newJson[j].id);
        if (this.inputModelsToSave[i].id === this.newJson[j].id ){
          this.newJson[j].disabled = true;
          this.newJson[j].value = this.inputModelsToSave[i].value;
          // console.log("Input control Matched:", inputJsonModels[i]);
          // console.log("With Json Array control <++++> ", this.newJson[j]);
        }else{
          // console.log("NOT MATCHED");
        }

      }
    }

    var sum = 0;
    for (let i=0; i<this.newJson.length; i++){
      if (this.newJson[i].value === null){
        this.newJson[i].status = "failed";
        console.log("Failed Input", this.newJson[i], "====" , this.newJson[i].status);
      }
      if (this.newJson[i].value === "yes"){
        this.newJson[i].status = "pass";
        console.log("Passed Radio", this.newJson[i], "====" , this.newJson[i].status);
        sum = sum + 1;
      }
      if(this.newJson[i].value === "no"){
        this.newJson[i].status = "failed";
        console.log("Failed Radio", this.newJson[i], "====" , this.newJson[i].status);
      }
      if(parseInt(this.newJson[i].value) < this.newJson[i].passingmarks){
        this.newJson[i].status = "failed";
        console.log("Failed Input", this.newJson[i], "====" , this.newJson[i].status);
      }
      if(parseInt(this.newJson[i].value) >= this.newJson[i].passingmarks){
        this.newJson[i].status = "pass";
        console.log("Passed Input", this.newJson[i], "====" , this.newJson[i].status);
        sum = sum + 1;
      }
    }

    this.vendorTotalPassFields = sum;


    if ((this.vendorTotalPassFields === (this.totalInput + this.totalRadio))){
      this.vandorQualifyStatus = "qualify"
      console.log("VENDOR QUALIFY");
    }else{
      this.vandorQualifyStatus = "unqualify"
      console.log("NOT QUALIFY");
    }
    console.log("+++++ FORM JSON PROFILES TO SAVE ++++++", this.newJson);
    console.log("VENDOR TOTAL PASS FIELDS: ", this.vendorTotalPassFields);
    console.log("VENDOR TOTAL FIELDS: ", (this.totalInput + this.totalRadio));
    console.log("+++++ VENDOR ID ++++++", this.vendorId);
    console.log("+++++ TENDER ID ++++++", this.tenderId);
    
    // this._vendorPreQualiService.getAll
    var exist = false;
    var qualiprofileId = this.selectedTender.prequaliprofile[0]._id;
    console.log("+++++ QUALI PROFILE ID ++++++", qualiprofileId);
    this.allVendorPreQualiProfiles=[];
    this._vendorPreQualiService.getAllVendorPreQualifications()
        .subscribe(profiles => {
          if(!profiles[0].status){
              this._router.navigate(['blank']);
            }
          this.allVendorPreQualiProfiles = profiles[0].profiles;
          console.log("All Vendors PRE QUALIFICATION PROFILES", this.allVendorPreQualiProfiles);
          for (let j=0; j<this.allVendorPreQualiProfiles.length; j++){
            if ((this.vendorId === this.allVendorPreQualiProfiles[j].vendorId) && 
                (qualiprofileId === this.allVendorPreQualiProfiles[j].qualiprofileId) &&
                (this.tenderId === this.allVendorPreQualiProfiles[j].tenderId)){
              exist = true;
              console.log("ALREADY MARKED...", exist);
            }
          }
          if(exist){
            this.showQualiProfile = false;
            this.preQualiProName = null;
            this._tenderService.getQualiProfile(this.tenderId)
                .subscribe(result => {
                  if(!result[0].status){
                    this._router.navigate(['blank']);
                  }
                  this.selectedTender = result[0].result[0];
                  // this.showTenderPreQuali = true;
                  console.log("Result from aggregate", this.selectedTender);
              this.allVendorPreQualiProfiles=[];
              this._vendorPreQualiService.getAllVendorPreQualifications()
                  .subscribe(profiles => {
                    if(!profiles[0].status){
                        this._router.navigate(['blank']);
                      }
                    this.allVendorPreQualiProfiles = profiles[0].profiles;
                    console.log("All Vendors PRE QUALIFICATION PROFILES", this.allVendorPreQualiProfiles);
                    var qualiprofileId = this.selectedTender.prequaliprofile[0]._id;
                    for (let i=0; i<this.allVendors.length; i++){
                      for (let j=0; j<this.allVendorPreQualiProfiles.length; j++){
                        if ((this.allVendors[i]._id === this.allVendorPreQualiProfiles[j].vendorId) && (qualiprofileId === this.allVendorPreQualiProfiles[j].qualiprofileId)){
                          this.allVendors[i].status = this.allVendorPreQualiProfiles[j].vendorstatus;
                          console.log("MATCHED VENDORS...", this.allVendors[i].name);
                        }
                      }
                    }
                    console.log(".......ALL VENDORS AGAIN...", this.allVendors);
              });
            });

          }else{
            this._vendorPreQualiService.addVendorPreQualifications(this.vendorId, 
                                                                   this.tenderId, 
                                                                   this.newJson,
                                                                   qualiprofileId,
                                                                   this.vandorQualifyStatus)
                .subscribe(result => {
                  console.log("result from adding the vendor qualiprofile...", result);
              this.showQualiProfile = false;
              this.preQualiProName = null;
              this._tenderService.getQualiProfile(this.tenderId)
                  .subscribe(result => {
                    if(!result[0].status){
                      this._router.navigate(['blank']);
                    }
                    this.selectedTender = result[0].result[0];
                    // this.showTenderPreQuali = true;
                    console.log("Result from aggregate", this.selectedTender);
                this.allVendorPreQualiProfiles=[];
                this._vendorPreQualiService.getAllVendorPreQualifications()
                    .subscribe(profiles => {
                      if(!profiles[0].status){
                          this._router.navigate(['blank']);
                        }
                      this.allVendorPreQualiProfiles = profiles[0].profiles;
                      console.log("All Vendors PRE QUALIFICATION PROFILES", this.allVendorPreQualiProfiles);
                      var qualiprofileId = this.selectedTender.prequaliprofile[0]._id;
                      for (let i=0; i<this.allVendors.length; i++){
                        for (let j=0; j<this.allVendorPreQualiProfiles.length; j++){
                          if ((this.allVendors[i]._id === this.allVendorPreQualiProfiles[j].vendorId) && (qualiprofileId === this.allVendorPreQualiProfiles[j].qualiprofileId)){
                            this.allVendors[i].status = this.allVendorPreQualiProfiles[j].vendorstatus;
                            console.log("MATCHED VENDORS...", this.allVendors[i].name);
                          }
                        }
                      }
                      console.log(".......ALL VENDORS AGAIN...", this.allVendors);
                });
              });
            });

          }
    });

  }
  
  editJson: any = [];
  editFormModel: any;
  editFormGroup: FormGroup;

  editPreQualiProfile(vendorId){
    for (let i=0; i<this.allVendors.length; i++){
      if(vendorId === this.allVendors[i]._id){
        this.selectedVendor = this.allVendors[i];
      }
    }
    console.log("vendor to qualify: ", this.selectedVendor);
    console.log("><><><><><>EDIT PROFILE CALLED WITH VENDOR<><><><><>", vendorId);
    var qualiprofileId = this.selectedTender.prequaliprofile[0]._id;
    console.log("><><><><><>PRE QUALI PROFILE ID<><><><><>", qualiprofileId);
    this.preQualiProName = this.selectedTender.prequaliprofile[0].profilename;
    this._vendorPreQualiService.editPreQualiProfile(vendorId, qualiprofileId)
      .subscribe(profile => {
        if(!profile[0].status){
          this._router.navigate(['blank']);
        }
        // this.editJson = profile[0].profiles.profileschema;
        console.log("----------PROFILE TO EDIT---------:", profile[0].profile[0]);
        console.log("----------PROFILE TO EDIT---------:", profile);
        this.editJson = profile[0].profile[0].profileschema;
        for (let i=0; i<this.editJson.length; i++){
          this.editJson[i].disabled = false;
        }
        console.log("*******PROFILE SCHEMA TO EDIT******: ", this.editJson);
        this.editFormModel = this._dynamicFormService.fromJSON(this.editJson);
        this.editFormGroup = this._dynamicFormService.createFormGroup(this.editFormModel);
        this.showEditQualiPro = true;
    });

  }
  editFormChange($event){
        console.log("FORM CHANGE VALUES: ", this.editFormGroup.value);
        var radioCount = 0;
        var inputCount = 0;
        for (let i=0; i<this.editJson.length; i++){
          if (this.editJson[i].criteriatype === "weitage"){
            inputCount = inputCount + 1;
          }else if(this.editJson[i].criteriatype === "knockdown"){
            radioCount = radioCount + 1;
          }
        }
        console.log("*******EDIT SCHEMA RADIOS******: ", radioCount);
        console.log("*******EDIT SCHEMAS INPUTS******: ", inputCount);

        var formval = this.editFormGroup.value;
        var vendorTotalYes = 0;
        var vendorTotalNo = 0;
        var vendorTotalMarks = 0;
        var inputJsonModels = [];

        for (var key in formval) {
          if (formval.hasOwnProperty(key)) {
            // console.log(key + " -> " + JSON.stringify(formval[key]));
            var inputModel = this._dynamicFormService.findById(key, this.editFormModel) as DynamicInputModel;
            console.log("edit Input model ", inputModel);
            // let inputJson: string = JSON.stringify(inputModel);
            // console.log("Model json schema: ", inputJson);
            inputJsonModels.push(inputModel);
            // console.log("Model entered Value: ", inputModel.value);
            // console.log("Model max Value: ", inputModel.max);
            if (formval[key] === "yes"){
              vendorTotalYes = vendorTotalYes + 1;
            }else if(formval[key] === "no"){
              vendorTotalNo = vendorTotalNo + 1;
            }else{
              // console.log('add values <<====>> ', Number(inputModel.value)+Number(inputModel.max))
              if (Number(inputModel.max) < Number(inputModel.value)){
                // console.log("new value: ", inputModel.max);
                // console.log("Greater value entered:--> ", inputModel.value);
                // this.setQualiProFormBtn = false;
                // this.vendorTotalMarks = NaN;
                inputModel.valueUpdates.next(null);
              }
              vendorTotalMarks = vendorTotalMarks + parseInt(formval[key]);
            }  
          }
        }
        this.editInputModelsToSave = inputJsonModels
        console.log("======= Json Schemas of Current Form ========", this.editInputModelsToSave);
        console.log("======= total yes in Schemas of Current Form ========", vendorTotalYes);
        console.log("======= total no in Schemas of Current Form ========", vendorTotalNo);
        this.newEditJson = this.editJson;
        for(let i=0; i<inputJsonModels.length; i++){
          for (let j=0; j<this.newEditJson.length; j++){
            // console.log(inputJsonModels[i].id);
            // console.log(this.newJson[j].id);
            if (inputJsonModels[i].id === this.newEditJson[j].id ){
              // newEditJson[j].disabled = true;
              this.newEditJson[j].value = inputJsonModels[i].value;
              // console.log("Input control Matched:", inputJsonModels[i]);
              // console.log("With Json Array control <++++> ", this.newJson[j]);
            }else{
              // console.log("NOT MATCHED");
            }

          }
        }      
        console.log("======= Edit Json Schema To save ========", this.newEditJson);
        for (let i=0; i<this.newEditJson.length; i++){
          if (this.newEditJson[i].value === null || this.newEditJson[i].value === ""){
            this.setEditQualiProFormBtn = false;
            console.log("======= :SET QUALIFICATION PROFILE FORM BUTTON: ======= ", this.setEditQualiProFormBtn);
            return 
          }else{
            // console.log("======= :SET QUALIFICATION PROFILE FORM BUTTON: ======= ", this.setQualiProFormBtn);
            this.setEditQualiProFormBtn = true;
          }  
        }   

        for(let i=0; i<this.editInputModelsToSave.length; i++){
          for (let j=0; j<this.newEditJson.length; j++){
            // console.log(inputJsonModels[i].id);
            // console.log(this.newJson[j].id);
            if (this.editInputModelsToSave[i].id === this.newEditJson[j].id ){
              this.newEditJson[j].disabled = true;
              this.newEditJson[j].value = this.editInputModelsToSave[i].value;
              // console.log("Input control Matched:", inputJsonModels[i]);
              // console.log("With Json Array control <++++> ", this.newJson[j]);
            }else{
              // console.log("NOT MATCHED");
            }

          }
        }

        var sum = 0;
        for (let i=0; i<this.newEditJson.length; i++){
          if (this.newEditJson[i].value === null){
            this.newEditJson[i].status = "failed";
            console.log("Failed Input", this.newEditJson[i], "====" , this.newEditJson[i].status);
          }
          if (this.newEditJson[i].value === "yes"){
            this.newEditJson[i].status = "pass";
            console.log("Passed Radio", this.newEditJson[i], "====" , this.newEditJson[i].status);
            sum = sum + 1;
          }
          if(this.newEditJson[i].value === "no"){
            this.newEditJson[i].status = "failed";
            console.log("Failed Radio", this.newEditJson[i], "====" , this.newEditJson[i].status);
          }
          if(parseInt(this.newEditJson[i].value) < this.newEditJson[i].passingmarks){
            this.newEditJson[i].status = "failed";
            console.log("Failed Input", this.newEditJson[i], "====" , this.newEditJson[i].status);
          }
          if(parseInt(this.newEditJson[i].value) >= this.newEditJson[i].passingmarks){
            this.newEditJson[i].status = "pass";
            console.log("Passed Input", this.newEditJson[i], "====" , this.newEditJson[i].status);
            sum = sum + 1;
          }
        }

        this.vendorEditTotalPassFields = sum;
        console.log("VENDOR EDIT PROFILE MARKS: ", this.vendorEditTotalPassFields);

        if ((this.vendorEditTotalPassFields === (radioCount + inputCount))){
          this.vandorEditQualifyStatus = "qualify"
          console.log("VENDOR QUALIFY");
        }else{
          this.vandorEditQualifyStatus = "unqualify"
          console.log("NOT QUALIFY");
        }             


  }
  updatePreQualiProfile(){
    var qualiprofileId = this.selectedTender.prequaliprofile[0]._id;
    this._vendorPreQualiService.updatePreQualiProfile(this.selectedVendor._id, 
                                                       this.tenderId, 
                                                       this.newEditJson,
                                                       qualiprofileId,
                                                       this.vandorEditQualifyStatus)
        .subscribe(result => {
          if (result[0].status){
            console.log("RESULT AFTER UPDATE", result[0].result);
          }
        });  
        this.allVendorPreQualiProfiles=[];
        this._vendorPreQualiService.getAllVendorPreQualifications()
            .subscribe(profiles => {
              if(!profiles[0].status){
                  this._router.navigate(['blank']);
                }
              this.allVendorPreQualiProfiles = profiles[0].profiles;
              console.log("All Vendors PRE QUALIFICATION PROFILES", this.allVendorPreQualiProfiles);
              var qualiprofileId = this.selectedTender.prequaliprofile[0]._id;
              for (let i=0; i<this.allVendors.length; i++){
                for (let j=0; j<this.allVendorPreQualiProfiles.length; j++){
                  if ((this.allVendors[i]._id === this.allVendorPreQualiProfiles[j].vendorId) && (qualiprofileId === this.allVendorPreQualiProfiles[j].qualiprofileId)){
                    this.allVendors[i].status = this.allVendorPreQualiProfiles[j].vendorstatus;
                    console.log("MATCHED VENDORS...", this.allVendors[i].name);
                  }
                }
              }
              console.log(".......ALL VENDORS AGAIN...", this.allVendors);
      });
          
  }
  hideEditPreQualiModal(){
    this.showEditQualiPro = false;
    this.preQualiProName = null;
    this.selectedVendor = null;
    this.setEditQualiProFormBtn = false;
    this.getPreQualiProfile(this.tenderId);
  }
}

