import { Component, ElementRef, OnInit, Compiler } from '@angular/core';
import { LoginService } from '../../services/login.services'
import { UsersService } from '../../services/users.service'
import { ConfigsService } from '../../services/configs.service'
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { GlobalEventsManager } from "../../services/eventsmanager.service";

@Component({
    selector: 'home-page',
    providers: [LoginService, 
                UsersService,
                ConfigsService],
    templateUrl: 'home.html',
    styleUrls: ['home.css']
})

export class Home implements OnInit{
    
    allUsers: any = [];
    authUser = null;
    loggedUser = null;
    
    allDepartments: any = [];
    departmentDropdownList = [];
    selectedDepartmentItems = [];
    
    allTehsils: any = [];
    tehsilDropdownList = [];
    selectedTehsilItems = [];    

    allDistricts: any = [];
    districtDropdownList = [];
    selectedDistrictItems = [];    


    roleDropdownList = [];
    selectedRoleItems = [];
    

    DepartmentDropdownSettings = {};
    TehsilDropdownSettings = {};
    DistrictDropdownSettings = {};
    RoleDropdownSettings = {};

    filterQuery: any = null
    filterOption: any = null
  


    public modalRef: BsModalRef;
    public config = {
        animated: true,
        keyboard: false,
        backdrop: true,
        ignoreBackdropClick: true
    }
    public userFormFlag: boolean = false;
    addUserForm: FormGroup;

    constructor(private _router: Router, 
                private _compiler: Compiler, 
                private _service: LoginService, 
                private _usersService: UsersService, 
                private _configsService: ConfigsService, 
                private _modalService: BsModalService,
                private _formBuilder: FormBuilder,
                private _eventMangaerService: GlobalEventsManager){
    }
    tickets: any;
    ngOnInit(){
      var userRole = localStorage.getItem('userrole');

      if (userRole==='pco'){
        this._router.navigate[('tenders')]
       }
      console.log("HOME INIIT User Role",userRole)
     // if (userRole==='admin'){
        this._compiler.clearCache();
        this.authUser = localStorage.getItem('userid');
        // console.log("AUTH USER F|ROME HOME COMPONENT: ", this.authUser);
        this._buildAddUserForm();
        this._eventMangaerService.showNavBar(true);
        this.getAllUSers();
        this.showDepartmentDropdown();
        this.showTehsilDropdown();
        this.showDistrictDropDown();
        this.showRoleDropDown();

        this._service.getAuthUser(this.authUser)
          .subscribe(user => {
            this.loggedUser = user[0];
            this.authUser = localStorage.getItem('userid');
            
        });
      
    }

    changeFilter($event){
      this.filterOption = $event
    }

    _buildAddUserForm(){
        this.addUserForm = this._formBuilder.group({
          name: ["", Validators.compose([Validators.required, Validators.minLength(3)])],
          email: ["", Validators.compose([Validators.required])],
          password: ["", Validators.required],
          designation: ["", Validators.required],
          username: ["", Validators.required],
          role: ["", Validators.required],
          department: ["", Validators.required],
          district: ["", Validators.required],
          tehsil: ["", Validators.required]
          // ,
          // facilityType: ["", Validators.required],
          // facilityName: ["", Validators.required]
        });
        
    }
    showDepartmentDropdown(){
      this._configsService.getAllDepartments()
        .subscribe(departments => {
          if (!departments[0].status){
            //this._router.navigate(['blank']);
          }
          this.allDepartments = departments[0].departments;
          console.log("ALL Departments: ", this.allDepartments);
          for (let i=0; i<this.allDepartments.length; i++){
            var department = {"id":this.allDepartments[i]._id, 
                              "itemName":this.allDepartments[i].name}
            this.departmentDropdownList.push(department);
          }
          console.log("ALL DROPDOWNS DEPARTMENTS: ", this.departmentDropdownList);
          this.DepartmentDropdownSettings = {singleSelection: true, text:"Select Department", enableSearchFilter: true};
      });
    }
    showTehsilDropdown(){
      this._configsService.getAllTehsils()
        .subscribe(tehsils => {
          if (!tehsils[0].status){
            //this._router.navigate(['blank']);
          }
          this.allTehsils = tehsils[0].tehsils;
          console.log("ALL Tehsils: ", this.allTehsils);
          for (let i=0; i<this.allTehsils.length; i++){
            var tehsil = {"id":this.allTehsils[i]._id, 
                              "itemName":this.allTehsils[i].name}
            this.tehsilDropdownList.push(tehsil);
          }
        });
        this.TehsilDropdownSettings = {singleSelection: true, text:"Select Tehsil", enableSearchFilter: true};
        console.log("ALL DROPDOWNS Tehsil: ", this.tehsilDropdownList);
    }

