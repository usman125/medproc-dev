import { Component, ElementRef, OnInit, Compiler } from '@angular/core';
import { LoginService } from '../../../services/login.services'
import { UsersService } from '../../../services/users.service'
import { ConfigsService } from '../../../services/configs.service'
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { User } from '../../../models/user';
import { GlobalEventsManager } from "../../../services/eventsmanager.service";
import 'rxjs/add/operator/switchMap';

@Component({
    selector: 'edit-user',
    providers: [LoginService, 
                UsersService,
                ConfigsService],
    templateUrl: 'edituser.html',
    styleUrls: ['edituser.css']
})

export class editUser{
    
    editUserForm: FormGroup;
    userToEdit: any = null;

    constructor(private _router: Router, 
                private _route: ActivatedRoute,
                private _compiler: Compiler, 
                private _service: LoginService, 
                private _usersService: UsersService, 
                private _configsService: ConfigsService, 
                private _modalService: BsModalService,
                private _formBuilder: FormBuilder,
                private _eventMangaerService: GlobalEventsManager){
      this._buildEditUserForm()
    }

    private _buildEditUserForm(){
      this.editUserForm = this._formBuilder.group({
        name: ['', Validators.required],
        email: ['', Validators.required],
        password: ['', Validators.required]
      })
    }

    ngOnInit(){
      this._eventMangaerService.showNavBar(true);
      this._route.paramMap
        .switchMap((params: ParamMap) => 
          this._usersService.getSingleUserToEdit(params.get('edituserId')))
            .subscribe(user => {
                console.log("USER FROM EDIT USER ONINIT:===", user);
                this.userToEdit = user[0].user[0]
                console.log("USER INFO TO EDIT", this.userToEdit);
                (<FormGroup>this.editUserForm).setValue({'name':this.userToEdit.name,
                                               'email':this.userToEdit.email,
                                               'password':this.userToEdit.password}, { onlySelf: true });
      })
    }

    editUser(values){
      console.log("VALUES FROM EDIT FORM:===", values)
      values._id = this.userToEdit._id
      this._usersService.editUser(values)
          .subscribe(user => {
            console.log("RESULT AFTER EDIT:----", user)
          })
    }

    hideEditUser(){
        this._router.navigate(['home'])
    }
}