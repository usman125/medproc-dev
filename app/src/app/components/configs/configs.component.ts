import {Component, ElementRef, ViewChild} from '@angular/core';
import {LoginService} from '../../services/login.services'
import {TenderService} from '../../services/tender.service'
import {ConfigsService} from '../../services/configs.service'
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { Tender } from '../../models/tender';
import * as moment from "moment";
import { ModalDirective } from 'ngx-bootstrap/modal/modal.component';
import { GlobalEventsManager } from "../../services/eventsmanager.service";

@Component({
    selector: 'configs',
    providers: [TenderService, ConfigsService],
    templateUrl: 'configs.html',
    styleUrls: ['configs.css']
})

export class configs {
    
    @ViewChild('editDepModal') public editDepModal: ModalDirective;
    @ViewChild('editTehsilModal') public editTehsilModal: ModalDirective;
    @ViewChild('editFacilTypeModal') public editFacilTypeModal: ModalDirective;
    @ViewChild('editMediTypeModal') public editMediTypeModal: ModalDirective;
    @ViewChild('editMediUnitModal') public editMediUnitModal: ModalDirective;
    @ViewChild('editFacilityModal') public editFacilityModal: ModalDirective;
    @ViewChild('editMediMesUnitModal') public editMediMesUnitModal: ModalDirective;

    allConfigs: any = [];
    allDistricts: any = [];
    allTehsils: any = [];
    allZones: any = [];
    allDepartments: any = [];
    allMediType: any = [];
    allMediUnit: any = [];
    allMediMesUnit: any = [];

    selected: string = null;
    public filterQuery = "";
    
    newDepForm: FormGroup;
    newConfigForm: FormGroup;
    editConfigForm: FormGroup;
    addDistrictForm: FormGroup;
    addTehsilForm: FormGroup;
    
    showEditForm: boolean = false;
    editConfigId: any;
    itemId: any;

    zoneDropdownList = [];
    selectedZoneItems = [];
    zoneDropdownSettings = {};
    
    constructor(private _router: Router, 
                private _loginService: LoginService,
                private _formBuilder: FormBuilder,
                private _service: ConfigsService,
                private _eventMangaerService: GlobalEventsManager){
      
      this._buildAllForms();
      this._eventMangaerService.showNavBar(true);
      this.zoneDropdownSettings = {singleSelection: true, text:"Select Zone", enableSearchFilter: true};
    }
    
    private _buildAllForms(){

      this._buildNewConfigForm();
      this._buildEditConfigForm();
      this._buildAddDistrictForm();
      this._buildAddTehsilForm();
    
    }
    // ******* Department Configs Forms ********* //

    private _buildAddDistrictForm(){
      this.addDistrictForm = this._formBuilder.group({
        name: ["", Validators.required],
        zone: ["", Validators.required]
      });
      // this.zonesDropDown();
    }
    private _buildAddTehsilForm(){
      this.addTehsilForm = this._formBuilder.group({
        name: ["", Validators.required],
        district: ["", Validators.required]
      });
      // this.zonesDropDown();
    }

    private _buildNewConfigForm(){
      this.newConfigForm = this._formBuilder.group({
        name: ["", Validators.required]
      });
    }
    private _buildEditConfigForm(){
      this.editConfigForm = this._formBuilder.group({
        name: ["", Validators.required]
      });
    }
    ngOnInit(){
      this.getAllConfigs();
      this.getAllDistricts();
      this.getAllZones();
      this.getAllTehsils();
      this.getAllDepartments();
      this.getAllMediType();
      this.getAllMediUnit();
      this.getAllMediMesUnit();
    }

