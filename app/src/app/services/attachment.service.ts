import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import * as moment from "moment";

@Injectable()
export class AttachmentService {
    constructor(private http: Http, 
                private _router: Router){
      console.log('Attachment Service Initialized...');
    }
    addAttachment(file){
      return this.http.post("http://localhost:8008/api/attachment", file)
        .map(res => res.json());
    }
}