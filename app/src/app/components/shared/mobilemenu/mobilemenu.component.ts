import { Component, OnInit, Renderer, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { ROUTES } from '../../../app.routes';
import { GlobalEventsManager } from "../../../services/eventsmanager.service";
import {LoginService} from '../../../services/login.services'

@Component({
    moduleId: module.id,
    selector: 'navbar-cmp',
    templateUrl: 'mobilemenu.component.html'
})

export class MobileMenu implements OnInit{
    private listTitles: any[];
    location: Location;
    private nativeElement: Node;
    private toggleButton;
    private sidebarVisible: boolean;
    showNavBar: boolean = false;
    @ViewChild("navbar-cmp") button;
    userRole: any = null;
    constructor(location:Location,
                private _loginService: LoginService, 
                private renderer : Renderer, 
                private element : ElementRef,
                private _eventMangaerService: GlobalEventsManager) {
            this.location = location;
            this.nativeElement = element.nativeElement;
            this.sidebarVisible = false;
    }

    ngOnInit(){
        // this.listTitles = ROUTES.filter(listTitle => listTitle);
        var navbar : HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
        // var userRole = localStorage.getItem('userrole');
        // console.log("USER ROLE FROM MOBILE NAV: ", userRole);

        this.userRole = localStorage.getItem('userrole');
    }
    // getTitle(){
    //     var titlee = window.location.pathname;
    //     titlee = titlee.substring(1);
    //     for(var item = 0; item < this.listTitles.length; item++){
    //         if(this.listTitles[item].path === titlee){
    //             return this.listTitles[item].title;
    //         }
    //     }
    //     return 'Dashboard';
    // }
    sidebarToggle(){
        var toggleButton = this.toggleButton;
        var body = document.getElementsByTagName('body')[0];

        if(this.sidebarVisible == false){
            setTimeout(function(){
                toggleButton.classList.add('toggled');
            },500);
            body.classList.add('nav-open');
            this.sidebarVisible = true;
        } else {
            this.toggleButton.classList.remove('toggled');
            this.sidebarVisible = false;
            body.classList.remove('nav-open');
        }
    }
    logout(){
        this._eventMangaerService.showNavBar(false);
        this._loginService.logout();
    }
}