    //*********** ALL ZONES **********//
    getAllZones(){
      this._service.getAllZones()
        .subscribe(zones => {
          if (!zones[0].status){
            this._router.navigate(['blank']);
          }
          this.allZones = zones[0].zones
          // console.log("====== ALL Zones FROM RESULT: ", zones[0].zones);
          console.log("====== ALL Zones TO SHOW: ", this.allZones);
          // this.zonesDropDown();
      });
    }
    // zonesDropDown(){
    //   for (let i=0; i<this.allZones.length; i++){
    //     var zone = {"id":this.allZones[i]._id, 
    //                       "itemName":this.allZones[i].name}
    //   console.log("====== Single ZOne: ", zone);
    //     this.zoneDropdownList.push(zone);
    //   } 
    //   console.log("====== ALL Zones Dropdown: ", this.zoneDropdownList);
    // }
    // ********* DISTRICTS **********//
    getAllDistricts(){
      this.allDistricts = [];
      this._service.getAllDistricts()
        .subscribe(districts => {
          if (!districts[0].status){
            this._router.navigate(['blank']);
          }
          this.allDistricts = districts[0].districts
          console.log("====== ALL DISTRICTS FROM RESULT: ", districts[0].districts);
          console.log("====== ALL DISTRICTS TO SHOW: ", this.allDistricts);

          // for (let i=0; i<this.allDistricts.length; i++){
          //   var district = {"id":this.allDistricts[i]._id, 
          //                     "itemName":this.allDistricts[i].name}
          //   this.districtsDropdownList.push(district);
          //   this.districtsDropdownSettings = {};
          // } 
        });
    }
    addDistrict(values, $event){
      console.log("Values from Add District Form submit: ", values);
      var newDistrict = {name: values.name, 
                         zone: values.zone}
                         
      console.log("NEW DISTRICT TO ADD: ", newDistrict);
      this._service.addDistrict(newDistrict)
        .subscribe(result => {
          if(!result[0].status){
            this._router.navigate(['blank']);
          }
          console.log("Results From adding the district: ", result[0].result);
          this._buildAddDistrictForm();
          this.getAllDistricts();
      });
    }

    //*********** Department **********//
    addNewDep(newDep, $event){
      $event.preventDefault();
      newDep = newDep.name;
      console.log("New Departmet name: ", newDep);
      this._service.addDepartment(newDep)
        .subscribe(result => {
          if (!result[0].status){
            this._router.navigate(['blank']);
          }
          console.log("Result from new Depatment: ", result);
          this._buildNewConfigForm();
          this.getAllDepartments();
        });
    }
    showEditDepModal(name, itemId, configId){
      console.log("show MOdel called with parameters: ", name, itemId, configId);
      this.editDepModal.show();

      (<FormGroup>this.editConfigForm).setValue({'name':name}, { onlySelf: true });
      this.itemId = itemId;
      this.editConfigId = configId;
    }
    hideEditDepModal(){
      this.editDepModal.hide();
    }
    editDepartment(values){
      console.log("save values from edit mdoel: ", values)
      console.log("Edit Department called : ", values.name, this.itemId, this.editConfigId);
      this._service.editDepartment(values.name, this.itemId, this.editConfigId)
        .subscribe(result => {
          console.log("Slected department : ", result);
          if (!result[0].status){
            this._router.navigate(['blank']);
          }
          this.itemId = "";
          this.editConfigId = "";
          this._buildEditConfigForm();
          this.getAllDepartments();
      });
    }
    getAllDepartments(){
      this.allDepartments = [];
      this._service.getAllDepartments()
        .subscribe(departments => {
          if (!departments[0].status){
            this._router.navigate(['blank']);
          }
          this.allDepartments = departments[0].departments
          console.log("====== ALL Departments FROM RESULT: ", departments[0].departments);
          console.log("====== ALL Departments TO SHOW: ", this.allDepartments);
        }); 
    }    
    //*********** Tehsil **********//
    showEditTehsilModal(name, itemId, configId){
      console.log("show Tehsil MOdal called with parameters: ", name, itemId, configId);
      this.editTehsilModal.show();

      (<FormGroup>this.editConfigForm).setValue({'name':name}, { onlySelf: true });
      this.itemId = itemId;
      this.editConfigId = configId;
    }
    hideEditTehsilModal(){
      this.editTehsilModal.hide();
    }

