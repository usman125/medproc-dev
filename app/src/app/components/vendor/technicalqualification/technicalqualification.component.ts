import {Component, ElementRef} from '@angular/core';
import { LoginService } from '../../../services/login.services';
import { VendorService } from '../../../services/vendor.service';
import { PreQualiServices } from '../../../services/prequalification.service';
import { TechicalQualificationService } from '../../../services/technicalqualification.service';
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import {
    DynamicFormControlModel,
    DynamicCheckboxModel,
    DynamicInputModel,
    DynamicRadioGroupModel,
    DynamicFormService 
} from "@ng2-dynamic-forms/core";
// import {MY_FORM_MODEL} from './my-dynamic-form.model'
import { GlobalEventsManager } from "../../../services/eventsmanager.service";

@Component({
    selector: 'tech-qualification',
    providers: [VendorService, TechicalQualificationService, DynamicFormService],
    templateUrl: 'technicalqualification.html',
    styleUrls: ['technicalqualification.css']
})

export class technicalqualification {
    
  value: any;
  criteriaProfileName: any  = null;
  profileName: any  = null;
  allVendors:any = [];
  criteriaQuestion: any;
  criteriaType: any;

  addTechProfileFlag: boolean = false;
  singleProfileFlag: boolean = false;

  addCriteriaForm: FormGroup;
  formGroup: FormGroup;
  mySchema: any;
  formModel: any;
  json:any = [];
  radioIndex:any = 0;
  inputIndex:any = 0;
  formIndex:any = 1;
  allProfiles: any;
  singleProfile: any;

  constructor(private _router: Router, 
              private _service: TechicalQualificationService,
              private _loginService: LoginService,
              private _formBuilder: FormBuilder,
              private _dynamicFormService: DynamicFormService,
              private _eventMangaerService: GlobalEventsManager){
    this._BuildAddCriteriaForm();
    this._eventMangaerService.showNavBar(true);
  }

  private _BuildAddCriteriaForm(){
    this.addCriteriaForm = this._formBuilder.group({
        name:['', Validators.required],
        type: [1],
        totalmarks: [''],
        passingmarks: ['']
    });
  }
  hideSingleProfile(){
    this.singleProfileFlag = false;
  }
  showTechQualiForm(){
    this.addTechProfileFlag = true;
  }
  hideTechQualiForm(){
    this.addTechProfileFlag = false;
  }