    showDistrictDropDown(){
      this._configsService.getAllDistricts()
        .subscribe(districts => {
          if (!districts[0].status){
            //this._router.navigate(['blank']);
          }
          this.allDistricts = districts[0].districts;
          console.log("ALL Tehsils: ", this.allDistricts);
          for (let i=0; i<this.allDistricts.length; i++){
            var district = {"id":this.allDistricts[i]._id, 
                              "itemName":this.allDistricts[i].name}
            this.districtDropdownList.push(district);
          }
        });
        this.DistrictDropdownSettings = {singleSelection: true, text:"Select District", enableSearchFilter: true};
        console.log("ALL DROPDOWNS District: ", this.districtDropdownList);
    }
    showRoleDropDown(){
        this.roleDropdownList = [{"id":1, 
                              "itemName":"admin"},
                                {"id":2, 
                              "itemName":"deo"},
                              {"id":3, 
                              "itemName":"pco"},
                              {"id":4, 
                              "itemName":"user"},
                              {"id":5, 
                              "itemName":"superadmin"}];
          
        this.RoleDropdownSettings = {singleSelection: true, text:"Select Role", enableSearchFilter: true};
        console.log("ALL DROPDOWNS District: ", this.roleDropdownList);      
        
    }
    onItemSelect(item){
      console.log('Selected Item:', item.itemName);
      this._configsService.getTehsilsByDistrict(item.itemName)
          .subscribe(tehsils => {
            if (!tehsils[0].status){
                this._router.navigate(['blank']);
            }
            console.log("AL TEHSILS AFTER Query: ", tehsils);
            this.allTehsils = [];
            this.tehsilDropdownList = [];
            this.selectedTehsilItems = [];

            this.allTehsils = tehsils[0].tehsils;
            console.log("AL TEHSILS AFTER DISTRICT CHANGE: ", this.allTehsils);
            for (let i=0; i<this.allTehsils.length; i++){
              var tehsil = {"id":this.allTehsils[i]._id, 
                                "itemName":this.allTehsils[i].name}
              this.tehsilDropdownList.push(tehsil);
            }
            console.log("All tehsils dropdown after district change: ", this.tehsilDropdownList);
          });
    }

    OnItemDeSelect(item){
        console.log('De-Selected Item:');
        console.log(item);
        // this._ref.detectionChanges();
    }
    onTehsilSelect(item){
        console.log('Selected Item:');
        console.log(item);
        // this._ref.detectionChanges();
    }
    OnTehsilDeSelect(item){
        console.log('De-Selected Item:');
        console.log(item);
        // this._ref.detectionChanges();
    }
    addUser(user, $event){
        $event.preventDefault();
        var newDep = {"_id":user.department[0].id,
                    "name":user.department[0].itemName};
        // console.log("new user department is: ", user.department[0]);
        user.department = newDep;
        var newTehsil = {"_id":user.tehsil[0].id,
                    "name":user.tehsil[0].itemName}
        // console.log("new user tehsil is: ", user.tehsil[0]);
        user.tehsil = newTehsil;
        
        var newDistrict = {"_id":user.district[0].id,
                    "name":user.district[0].itemName}
        // console.log("new user tehsil is: ", user.tehsil[0]);
        user.district = newDistrict;        

        var newRole = user.role[0].itemName;
        // console.log("new user tehsil is: ", user.tehsil[0]);
        user.role = newRole;


        console.log("new user to add is: ", user);
        this._usersService.addUser(user)
          .subscribe(result => {
            console.log("result from add user: ", result);
            if (!result[0].status){
              this._router.navigate(['blank']);
            }
            this.hideUserForm();
            this.getAllUSers();
        });
    }

    getAllUSers(){
      this.allUsers = [];
      this._usersService.getAllUsers()
        .subscribe(users => {
          console.log("ALL USERS: ", users);
          if (!users[0].status){
            //this._router.navigate(['blank']);
          }
          this.allUsers = users[0].users;
      });
    }

    showUserForm(){
        this.userFormFlag = true;
    }
    hideUserForm(){
        this._buildAddUserForm();
        this.selectedDistrictItems = [];
        this.selectedRoleItems = [];
        this.selectedTehsilItems = [];
        this.selectedDepartmentItems = [];
        this.userFormFlag = false;
    }

    editUser(userId){
      console.log("USER TO EDIT:====", userId);
      var userString = 'editUser/'+userId
      this._router.navigate([userString])
    }

    // ********** Routing Fucntions **********//
    logout(){
        this.authUser = null;
        this._service.logout();
    }
    goToRoute(name){
      this._router.navigate([name]);
    }
}