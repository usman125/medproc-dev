import {Component, ElementRef, ViewChild} from '@angular/core';
import {LoginService} from '../../services/login.services'
import {TenderService} from '../../services/tender.service'
import {VendorService} from '../../services/vendor.service'
import {ConfigsService} from '../../services/configs.service'
import {ContractTemplateService} from '../../services/contracttemplate.service'
import {VendorContractService} from '../../services/vendorcontract.service'
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { Tender } from '../../models/tender';
import * as moment from "moment";
import { ModalDirective } from 'ngx-bootstrap/modal/modal.component';
import { GlobalEventsManager } from "../../services/eventsmanager.service";
// import stringReplaceStream from 'string-replace-stream';
// import { fs } from '@angular2/fs'
declare var $ :any;
@Component({
    selector: 'contract-templates',
    providers: [TenderService, 
                ConfigsService, 
                VendorService, 
                ContractTemplateService, 
                VendorContractService],
    templateUrl: 'contracttemplates.html',
    styleUrls: ['contracttemplates.css']
})

export class contracttemplates {
    
    allTenders = [];
    allVendors = [];
    profileText = null;
    profileToSave: any = null;
    showVendorFlag: boolean = false;
    selectedTender: any;
    selectedVendor: any;
    addProfileForm: FormGroup;
    vendorName = "Yeah hai Vendor"; 
    vendorAddress = "Bhati Gate"; 
    allTemplates = [];
    objectToSave: any;
    addProfileFlag: boolean = false;
    singleProfile: boolean = false;
    selectedTemplate: any;
    selectedTemplateName: any;

    constructor(private _router: Router, 
                private _loginService: LoginService,
                private _formBuilder: FormBuilder,
                private _service: ContractTemplateService,
                private _tenderService: TenderService,
                private _vendorService: VendorService,
                private _vendorContractService: VendorContractService,
                private _eventMangaerService: GlobalEventsManager){
      this._buildAddProfileForm();
      this._eventMangaerService.showNavBar(true);
    }
    private _buildAddProfileForm(){
        this.addProfileForm = this._formBuilder.group({
            text: ["", Validators.required],
            name: ["", Validators.required]
        });
    }
    public options: Object = {
      placeholder: "Enter Profile",
      heightMin: 300,
      heightMax: 300,
      events : {
        'froalaEditor.focus' : function(e, editor) {
          console.log(editor.selection.get());
        }
      }
    }
    ngOnInit(){
        console.log("contract template generation");
        this._service.getAllContrcatTemplates()
            .subscribe(results => {
                if (!results[0].status){
                    this.allTemplates = [];
                }
                this.allTemplates = results[0].results
                console.log("Result from all templates: ", this.allTemplates);
        });
    }
    addProfile(values, $event){
        var newString = null;
        var year = moment().format('YYYY');
        var tenderName = "name of tender";
        console.log("Frola Text: ", this.profileText);
        values.text = this.profileText;
        console.log("values: ", values.text);
        newString = values.text.toString().replace(/vendor/g, this.vendorName);
        newString = newString.toString().replace(/VendorAddress/g, this.vendorAddress);
        newString = newString.toString().replace(/cY/g, year);
        newString = newString.toString().replace(/tdN/g, tenderName);
        newString = newString.toString().replace(/meds/g, "Medicine List here")
        this.profileToSave = newString;
        console.log("new string: ", this.profileToSave);
        this.objectToSave = {"name":values.name, "profiletext": this.profileText};
        console.log("OBJECT TO SAVE: ", this.objectToSave);
        this.profileText = "";
        // this.saveProfile(objectToSave);

    }
    saveProfile(){
        console.log("Save Profile Called: ");
        this._service.addContractTemplate(this.objectToSave)
        .subscribe(result=> {
            if (result[0].status){
                console.log("Result from add: ", result[0].result);
            }
            this.profileToSave = null;
            this._buildAddProfileForm();
        });
    }
    getSignleTemplate(templateId){
        console.log("SIGNLE TEMPLATE CALLED: ", templateId);
        this._service.getSignleTemplate(templateId)
            .subscribe(result => {
                if (!result[0].status){
                    this.selectedTemplate = null;
                }
                this.selectedTemplate = result[0].result.profiletext;
                this.selectedTemplateName = result[0].result.name;
                console.log("SELECTED PRFOILE HTML: ", this.selectedTemplate);
                this.singleProfile = true;
                this.selectedTemplate = this.selectedTemplate.toString().replace(/vendor/g, "YAHAN VENDOR NAME")
                this.selectedTemplate = this.selectedTemplate.toString().replace(/meds/g, "MEDICINE LIST HERE")
            });
    }

    showAddTemplateForm(){
        this.addProfileFlag = true;
    }
    hideAddTemplateForm(){
        this.addProfileFlag = false;
        this.ngOnInit();
    }
    hdieSingleProfile(){
        this.singleProfile = false;
    }
    // replaceAll(str, find, replace) {
    //     return str.toString().replace(new RegExp(find, 'g'), replace);
    // }
}