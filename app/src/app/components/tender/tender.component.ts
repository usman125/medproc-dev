import { Component, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { LoginService } from '../../services/login.services'
import { TenderService } from '../../services/tender.service'
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
import { Subscription } from 'rxjs';

@Component({
    selector: 'tenders',
    providers: [TenderService, 
                AttachmentService, 
                DemandService, 
                ConfigsService, 
                TechicalQualificationService, 
                PreQualiServices],
    templateUrl: 'tender.html',
    styleUrls: ['tender.css']
})

export class tender {

    filterQuery:any = null;
    filterOption:any = null;

    preQualiDropdownList:any = [];
    selectedPreQualiItems:any = [];
    
    techQualiDropdownList:any = [];


    departmentDropdownList:any = [];
    selectedDepartmentItems:any = [];
    dropdownSettings:any = {};

    allTenders:any = [];
    allDepartments:any = [];
    allPreQualiProfiles:any = [];
    userRole:any = '';
    allDemands:any = []
    demStatus:any = []

    tenderFormFlag: boolean = false;
    imageUploading: boolean = false;
    imageUploadingTender: boolean = false;
    fileReferenceNews: string = null;
    fileReferenceTender: string = null;
    addTenderForm: FormGroup;

    emergency:any;
    prequalify:any;

    busytenders: Subscription;

    public fiscalYearStart = moment().format('YYYY');
    public fiscalYearEnd = moment().add(1, 'years').format('YYYY');
    public fiscalYear = this.fiscalYearStart+"-"+this.fiscalYearEnd;

    constructor(private _router: Router, 
                private _service: TenderService,
                private _demandService: DemandService,
                private _loginService: LoginService,
                private _location: Location,
                private _configsService: ConfigsService,
                private _prequaliService: PreQualiServices,
                private _techqualiService: TechicalQualificationService,
                private _attachmentService: AttachmentService,
                private _formBuilder: FormBuilder,
                private _eventMangaerService: GlobalEventsManager){

      this._eventMangaerService.showNavBar(true);
      this.getAllTenders();
      this.showDepartmentDropdown();
      this.showPreQualiDropdown();
      this.showTechQualiDropdown();
      this._buildAddTenderForm();
      this.setUserRole();
      this.getAllDemands();

    }
    ngOnInit(){
      console.log("TENDER ONINIT ROLE",localStorage.getItem('userrole'))
      console.log("Fisal Year Start:----", this.fiscalYearStart);
      console.log("Fisal Year End:----", this.fiscalYearEnd);
      console.log("Fisal Year :----", this.fiscalYear);
    }
    changeFilter(event){
      this.filterOption = event;
    }
    lockTender(tender){
      this._service.lockTender(tender._id)
        .subscribe(tender =>{
          console.log("Locked tender",tender)
          this.getAllTenders();
        });
    }
    acceptOrRejectCall(i){
      let demState = this.demStatus[i]
      let tenderId = this.allTenders[i]._id
      this._demandService.updateTenderDemandStatus(tenderId,demState)
        .subscribe(demands =>{
          console.log("Dem Status Resp",demands)
        });
    }
    acceptOrReject(dep,i){
      if (!dep) {
        this.demStatus[i] = 1
        this.acceptOrRejectCall(i);
      } else  {
        this.demStatus[i] = 0
        this.acceptOrRejectCall(i);
      }
      console.log("Checkbox->",this.demStatus);
    }
    setDemStatus(){
      for (let i=0;i<this.allDemands.length;i++){
        this.demStatus[i] = 0;
      }
    }
    setCheckboxes(){
      for (let i=0;i<this.allTenders.length;i++){
        let anyUncheck = false, firstkey = true
        for (let j=0;j<this.allDemands.length;j++){
          this.demStatus[i] = 0
          if (this.allTenders[i]._id === this.allDemands[j].tenderref 
              && this.allDemands[j].demandstatus === "0"){
            anyUncheck = true
            firstkey = false
            console.log("tender status",this.allDemands[j].demandstatus)
          }
          if (this.allTenders[i]._id === this.allDemands[j].tenderref 
              && this.allDemands[j].demandstatus === "1"){
            firstkey = false
          }
        }
        if (!anyUncheck && !firstkey){
          this.demStatus[i] = 1
        }
      }
    }
    
    getAllDemands(){
      this._demandService.getAllDemands()
        .subscribe(demands => {
          this.allDemands = demands[0].demands
          this.setCheckboxes()
        })
    }

    setUserRole(){
      this.userRole = localStorage.getItem("userrole");
    }

    showDepartmentDropdown(){
      this._configsService.getAllDepartments()
        .subscribe(departments => {
          console.log("all departments: ", departments)
          this.allDepartments = departments[0].departments;
          if (!departments[0].status){
            this.allDepartments = [];
          }
          console.log("ALL DEPARTMENTS: ", this.allDepartments);

          for (let i=0; i<this.allDepartments.length; i++){
            var department = {"id":this.allDepartments[i]._id, 
                              "itemName":this.allDepartments[i].name}
            this.departmentDropdownList.push(department);
          }
          this.dropdownSettings = {singleSelection: false, text:"Select Departments", enableSearchFilter: true};
          console.log("ALL DROPDOWNS DEPARTMENTS: ", this.departmentDropdownList);
      });
    }    
    
    showPreQualiDropdown(){
      this._prequaliService.getAllProfiles()
        .subscribe(profiles => {
          console.log("ALL Pre Quali Profiles: ", profiles[0].profiles);
          for (let i=0; i<profiles[0].profiles.length; i++){
            this.preQualiDropdownList.push(profiles[0].profiles[i]);
          }
          console.log("All Pre Quali dropdowns: ", this.preQualiDropdownList);
      });
    }

    showTechQualiDropdown(){
      this._techqualiService.getAllProfiles()
        .subscribe(profiles => {
          console.log("ALL Technical Quali Profiles: ", profiles[0].profiles);
          for (let i=0; i<profiles[0].profiles.length; i++){
            this.techQualiDropdownList.push(profiles[0].profiles[i]);
          }
          console.log("All Tech Quali dropdown: ", this.techQualiDropdownList);
      });
    }

    _buildAddTenderForm(){

        this.addTenderForm = this._formBuilder.group({
          name: ["", Validators.compose([Validators.required, Validators.minLength(3)])],
          fiscalyear: [{'value':this.fiscalYear, 'disabled':true}, Validators.compose([Validators.required])],
          tenderdate: ["", Validators.compose([Validators.required])],
          demanddateto: ["", Validators.compose([Validators.required])],
          demanddatefrom: ["", Validators.compose([Validators.required])],
          advdate: ["", Validators.compose([Validators.required])],
          department: ["", Validators.compose([Validators.required])],
          prequaliprofile: ["", Validators.compose([Validators.required])],
          techqualiprofile: ["", Validators.compose([Validators.required])],
          pubinnews: [false],
          pubinppra: [false],
          prequalification: ["", Validators.compose([Validators.required])]
          // ,
          // emergancy: [false]
        });
        
          // console.log("Pre qualification value: ------", this.addTenderForm['prequalification'].value);
      //   this.addTenderForm.valueChanges.subscribe(newValues => {
      //       // disable the button if new value matches initial value
      //       // this.disableSaveBtn = this.valuesMatch(newValues, initValues)
      //     console.log("form changed called: ------", newValues);
      //     if (newValues.prequalification === "emergency"){
      //   // (<FormGroup>this.addTenderForm).setValue({}, { onlySelf: true });
      //   // this.addTenderForm.get('prequaliprofile').setValue("none");
      //   // this.addTenderForm.get('techqualiprofile').setMust supply a value for form control with name: 'name'.Value("none");
      //   this.addTenderForm.patchValue({
      //     "prequaliprofile": "none", 
      //     "techqualiprofile": "none"
      //   });
      // }
          // this.setProfilesOption(newValues);
        // });
    }

    getAllTenders(){
      console.log("get all tenders called", this.allTenders);
      this.busytenders = this._service.getAllTenders()
          .subscribe(tenders => {
            if(!tenders[0].status){
              this._router.navigate(['blank']);
            }
            this.allTenders = tenders[0].tenders;
            console.log("ALL TENDERS: ", this.allTenders);
      });
    }
    fileChangeNews(event){
      this.imageUploading = true;
      let files = event.target.files;
      if (files.length > 0) {

        var formData: FormData = new FormData();
        let file = files[0];
        formData.append('uploadFile', file, file.name);
        /** No need to include Content-Type in Angular 4 */
        this.postNewsFileService(formData);
      }
    }
    postNewsFileService(file) {
      this._attachmentService.addAttachment(file)
        .subscribe(result => {
          console.log("Result from uploading medicine image", result);
          this.fileReferenceNews = result.FileReference;
          this.imageUploading = false;
        })
    }
    fileChangeTender(event){
      this.imageUploadingTender = true;
      let files = event.target.files;
      if (files.length > 0) {

        var formData: FormData = new FormData();
        let file = files[0];
        formData.append('uploadFile', file, file.name);
        /** No need to include Content-Type in Angular 4 */
        this.postTenderFileService(formData);
      }
    }
    postTenderFileService(file) {
      this._attachmentService.addAttachment(file)
        .subscribe(result => {
          console.log("Result from uploading medicine image", result);

          this.fileReferenceTender = result.FileReference;
          this.imageUploadingTender = false;
        })
    }
    addTender(tender, $event){
      tender.filefornews = this.fileReferenceNews;
      tender.filefortender = this.fileReferenceTender;
      console.log("Tender form values: ", tender);
      if (tender.advDate < tender.demandDate){
        console.log("Lesss Items");
      }
      var departments = [];
      for (let i=0; i<tender.department.length; i++){
      var newDep = {"_id":tender.department[i].id,
                    "name":tender.department[i].itemName};
                    departments.push(newDep);
      }
      tender.department = departments;
      tender.fiscalyear = this.fiscalYear;
      
      console.log("TENDER AFTER DEP: ", tender);
      this._service.addTender(tender)
        .subscribe(result => {
          console.log("RESULT ROM ADD TENDER: ", result);
          if (!result[0].status) {
            this._router.navigate(['blank']);
          }
          this.hideTenderForm();
          this._buildAddTenderForm();
          this.getAllTenders();
      });
    }
    setProfilesOption(){
      // console.log("EMEREGNECY CHANGE 2 ___: ", this.addTenderForm.controls['prequalification'].value);
      // console.log("EMEREGNECY CHANGE 2 ___: ", this.addTenderForm.controls['techqualiprofile'].value);
      // console.log("EMEREGNECY CHANGE 2 ___: ", this.addTenderForm.controls['prequaliprofile'].value);
      if (this.addTenderForm.controls['prequalification'].value === "emergency"){
        this.addTenderForm.patchValue({
          "prequaliprofile": "123245678901", 
          "techqualiprofile": "123245678901"
        });
      } else if (this.addTenderForm.controls['prequalification'].value === "prequalify"){
        this.addTenderForm.patchValue({
          "prequaliprofile": "", 
          "techqualiprofile": ""
        });
      }
    }     
    onItemSelect(item){
        console.log('Selected Item:');
        console.log(item);
    }
    OnItemDeSelect(item){
        console.log('De-Selected Item:');
        console.log(item);
    }


    editTender(tenderId){
      console.log("TENDER ID: ", tenderId);
      // this._service.editTender(tenderId)
      //   .subscribe(result => {
      //     console.log("RESULR FROM EDIT :", result);
      //     this.getAllTenders();
      //   })
      this._router.navigate(['edittender', tenderId])
    }

    showTenderForm(){
        // this.showDepartmentDropdown();
        this.tenderFormFlag = true;
    }
    hideTenderForm(){
        this._buildAddTenderForm();
        this.selectedDepartmentItems = [];
        this.tenderFormFlag = false;
    }
    // ********** Routing Fucntions **********//
    logout(){
        this._loginService.logout();
    }
    goToRoute(name){
      this._router.navigate([name]);
    }

}