  ngOnInit(){
    this.formModel = this._dynamicFormService.fromJSON(this.json);
    this.formGroup = this._dynamicFormService.createFormGroup(this.formModel);
    this.getAllProfiles();
  }
  getAllProfiles(){
    this.allProfiles = [];
    this._service.getAllProfiles()
        .subscribe(profiles => {
            console.log(profiles);
            if (!profiles[0].status) {
              this._router.navigate(['blank']);
            }
            for (let i=0; i<profiles[0].profiles.length; i++)
                this.allProfiles.push(profiles[0].profiles[i]);
        });
        console.log("ALL PROFILES: ", this.allProfiles);
  }
  getSingleProfile(profileId){
    console.log("PROFILE TO FIND: ", profileId);
    this._service.getSingleProfile(profileId)
        .subscribe(profile => {
            if (!profile[0].status) {
              this._router.navigate(['blank']);
            }
            this.singleProfile = profile[0].profile[0];
            console.log("SINGLE PROFILE BY GET: ", this.singleProfile);
            this.singleProfileFlag = true;
        });
  }
  setbutton($event){
    this.profileName = $event;
    console.log("Profile Name: ", this.profileName.length);
    if($event.length == 0){
        console.log("value got nulled");
        this.profileName = null;
    }
  }
  addCriteria(values){
    this.criteriaQuestion = values.name;
    this.criteriaType = values.type;
    console.log("Criteria caleed with values: ", values);
    if(this.criteriaType == 1){
        this.json.push({
            "cls": {
              "element": {
                "container": "",
                "control": "",
                "errors": "",
                "group": "",
                "hint": "",
                "host": "",
                "label": ""
              },
              "grid": {
                "container": "",
                "control": "",
                "errors": "",
                "group": "",
                "hint": "",
                "host": "",
                "label": ""
              }
            },
            "disabled": false,
            "errorMessages": null,
            "id": "radioGroup"+this.radioIndex,
            "label": this.formIndex+" : "+this.criteriaQuestion,
            "name": "radioGroup"+this.radioIndex,
            "relation": [],
            "asyncValidators": null,
            "hint": null,
            "required": false,
            "tabIndex": null,
            "validators": null,
            "value": "no",
            "options": [
              {
                "disabled": false,
                "label": "Yes",
                "value": "yes"
              },
              {
                "disabled": false,
                "label": "No",
                "value": "no"
              }
            ],
            "type": "RADIO_GROUP",
            "legend": null,
            "criteriatype":"knockdown"
        });
        this.radioIndex++;
        this.formIndex++;
    }else{
        this.json.push({
            "cls": {
              "element": {
                "container": "",
                "control": "",
                "errors": "",
                "group": "",
                "hint": "",
                "host": "",
                "label": ""
              },
              "grid": {
                "container": "",
                "control": "",
                "errors": "",
                "group": "",
                "hint": "",
                "host": "",
                "label": ""
              }
            },
            "disabled": false,
            "errorMessages": null,
            "id": "inputField"+this.inputIndex,
            "label": this.formIndex+" : "+this.criteriaQuestion,
            "name": "inputField"+this.inputIndex,
            "relation": [],
            "asyncValidators": null,
            "hint": "Enter a number<="+values.totalmarks,
            "required": false,
            "tabIndex": null,
            "validators": null,
            "value": null,
            "autoComplete": "on",
            "autoFocus": false,
            "placeholder": "example input",
            "prefix": null,
            "readOnly": false,
            "spellCheck": false,
            "suffix": null,
            "type": "INPUT",
            "accept": null,
            "inputType": "text",
            "list": null,
            "mask": null,
            "max": values.totalmarks,
            "min": values.passingmarks,
            "multiple": null,
            "pattern": null,
            "step": null,
            "totalmarks":values.totalmarks,
            "passingmarks":values.passingmarks,
            "criteriatype":"weitage"
        });
        this.inputIndex++;
        this.formIndex++;
    }
    this.criteriaProfileName = this.profileName;
    this._BuildAddCriteriaForm();
    console.log("JSON FOR TECHNICAL QUALIFICATION: ", this.json);
    this.ngOnInit();
  }
  addTechQualiProfile(){
    var countRadio = 0;
    var countInput = 0;
    var countTotalMarks = 0;
    var countPassMarks = 0;
    
    for (let i=0; i<this.json.length; i++){
      if (this.json[i].criteriatype == "knockdown"){
        countRadio = countRadio + 1;
      }else{
        countInput = countInput + 1;
        countTotalMarks = countTotalMarks + parseInt(this.json[i].totalmarks);
        countPassMarks = countPassMarks + parseInt(this.json[i].passingmarks);
      }
    }

    var newProfile = {"profilename":this.profileName,
                      "profileschema":this.json,
                      "profiletotalmarks":countTotalMarks,
                      "profilepassmarks":countPassMarks,
                      "totalknockdown":countRadio,
                      "totalweitage":countInput};
    console.log("Profile Object To Save", newProfile);
    console.log("TOTAL KNOWCKDOWN COUNT: ", countRadio, 
                "-- Total WEITAGE COUNT: ", countInput,
                "-- Total Marks: ", countTotalMarks,
                "-- Passing Marks: ", countPassMarks);
    this._service.addTechQualiProfile(newProfile)
        .subscribe(result => {
            console.log("RESULT FROM ADD Technical QUALI PROFILE: ", result);
            if (!result[0].status) {
              this._router.navigate(['blank']);
            }
            this.inputIndex = 0;
            this.radioIndex = 0;
            this.formIndex = 1;
            this.json = [];
            this.profileName = null;
            this.criteriaProfileName = null;
            this.ngOnInit();
        });
  }
  // formChange($event){
  //   console.log("Form CHanged: ", this.formGroup.value);
  //   // let json: string = JSON.stringify(this.formModel);
  //   console.log("JSON SCHEMA OF FORM: ", this.json);
  // }

}