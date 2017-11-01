import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { LoginService } from './services/login.services';
import { UsersService } from './services/users.service';
import { TenderService } from './services/tender.service';
import { VendorService } from './services/vendor.service';
import { MedicineService } from './services/medicine.service';
import { DemandService } from './services/demand.service';
import { GoodsRecievedService } from './services/goodsrecieved.service';
import { ConfigsService } from './services/configs.service';
import { GlobalEventsManager } from "./services/eventsmanager.service";
import { AttachmentService } from './services/attachment.service';
import { AppComponent } from './app.component';
import { SchemaFormModule, WidgetRegistry, DefaultWidgetRegistry } from "angular2-schema-form";
import { DynamicFormsCoreModule } from "@ng2-dynamic-forms/core";
import { DynamicFormsBasicUIModule } from "@ng2-dynamic-forms/ui-basic";
import { DynamicFormsBootstrapUIModule } from "@ng2-dynamic-forms/ui-bootstrap";
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { Login, 
         Home, 
         tender,
         editTender, 
         vendor, 
         prequalification, 
         nav, 
         configs, 
         medicine, 
         demand, 
         editdemand, 
         financialbidding,
         passedbids, 
         purchaseorder, 
         goodsrecieved, 
         blank, 
         DataFilterPipe,
         TenderFilterPipe,
         DemandFilterPipe,
         VendorFilterPipe,
         MedicineFilterPipe,
         preQualiFilterPipe,
         techQualiFilterPipe,
         technicalqualification,
         pcohome,
         pcosingledemand,
         userSingleDemand,
         vendorprequali,
         vendortechquali,
         tenderdepartments,
         tenderddistricts,
         contracts,
         tenderdddemands,
         contracttemplates,
         blacklistrequest,
         userdashboard,
         blacklistvendor,
         MobileMenu,
         editUser } from './components/component-index';
import { ROUTES } from './app.routes';
import { AuthGuard } from './_gaurds/auth.gaurd'
import { AlertModule, DatepickerModule, PopoverModule, TooltipModule, ModalModule  } from 'ngx-bootstrap';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { BusyModule, BusyConfig, BUSY_CONFIG_DEFAULTS } from 'angular2-busy';
const busyConfig: BusyConfig = {
    // message: 'Processing..',
    // delay: 200,
    // template: BUSY_CONFIG_DEFAULTS.template,
    // minDuration: BUSY_CONFIG_DEFAULTS.minDuration,
    // backdrop: true,
    // wrapperClass: BUSY_CONFIG_DEFAULTS.wrapperClass
    message: 'Please Wait!',
    backdrop: true,
    template: '<div class="busy-msg"><img src="assets/img/peploading.gif">{{message}}</div>',
    delay: 200,
    minDuration: 600,
    wrapperClass: 'busy-container'
};

@NgModule({
  declarations: [
    AppComponent,
    Login, 
    Home,
    tender,
    editTender,
    vendor,
    nav,
    configs,
    medicine,
    demand,
    editdemand,
    financialbidding, 
    passedbids,
    purchaseorder,
    goodsrecieved,
    blank,
    DataFilterPipe,
    TenderFilterPipe,
    DemandFilterPipe,
    VendorFilterPipe,
    MedicineFilterPipe,
    preQualiFilterPipe,
    techQualiFilterPipe,    
    prequalification,
    technicalqualification,
    MobileMenu,
    pcohome,
    pcosingledemand,
    userSingleDemand,
    vendorprequali,
    vendortechquali,
    tenderdepartments,
    tenderddistricts,
    contracts,
    contracttemplates,
    blacklistrequest,
    blacklistvendor,
    userdashboard,
    tenderdddemands,
    editUser
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    BusyModule.forRoot(<BusyConfig>({
            message: 'Please Wait!',
            backdrop: true,
            template: '<div class="busy-msg"><img src="assets/img/peploading.gif">{{message}}</div>',
            delay: 200,
            minDuration: 600,
            wrapperClass: 'busy-container'
        })),
    ModalModule.forRoot(),
    DatepickerModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forRoot(ROUTES, { useHash: true }),
    DynamicFormsCoreModule.forRoot(),
    FroalaEditorModule.forRoot(), 
    AccordionModule.forRoot(), 
    FroalaViewModule.forRoot(),
    DynamicFormsBasicUIModule, 
    DynamicFormsBootstrapUIModule,
    SchemaFormModule,
    AngularMultiSelectModule
  ],
  providers: [LoginService, 
              AuthGuard, 
              UsersService,
              ConfigsService,
              GlobalEventsManager, 
              {provide: WidgetRegistry, useClass: DefaultWidgetRegistry} 
             ],
  exports: [nav, SchemaFormModule, MobileMenu],
  bootstrap: [AppComponent]
})
export class AppModule { }
