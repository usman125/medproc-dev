import {Component, ElementRef, Compiler} from '@angular/core';
import {LoginService} from '../../services/login.services';
import { Location } from '@angular/common';
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalEventsManager } from "../../services/eventsmanager.service";
@Component({
    selector: 'login-form',
    providers: [LoginService],
    // template: '<h1>Login Page</h1>'
    // ,
    templateUrl: 'login.html',
    styleUrls: ['login.css']
})

export class Login {
       
   email: any;     
   password: any;     
   tasks = [];
   authUser = null;
   errorMsg = null;

   loginForm: FormGroup

   constructor(private _router: Router,
               private _compiler: Compiler,
               private _location: Location,
               private _formBuilder: FormBuilder,
               private _eventMangaerService: GlobalEventsManager, 
               private _service: LoginService){
     this._buildLoginForm()
   }

   private _buildLoginForm(){
     this.loginForm = this._formBuilder.group({
       username:['', Validators.required],
       password:['', Validators.required]
     })
   }

    getCredentials(values){
        this.email = values.username
        this.password = values.password
        console.log("Entered Email is: ", this.email);
        console.log("Entered Email is: ", this.password);
        this._service.getTasks(this.email, this.password)
          .subscribe(tasks => {
            console.log("taaska after user pasS: ", tasks);
            if (tasks.length != 0){
              this.tasks = tasks;
              localStorage.setItem("userid", tasks[0]._id);
              localStorage.setItem("userrole", tasks[0].role);
              this.authUser = localStorage.getItem('userid');
              console.log("AUTHNTICATED USER AFTER TASKS: ", this.authUser);
              console.log("SUBSCRIBED TASKS: ", tasks);
              this._eventMangaerService.showNavBar(true);
              var userRole = localStorage.getItem('userrole');
              //this._compiler.clearCache();
              
              console.log("USER ROLE", userRole);
              if (userRole === 'deo'){
                //this._router.navigate(['prequalification']);
                window.location.href = '/#/prequalification'
              }else if(userRole === 'user'){
                //this._router.navigate(['demands']);
                window.location.href = '/#/userdashboard'
              }else if(userRole === 'pco'){
                //this._router.navigate(['demands']);
                window.location.href = '/#/pcohome'
                //this._router.navigate(['demands']);
              }else{
                //this._router.navigate(['home']);
                window.location.href = '/#/home'
              }
            }else{
              this.errorMsg = "Invalid Credentials";
              console.log("Error message: ", this.errorMsg);
            }
        });
    }

}