import { Component } from '@angular/core';
import { LoginService } from './services/login.services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [LoginService]
})
export class AppComponent {
  
  email: any; 	
  password: any; 	
  tasks = [];
  constructor(private _service: LoginService){}

  getCredentials(){
  	// console.log("Entered Email is: ", this.email);
  	// console.log("Entered Email is: ", this.password);
  	this._service.getTasks(this.email, this.password)
		    .subscribe(tasks => {
          this.tasks = tasks;
          console.log("SUBSCRIBED TASKS: ", tasks);
    });
  }
  logout(){
      this._service.logout();
  }
}
