import { Component, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { LoginService } from '../../../services/login.services'
import { DemandService } from '../../../services/demand.service'
import { UsersService } from '../../../services/users.service'
import { TenderService } from '../../../services/tender.service'
import { ConfigsService } from '../../../services/configs.service'
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import * as moment from "moment";
import { GlobalEventsManager } from "../../../services/eventsmanager.service";
import 'rxjs/add/operator/switchMap';
import { Subscription } from 'rxjs';


@Component({
    selector: 'edittender',
    providers: [DemandService,  
                ConfigsService,
                TenderService ],
    templateUrl: 'edittender.html',
    styleUrls: ['edittender.css']
})

export class editTender {

  editTenderForm: FormGroup
  selectedTender: any = null
  selectedTenderId: any = null

  constructor(private _router: Router,
              private _activatedRoute: ActivatedRoute, 
              private _location: Location, 
              private _formBuilder: FormBuilder, 
              private _demandService: DemandService,
              private _userService: UsersService,
              private _tenderService: TenderService,
              private _loginService: LoginService,
              private _configsService: ConfigsService,
              private _eventMangaerService: GlobalEventsManager){
    this._buildEditTenderForm()
    this._eventMangaerService.showNavBar(true);
  }

  private _buildEditTenderForm(){
    this.editTenderForm = this._formBuilder.group({
      name: ['name', Validators.required]
    })
  }

  ngOnInit() {
    this._activatedRoute.params.subscribe(params => {
      this.selectedTender = params['tenderId']; // (+) converts string 'id' to a number
      console.log("CATEGORY ID TO ADD SUB CATEGORY:-----", this.selectedTender)
      this._tenderService.editTender(this.selectedTender)
        .subscribe(tender => {
          console.log("TENDER RESULT : +++++++", tender);
          if (!tender[0].status){
            this._router.navigate(['blank'])
          } else {
            console.log("TENDER RESULT : +++++++", tender[0].tender);
            (<FormGroup>this.editTenderForm).setValue({'name':tender[0].tender.name}, 
                                                      { onlySelf: true });
          }
      });
    });  
  }

  editTender(values){  
    console.log("TENDER SELECTED : +++++++", values, "TENDER ID:---", this.selectedTender)
    this._tenderService.updaeTender(values.name, this.selectedTender)
      .subscribe(result => {
        console.log("RESULT AFTER TENDER UPDATEL: +++++++", result)
        this._router.navigate(['tenders'])
    })
  }

  goBack(){
    this._router.navigate(['tenders'])
    // this._location.back()
  }

  // ********** Routing Fucntions **********//
  logout(){
      this._loginService.logout();
  }

  goToRoute(name){
    this._router.navigate([name]);
  }

}