    editTehsil(values){
      console.log("Edit Tehsil called with: ",values.name, this.itemId, this.editConfigId);
      this._service.editTehsil(values.name, this.itemId, this.editConfigId)
        .subscribe(result => {
          console.log("Slected Tehsil : ", result);
          if (!result[0].status){
            this._router.navigate(['blank']);
          }
          this.getAllConfigs();
          this.itemId = "";
          this.editConfigId = "";
          this._buildEditConfigForm();
      });
    }
    addNewTehsil(values, $event){
      $event.preventDefault();
      var newTehsil = {name: values.name, 
                   district: values.district}
      console.log("New Departmet name: ", newTehsil);
      this._service.addNewTehsil(newTehsil)
        .subscribe(result => {
          console.log("Result from new Depatment: ", result);
          if (!result[0].status){
            this._router.navigate(['blank']);
          }
          this._buildAddTehsilForm();
          this.getAllTehsils();
        });
    }
    getAllTehsils(){
      this.allTehsils = [];
      this._service.getAllTehsils()
        .subscribe(tehsils => {
          if (!tehsils[0].status){
            this._router.navigate(['blank']);
          }
          this.allTehsils = tehsils[0].tehsils
          console.log("====== ALL TEHSILS FROM RESULT: ", tehsils[0].tehsils);
          console.log("====== ALL TEHSILS TO SHOW: ", this.allTehsils);
        }); 
    }
    // *********** Facility type configs *********** //
    showEditFacilTypeModal(name, itemId, configId){
      console.log("show Tehsil MOdal called with parameters: ", name, itemId, configId);
      this.editFacilTypeModal.show();

      (<FormGroup>this.editConfigForm).setValue({'name':name}, { onlySelf: true });
      this.itemId = itemId;
      this.editConfigId = configId;
    }
    hideEditFacilTypeModal(){
      this.editFacilTypeModal.hide();
    }
    editFacilType(values){
      console.log("Edit Facility Type called ", values.name, this.itemId, this.editConfigId);
      this._service.editFacilType(values.name, this.itemId, this.editConfigId)
        .subscribe(result => {
          console.log("Slected Facility type : ", result);
          if (!result[0].status){
            this._router.navigate(['blank']);
          }
          this.getAllConfigs();
          this.itemId = "";
          this.editConfigId = "";
          this._buildEditConfigForm();
      });
    }
    addNewFacilType(newType, $event){
      $event.preventDefault();
      newType = newType.name;
      console.log("New Departmet name: ", newType);
      this._service.addNewFacilType(newType)
        .subscribe(result => {
          console.log("Result from new Depatment: ", result);
          if (!result[0].status){
            this._router.navigate(['blank']);
          }
          this._buildNewConfigForm();
          this.getAllConfigs();
        });
    }
    // *********** Medicine type configs *********** //
    showEditMediTypeModal(name, itemId, configId){
      console.log("show Tehsil MOdal called with parameters: ", name, itemId, configId);
      this.editMediTypeModal.show();

      (<FormGroup>this.editConfigForm).setValue({'name':name}, { onlySelf: true });
      this.itemId = itemId;
      this.editConfigId = configId;
    }
    hideEditMediTypeModal(){
      this.editMediTypeModal.hide();
    }
    editMediType(values){
      console.log("Edit Medi Type called : ", values.name, this.itemId, this.editConfigId);
      this._service.editMediType(values.name, this.itemId, this.editConfigId)
        .subscribe(result => {
          console.log("Slected department : ", result);
          if (!result[0].status){
            this._router.navigate(['blank']);
          }
          this.getAllConfigs();
          this.itemId = "";
          this.editConfigId = "";
          this._buildEditConfigForm();
      });
    }
    addNewMediType(newType, $event){
      $event.preventDefault();
      newType = newType.name;
      console.log("New Departmet name: ", newType);
      this._service.addNewMediType(newType)
        .subscribe(result => {
          console.log("Result from new Depatment: ", result);
          if (!result[0].status){
            this._router.navigate(['blank']);
          }
          this._buildNewConfigForm();
          this.getAllMediType();
        });
    }
    getAllMediType(){
      this.allTehsils = [];
      this._service.getAllMediType()
        .subscribe(meditype => {
          if (!meditype[0].status){
            this._router.navigate(['blank']);
          }
          this.allMediType = meditype[0].meditypes
          console.log("====== ALL MEDICINE TYPE FROM RESULT: ", meditype[0].meditypes);
          console.log("====== ALL MEDICINE TYPE TO SHOW: ", this.allMediType);
        }); 
    }    
    // *********** Medicine Unit configs *********** //
    showEditMediUnitModal(name, itemId, configId){
      console.log("show Tehsil MOdal called with parameters: ", name, itemId, configId);
      this.editMediUnitModal.show();

      (<FormGroup>this.editConfigForm).setValue({'name':name}, { onlySelf: true });
      this.itemId = itemId;
      this.editConfigId = configId;
    }
    hideEditMediUnitModal(){
      this.editMediUnitModal.hide();
    }    
    editMediUnit(values){
      console.log("Edit Department called ", values.name, this.itemId, this.editConfigId);
      this._service.editMediUnit(values.name, this.itemId, this.editConfigId)
        .subscribe(result => {
          console.log("Slected department : ", result);
          if (!result[0].status){
            this._router.navigate(['blank']);
          }
          this.getAllConfigs();
          this.itemId = "";
          this.editConfigId = "";
          this._buildEditConfigForm();
      });
    }
    addNewMediUnit(newType, $event){
      $event.preventDefault();
      newType = newType.name;
      console.log("New Departmet name: ", newType);
      this._service.addNewMediUnit(newType)
        .subscribe(result => {
          console.log("Result from new Depatment: ", result);
          if (!result[0].status){
            this._router.navigate(['blank']);
          }
          this._buildNewConfigForm();
          this.getAllMediUnit();
        });
    }
    getAllMediUnit(){
      this.allTehsils = [];
      this._service.getAllMediUnit()
        .subscribe(mediunit => {
          if (!mediunit[0].status){
            this._router.navigate(['blank']);
          }
          this.allMediUnit = mediunit[0].mediunit
          console.log("====== ALL Medi Unit FROM RESULT: ", mediunit[0].mediunit);
          console.log("====== ALL Medi Unit TO SHOW: ", this.allMediUnit);
        }); 
    }     
    // *********** Facilities configs *********** //
    showEditFacilityModal(name, itemId, configId){
      console.log("show Tehsil MOdal called with parameters: ", name, itemId, configId);
      this.editFacilityModal.show();

      (<FormGroup>this.editConfigForm).setValue({'name':name}, { onlySelf: true });
      this.itemId = itemId;
      this.editConfigId = configId;
    }
    hideEditFacilityModal(){
      this.editFacilityModal.hide();
    }     
    editFacility(values){
      console.log("Edit Department called ", values.name, this.itemId, this.editConfigId);
      this._service.editFacility(values.name, this.itemId, this.editConfigId)
        .subscribe(result => {
          console.log("Slected department : ", result);
          if (!result[0].status){
            this._router.navigate(['blank']);
          }
          this.getAllConfigs();
          this.itemId = "";
          this.editConfigId = "";
          this._buildEditConfigForm();
      });
    }
    addNewFacility(newType, $event){
      $event.preventDefault();
      newType = newType.name;
      console.log("New Departmet name: ", newType);
      this._service.addNewFacility(newType)
        .subscribe(result => {
          console.log("Result from new Depatment: ", result);
          if (!result[0].status){
            this._router.navigate(['blank']);
          }
          this._buildNewConfigForm();
          this.getAllConfigs();
        });
    }    
    // *********** Medicine Measurement Unit configs *********** //
    showEditMediMesUnitModal(name, itemId, configId){
      console.log("show Tehsil MOdal called with parameters: ", name, itemId, configId);
      this.editMediMesUnitModal.show();

      (<FormGroup>this.editConfigForm).setValue({'name':name}, { onlySelf: true });
      this.itemId = itemId;
      this.editConfigId = configId;
    }
    hideEditMediMesUnitModal(){
      this.editMediMesUnitModal.hide();
    }     
    editMediMesUnit(values){
      console.log("Edit Department called ", values.name, this.itemId, this.editConfigId);
      this._service.editMediMesUnit(values.name, this.itemId, this.editConfigId)
        .subscribe(result => {
          console.log("Slected department : ", result);
          if (!result[0].status){
            this._router.navigate(['blank']);
          }
          this.getAllConfigs();
          this.itemId = "";
          this.editConfigId = "";
          this._buildEditConfigForm();
      });
    }
    addNewMesUnit(newType, $event){
      $event.preventDefault();
      newType = newType.name;
      console.log("New Departmet name: ", newType);
      this._service.addNewMesUnit(newType)
        .subscribe(result => {
          console.log("Result from new Depatment: ", result);
          if (!result[0].status){
            this._router.navigate(['blank']);
          }
          this._buildNewConfigForm();
          this.getAllMediMesUnit();
        });
    }
    getAllMediMesUnit(){
      this.allTehsils = [];
      this._service.getAllMediMesUnit()
        .subscribe(medimesunit => {
          if (!medimesunit[0].status){
            this._router.navigate(['blank']);
          }
          this.allMediMesUnit = medimesunit[0].medimesunit
          console.log("====== ALL Medi Unit FROM RESULT: ", medimesunit[0].medimesunit);
          console.log("====== ALL Medi Unit TO SHOW: ", this.allMediMesUnit);
        }); 
    }
    // ****** Get All Configurations ****** //
    getAllConfigs(){
      this.allConfigs = [];
      this._service.allConfigs()
        .subscribe(configs => {
          if (!configs[0].status){
            this._router.navigate(['blank']);
          }
          this.allConfigs = configs[0].configs[0];
          // this.allDepartments = configs[0].department;
          console.log("all configs are : ", this.allConfigs);
          // console.log("all departments configs are : ", this.allDepartments);
      });
    }



    // ********** Routing Fucntions **********//
    goToConfig(name){
      this.selected = name;
      console.log("configs called", name);
    }
    goBack(){
      this.selected = null;
      this.filterQuery = '';
      this._buildAllForms();
      // this.getAllConfigs();
    }
    logout(){
        this._loginService.logout();
    }
    goToRoute(name){
      this._router.navigate([name]);
    }

}