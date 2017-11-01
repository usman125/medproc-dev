import { Component, ElementRef, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.services'
import { MedicineService } from '../../services/medicine.service'
import { AttachmentService } from '../../services/attachment.service';
import { ConfigsService } from '../../services/configs.service';
import { Subscription } from 'rxjs'
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from "moment";
import {Http, Headers, RequestOptions} from '@angular/http';
import { GlobalEventsManager } from "../../services/eventsmanager.service";

@Component({
    selector: 'medicines',
    providers: [MedicineService, AttachmentService],
    templateUrl: 'medicine.html',
    styleUrls: ['medicine.css']
})

export class medicine {

    allMedicines:any = [];
    allDepartments:any = [];
    allConfigs:any = [];
    
    allMediTypes:any = [];
    allMediUnits:any = [];
    allMediSize:any = [];

    medicineFormFlag: boolean = false;
    imageUploading: boolean = false;
    addMedicineForm: FormGroup;
    fileReference: string;

    busyMeds: Subscription;

    filterQuery: any = null
    filterOption: any = null

    constructor(private _router: Router,
                private http: Http, 
                private _service: MedicineService,
                private _loginService: LoginService,
                private _attachmentService: AttachmentService,
                private _formBuilder: FormBuilder,
                private _configsService: ConfigsService,
                private _eventMangaerService: GlobalEventsManager){
      this.getAllMedicines();
      this._buildAddMedicineForm();
      this.getAllConfigs();
      this.getAllDepartments();
      this._eventMangaerService.showNavBar(true);
    }
    _buildAddMedicineForm(){
        this.addMedicineForm = this._formBuilder.group({
          department: ["", Validators.compose([Validators.required])],
          name: ["", Validators.compose([Validators.required, Validators.minLength(3)])],
          mediunit: ["", Validators.compose([Validators.required])],
          medisize: ["", Validators.compose([Validators.required])],
          meditype: ["", Validators.compose([Validators.required])],
          // dosage: ["", Validators.compose([Validators.required])],
          // medigenre: [""],
          sgtdquantity: ["", Validators.compose([Validators.required])],
          estprice: ["", Validators.compose([Validators.required])]
          // chemicalname: ["", Validators.compose([Validators.required])]
        });
    }

    ngOnInit(){
      this._configsService.getAllMediType()
        .subscribe(meditype => {
          if (!meditype[0].status){
            this.allMediTypes = [];
          }
          this.allMediTypes = meditype[0].meditypes;
          console.log("ALL EDI TYPES: ", this.allMediTypes);
        });
      this._configsService.getAllMediUnit()
        .subscribe(mediunit => {
          if (!mediunit[0].status){
            this.allMediTypes = [];
          }
          this.allMediUnits = mediunit[0].mediunit;
          console.log("ALL EDI Units: ", this.allMediUnits);
        });
      this._configsService.getAllMediMesUnit()
        .subscribe(medimesunit => {
          if (!medimesunit[0].status){
            this.allMediTypes = [];
          }
          this.allMediSize = medimesunit[0].medimesunit;
          console.log("ALL EDI SizeS: ", this.allMediSize);
        });
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
    getAllDepartments(){
      this._configsService.getAllDepartments()
          .subscribe(departments => {
            if (departments[0].status){
              this.allDepartments = departments[0].departments;
            }
          });
          console.log("LIst of all departments: ", this.allDepartments);
    }
    getAllConfigs(){
      this._configsService.allConfigs()
        .subscribe(configs => {
            console.log("ALL CONFIGS--->>", configs);
            if (!configs[0].status){
              this._router.navigate(['blank']);
            }
            this.allConfigs = configs[0].configs
        })
    }
    postFileService(file) {
      this._attachmentService.addAttachment(file)
        .subscribe(result => {
          console.log("Result from uploading medicine image", result);
          this.fileReference = result.FileReference;
          this.imageUploading = false;
        })
    }
    
    getAllMedicines(){
      console.log("get all medicines called", this.allMedicines);
      this.busyMeds = this._service.getAllMedicines()
          .subscribe(medicines => {
            if (!medicines[0].status){
              this._router.navigate(['blank']);
            }
            this.allMedicines = medicines[0].medicines;
            console.log("ALL Medicines: ", this.allMedicines);
      });
    }
    addMedicine(medicine, $event){
      console.log("Medicine form values: ", medicine);
      medicine.filereference = this.fileReference;
      console.log("File Reference-->",this.fileReference);
      console.log("Medicine File Reference-->",medicine.fileReference);
      this._service.addMedicine(medicine)
        .subscribe(result => {
          console.log("RESULT ROM ADD Medicine: ", result);
          if (!result[0].status) {
            this._router.navigate(['blank']);
          }
          this.hideMedicineForm();
          this._buildAddMedicineForm();
          this.getAllMedicines();
      });
      
    }
    changeFilter(event){
      this.filterOption = event;
    }
    showMedicineForm(){
        this.medicineFormFlag = true;
    }
    hideMedicineForm(){
        // this._buildAddUserForm();
        this.medicineFormFlag = false;
    }
    // ********** Routing Fucntions **********//
    logout(){
        this._loginService.logout();
    }
    goToRoute(name){
      this._router.navigate([name]);
    }

}