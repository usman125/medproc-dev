import {Component, ElementRef, ViewChild} from '@angular/core';
import {LoginService} from '../../../services/login.services'
import {TenderService} from '../../../services/tender.service'
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from "moment";
import { GlobalEventsManager } from "../../../services/eventsmanager.service";

@Component({
    moduleId: module.id,
    selector: 'nav-bar',
    providers: [TenderService],
    templateUrl: 'nav.html',
    styleUrls: ['nav.css']
})

export class nav {
  
  showNavBar: boolean = false;
  isMobileMenu: boolean = true;
  adminNav = [];
  pcoNav = [];
  deoNav = [];
  userNav = [];
  roleBasedNav = []
  userRole; 
  
  constructor(private _loginService: LoginService,
              private _eventMangaerService: GlobalEventsManager){
    
  }
  ngOnInit(){
    this._eventMangaerService.showNavBarEmitter.subscribe((mode)=>{
      // mode will be null the first time it is created, so you need to igonore it when null
      if (mode !== null) {
        this.showNavBar = mode;
      }
        this.isNotMobileMenu();
        this.userRole = localStorage.getItem('userrole');
        console.log("ROles FROM NG ON", this.userRole)
    });
    // if (this.userRole==='admin'){
    //   this.roleBasedNav = ['users','tenders','vendors','configs','medicines']
    // } else if (this.userRole==='pco'){
    //   this.roleBasedNav = ['tenders','financialbidding']
    // }
    this.getNav()
  }
  getNav(){
      this._loginService.getRolesNav()
          .subscribe(navbar => {
      console.log("ROles Nav bar +++++++++++++",navbar)
            this.roleBasedNav = navbar[0].navbar;
            console.log("ROles FROM NG ON", this.roleBasedNav);
            for (let nav of this.roleBasedNav){
              //if (nav.role === 'admin'){
                this.adminNav.push(nav)
                //}
            //   }if (nav.role === 'pco'){
            //     this.pcoNav.push(nav)
            //   }if (nav.role === 'user'){
            //     this.userNav.push(nav)
            //   }if (nav.role === 'deo'){
            //     this.deoNav.push(nav)
            //   }
            // }
            }
            console.log("ALLL NAVS: \n", 
                        "1- Admin:", this.adminNav)
          });
  }
  logout(){
    this._eventMangaerService.showNavBar(false);
    this._loginService.logout();
  }
  isNotMobileMenu(){
      if((window.screen.width) > 991){
        this.isMobileMenu = false;
          return this.isMobileMenu;
      }
        this.isMobileMenu = true;
      return this.isMobileMenu;
  }

}